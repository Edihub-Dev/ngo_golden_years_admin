'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, LockClosedIcon, LockOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { AuthService } from '@/lib/api';

export default function ResetPassword() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get mobile and OTP from sessionStorage
    const storedMobile = sessionStorage.getItem('resetMobile');
    const storedOTP = sessionStorage.getItem('resetOTP');
    if (!storedMobile || !storedOTP) {
      router.push('/forgot-password');
      return;
    }
    setMobile(storedMobile);
    setOtp(storedOTP);
  }, [router]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!password) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await AuthService.resetPassword(mobile, otp, password);

      if (response.success) {
        setSuccess(true);
        // Clear session storage
        sessionStorage.removeItem('resetMobile');
        sessionStorage.removeItem('resetOTP');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setErrors({ general: response.error?.message || 'Failed to reset password. Please try again.' });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn('min-h-screen', 'bg-zinc-50', 'flex', 'items-center', 'justify-center', 'px-4', 'py-4')}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={cn('w-full', 'max-w-md')}
        >
          <div className={cn('rounded-3xl', 'bg-white', 'shadow-xl', 'ring-1', 'ring-zinc-100', 'px-5', 'py-8', 'text-center')}>
            <div className={cn('bg-green-100', 'w-20', 'h-20', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-6')}>
              <CheckCircleIcon className={cn('h-10', 'w-10', 'text-green-600')} />
            </div>
            <h1 className={cn('text-2xl', 'font-semibold', 'text-zinc-900', 'mb-2')}>Password Reset Successful!</h1>
            <p className={cn('text-zinc-500', 'mb-4')}>
              Your password has been reset successfully. Redirecting to login...
            </p>
            <Link
              href="/login"
              className={cn('inline-flex', 'items-center', 'text-emerald-700', 'font-semibold', 'hover:text-emerald-800')}
            >
              Go to Login →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-zinc-50', 'flex', 'items-center', 'justify-center', 'px-4', 'py-4', 'relative')}>
      {/* Back Button */}
      <Link href="/verify-otp" className={cn('absolute', 'top-4', 'left-4', 'inline-flex', 'items-center', 'text-blue-600', 'hover:text-blue-700', 'text-sm')}>
        <ArrowLeftIcon className={cn('h-4', 'w-4', 'mr-1')} />
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn('w-full', 'max-w-md')}
      >
        {/* Header */}
        <div className={cn('rounded-3xl', 'bg-white', 'shadow-xl', 'ring-1', 'ring-zinc-100', 'px-5', 'py-5')}>
          <div className={cn('text-center', 'mb-4')}>
            <div className={cn('bg-blue-100', 'w-16', 'h-16', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-4')}>
              <LockClosedIcon className={cn('h-8', 'w-8', 'text-blue-600')} />
            </div>
            <h1 className={cn('text-xl', 'font-semibold', 'text-zinc-900')}>Reset Password</h1>
            <p className={cn('mt-0.5', 'text-xs', 'text-zinc-500')}>
              Create a new password for your account.
            </p>
          </div>

          {errors.general && (
            <div className={cn('mb-4', 'p-3', 'bg-red-50', 'rounded-xl', 'text-red-600', 'text-sm', 'text-center')}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-3xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all h-12 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <LockOpenIcon className="h-5 w-5" /> : <LockClosedIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-3xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all h-12 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <LockOpenIcon className="h-5 w-5" /> : <LockClosedIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full',
                  'h-12',
                  'px-6',
                  'bg-emerald-600',
                  'hover:bg-emerald-700',
                  'disabled:bg-gray-300',
                  'disabled:cursor-not-allowed',
                  'text-white',
                  'font-semibold',
                  'rounded-3xl',
                  'shadow-lg',
                  'shadow-emerald-600/20',
                  'transition-all',
                  'flex',
                  'items-center',
                  'justify-center',
                  'gap-2',
                  'text-sm'
                )}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
                <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
