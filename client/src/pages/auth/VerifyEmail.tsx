import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

interface VerifyEmailFormData {
  code: string;
}

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get email from location state
  const email = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>();

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error('No email provided. Please register again.');
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyEmail(email, data.code);
      login(response.token, response.user);
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await authService.resendVerificationCode(email);
      toast.success('Verification code sent! Please check your email.');
      setCountdown(60); // 60 seconds cooldown
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <div className="mt-6 mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-900/30">
            <svg
              className="h-8 w-8 text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            We've sent a 6-digit code to
          </p>
          <p className="mt-1 text-sm font-medium text-white">{email}</p>
          <p className="mt-2 text-xs text-gray-400">
            The code will expire in 10 minutes
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              autoComplete="off"
              maxLength={6}
              error={errors.code?.message}
              className="text-center text-2xl tracking-widest"
              {...register('code', {
                required: 'Verification code is required',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Code must be 6 digits',
                },
              })}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Verify Email
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || isResending}
              className="text-sm font-medium text-primary-400 hover:text-primary-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isResending
                ? 'Sending...'
                : countdown > 0
                ? `Resend code in ${countdown}s`
                : 'Resend verification code'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Back to register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
