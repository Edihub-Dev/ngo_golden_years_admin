'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { AuthService } from '@/lib/api';
import { validationRules, Validator } from '@/lib/validation';

export default function VerifyOTP() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get mobile from sessionStorage
    const storedMobile = sessionStorage.getItem('resetMobile');
    if (!storedMobile) {
      router.push('/forgot-password');
      return;
    }
    setMobile(storedMobile);
  }, [router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Clear errors
    if (errors.otp) {
      setErrors({});
    }

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join('');
    const error = Validator.validateField(otpValue, validationRules.otp, 'OTP');
    if (error) {
      setErrors({ otp: error });
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.forgotPasswordVerifyOTP(mobile, otpValue);

      if (response.success) {
        // Store OTP for reset-password page
        sessionStorage.setItem('resetOTP', otpValue);
        router.push('/reset-password');
      } else {
        setErrors({ otp: response.error?.message || 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    try {
      const response = await AuthService.forgotPasswordSendOTP(mobile);
      if (response.success) {
        setResendTimer(30);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setErrors({ otp: response.error?.message || 'Failed to resend OTP.' });
      }
    } catch {
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('min-h-screen', 'bg-zinc-50', 'flex', 'items-center', 'justify-center', 'px-4', 'py-4', 'relative')}>
      {/* Back Button */}
      <Link href="/forgot-password" className={cn('absolute', 'top-4', 'left-4', 'inline-flex', 'items-center', 'text-blue-600', 'hover:text-blue-700', 'text-sm')}>
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
              <ShieldCheckIcon className={cn('h-8', 'w-8', 'text-blue-600')} />
            </div>
            <h1 className={cn('text-xl', 'font-semibold', 'text-zinc-900')}>Verify OTP</h1>
            <p className={cn('mt-0.5', 'text-xs', 'text-zinc-500')}>
              Enter the 6-digit code sent to <span className="font-medium">{mobile}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Enter OTP
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold bg-gray-100 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                  />
                ))}
              </div>
              {errors.otp && <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
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
                {loading ? 'Verifying...' : 'Verify OTP'}
                <span>→</span>
              </button>
            </div>

            {/* Resend Timer */}
            <div className={cn('text-center', 'text-sm')}>
              {resendTimer > 0 ? (
                <span className="text-zinc-500">
                  Resend OTP in <span className="font-semibold">{resendTimer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-emerald-700 font-semibold hover:text-emerald-800 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
