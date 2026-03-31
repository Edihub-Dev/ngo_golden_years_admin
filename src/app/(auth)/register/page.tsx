'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { cn } from "@/lib/utils";

export default function Register() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!fullName.trim()) nextErrors.fullName = 'Full name is required';

    if (phone.trim().length !== 10) nextErrors.phone = 'Enter a valid 10-digit phone number';

    if (!address.trim()) {
      nextErrors.address = 'Address is required';
    }

    if (!password) nextErrors.password = 'Password is required';

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
      const { authApi } = await import('@/lib/api');
      
      const response = await authApi.register({ 
        name: fullName, 
        mobile: phone, 
        password,
        address
      });
      
      if (response.success) {
        alert('Registration successful! Redirecting to login...');
        router.push('/login');
      } else {
        alert(response.error?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Mobile number might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('min-h-screen', 'bg-zinc-50', 'flex', 'items-center', 'justify-center', 'px-4', 'py-4', 'relative')}>
      {/* Back Button - Outside box, top left */}
      <Link href="/login" className={cn('absolute', 'top-4', 'left-4', 'inline-flex', 'items-center', 'text-blue-600', 'hover:text-blue-700', 'text-sm')}>
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
            <h1 className={cn('text-xl', 'font-semibold', 'text-zinc-900')}>Create Your Account</h1>
            <p className={cn('mt-0.5', 'text-xs', 'text-zinc-500')}>Join Careon in a few simple steps</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                className="w-full px-4 py-1 bg-gray-100 border-0 rounded-3xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all h-9 text-sm"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 0000000000"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                maxLength={10}
                className="w-full px-4 py-1 bg-gray-100 border-0 rounded-3xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all h-9 text-sm"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter your location / address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                }}
                className="w-full px-4 py-1 bg-gray-100 border-0 rounded-3xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all h-9 text-sm"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            {/* Password Fields - Side by side */}
            <div className={cn('grid', 'grid-cols-2', 'gap-3')}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    className="w-full px-4 py-1 bg-gray-100 border-0 rounded-3xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all pr-10 h-9 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    className="w-full px-4 py-1 bg-gray-100 border-0 rounded-3xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:bg-white transition-all pr-10 h-9 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full',
                  'h-9',
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
                {loading ? 'Registering...' : 'Register'}
                <span>→</span>
              </button>
            </div>

            {/* Login Link */}
            <div className={cn('pt-1', 'text-center', 'text-sm', 'text-zinc-600')}>
              Already have an account?{' '}
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
