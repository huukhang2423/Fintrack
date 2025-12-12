import { Router } from 'express';
import {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerificationCode,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
  registerValidation,
  loginValidation,
  validateRequest,
} from '../middleware/validation';

const router = Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);
router.get('/me', authenticate, getMe);

export default router;
