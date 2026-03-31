'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { authApi } from '@/lib/api';
import { validationRules, Validator } from '@/lib/validation';

export default function ForgotPassword() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const error = Validator.validateField(mobile, validationRules.mobile, 'Mobile number');
    if (error) {
      setErrors({ mobile: error });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await authApi.forgotPasswordSendOTP(mobile);

      if (response.success) {
        // Store mobile in sessionStorage for verify-otp page
        sessionStorage.setItem('resetMobile', mobile);
        router.push('/verify-otp');
      } else {
        setErrors({ mobile: response.error?.message || 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ mobile: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('min-h-screen', 'bg-zinc-50', 'flex', 'items-center', 'justify-center', 'px-4', 'py-4', 'relative')}>
      {/* Back Button */}
      <Link href="/login" className={cn('absolute', 'top-4', 'left-4', 'inline-flex', 'items-center', 'text-blue-600', 'hover:text-blue-700', 'text-sm')}>
        <ArrowLeftIcon className={cn('h-4', 'w-4', 'mr-1')} />
        Back to Login
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
              <PhoneIcon className={cn('h-8', 'w-8', 'text-blue-600')} />
            </div>
            <h1 className={cn('text-xl', 'font-semibold', 'text-zinc-900')}>Forgot Password?</h1>
            <p className={cn('mt-0.5', 'text-xs', 'text-zinc-500')}>
              Enter your mobile number and we&apos;ll send you an OTP to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                  if (errors.mobile) setErrors({});
                }}
                maxLength={10}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-3xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all h-12 text-sm"
              />
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
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
                {loading ? 'Sending OTP...' : 'Send OTP'}
                <span>→</span>
              </button>
            </div>

            {/* Login Link */}
            <div className={cn('pt-1', 'text-center', 'text-sm', 'text-zinc-600')}>
              Remember your password?{' '}
              <Link href="/login" className={cn('font-semibold', 'text-emerald-700', 'hover:text-emerald-800')}>
                Login
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
