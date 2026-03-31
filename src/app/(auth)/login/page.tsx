'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DevicePhoneMobileIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const router = useRouter();
  
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!mobile.trim()) {
      nextErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      nextErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
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
      const { AuthManager } = await import('@/lib/auth');
      
      const response = await authApi.login({ mobile, password });
      
      if (response.success && response.data) {
        const { token, user } = response.data as { token: string; user: any };
        AuthManager.getInstance().setToken(token);
        AuthManager.getInstance().setUser(user);
        router.push('/admin');
      } else {
        setErrors({ general: response.error?.message || 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please check if the backend server is running.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-4 relative">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Golden Years</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Portal</h2>
          <p className="text-gray-500 text-sm">Sign in to access your administrative dashboard.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-zinc-100 px-6 py-8">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 rounded-xl text-red-600 text-sm text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }));
                  }}
                  maxLength={10}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all h-11 text-sm pr-10"
                />
                <DevicePhoneMobileIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all h-11 text-sm pr-10"
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

            {/* Remember Me */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rememberMe ? 'bg-emerald-600' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rememberMe ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
              <span className="ml-3 text-sm text-gray-600">Remember me for 30 days</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-full shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Logging in...' : 'Login'}
              <span>→</span>
            </button>

            {/* No Register Link for Admin */}
            <div className="text-center text-sm text-gray-500 pt-4">
              Authorized personnel only.
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
