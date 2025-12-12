import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, RegisterInput, LoginInput } from '../types';
import { generateToken } from '../utils/jwt';
import {
  generateVerificationCode,
  sendVerificationEmail,
} from '../utils/emailService.mailgun';
import { createDefaultCategoriesForUser } from '../utils/categoryHelper';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name }: RegisterInput = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with email verification required
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerificationCode: verificationCode,
        verificationCodeExpiry: verificationExpiry,
        isEmailVerified: false, // Require email verification
      },
      select: {
        id: true,
        email: true,
        name: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verificationCode);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue registration even if email fails
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification code.',
      user,
      requiresVerification: true, // Email verification required
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginInput = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      res.status(403).json({
        error: 'Email not verified',
        message: 'Please verify your email before logging in',
        requiresVerification: true,
      });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ error: 'Email and verification code are required' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if already verified
    if (user.isEmailVerified) {
      res.status(400).json({ error: 'Email already verified' });
      return;
    }

    // Check if code matches
    if (user.emailVerificationCode !== code) {
      res.status(400).json({ error: 'Invalid verification code' });
      return;
    }

    // Check if code expired
    if (!user.verificationCodeExpiry || user.verificationCodeExpiry < new Date()) {
      res.status(400).json({
        error: 'Verification code expired',
        message: 'Please request a new verification code',
      });
      return;
    }

    // Update user as verified
    await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailVerificationCode: null,
        verificationCodeExpiry: null,
      },
    });

    // Create default categories for the user
    try {
      await createDefaultCategoriesForUser(user.id);
    } catch (categoryError) {
      console.error('Failed to create default categories:', categoryError);
      // Continue even if category creation fails
    }

    // Generate token for automatic login
    const token = generateToken(user.id);

    res.json({
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: true,
      },
      token,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resendVerificationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if already verified
    if (user.isEmailVerified) {
      res.status(400).json({ error: 'Email already verified' });
      return;
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new code
    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationCode: verificationCode,
        verificationCodeExpiry: verificationExpiry,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, user.name, verificationCode);
      res.json({
        message: 'Verification code sent successfully. Please check your email.',
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  } catch (error) {
    console.error('Resend verification code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
