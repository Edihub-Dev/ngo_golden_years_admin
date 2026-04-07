'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DevicePhoneMobileIcon,
  LockClosedIcon,
  LockOpenIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export default function AdminLogin() {
  const router = useRouter();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const { AuthService } = await import('@/lib/api');
      const { AuthManager } = await import('@/lib/auth');
      const response = await AuthService.login({ mobile, password });
      if (response.success && response.data) {
        const { token, user } = response.data as { token: string; user: any };
        AuthManager.getInstance().setToken(token);
        AuthManager.getInstance().setUser(user);
        router.push('/admin');
      } else {
        setErrors({ general: response.error?.message || 'Invalid credentials. Access denied.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Cannot connect to server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: ShieldCheckIcon, label: 'Role-Based Security', desc: 'Admin & Sub-admin tiers' },
    { icon: ChartBarIcon, label: 'Real-time Analytics', desc: 'Live dashboard metrics' },
    { icon: UsersIcon, label: 'Member Management', desc: 'Full citizen registry' },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-slate-950">
      {/* Left Panel — Dark Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950" />
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-indigo-900/40 rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShieldCheckIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm tracking-tight">Golden Years Care Foundation</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Admin Control</p>
            </div>
          </div>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-6">Golden Years Care Foundation</p>
          <h1 className="text-5xl xl:text-6xl font-black text-white leading-[0.9] tracking-tighter mb-8">
            Welcome<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Back.❤️
            </span>
          </h1>
          <p className="text-slate-400 text-base font-medium leading-relaxed max-w-sm">
            Sign in to continue your care journey. Empowering dignified lives through compassionate elder care.
          </p>
        </motion.div>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 space-y-4"
        >
          {features.map(({ icon: Icon, label, desc }, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-xs font-black">{label}</p>
                <p className="text-slate-500 text-[10px] font-medium">{desc}</p>
              </div>
            </div>
          ))}

          {/* Live indicator */}
          <div className="pt-6 flex items-center gap-3">
            <div className="relative">
              <div className="h-2 w-2 bg-emerald-400 rounded-full" />
              <div className="absolute inset-0 h-2 w-2 bg-emerald-400 rounded-full animate-ping opacity-60" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              System Operational
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-white relative">
        {/* Top accent bar (mobile only) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 lg:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-slate-900 font-black text-sm">Golden Years Care Foundation</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>

          <div className="mb-10">
            <p className="text-blue-600 text-[11px] font-black uppercase tracking-[0.25em] mb-2">Golden Years Care Foundation</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm font-medium">Sign in to continue your care journey.</p>
          </div>

          {errors.general && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <div className="h-5 w-5 flex-shrink-0 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-[10px] font-black">!</span>
              </div>
              <p className="text-red-600 text-xs font-semibold">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mobile */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <DevicePhoneMobileIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+91 0000000000"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                    if (errors.mobile) setErrors((p) => ({ ...p, mobile: '' }));
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>
              {errors.mobile && <p className="mt-1.5 text-sm font-semibold text-red-500">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                  }}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
                >
                  {showPassword ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm font-semibold text-red-500">{errors.password}</p>}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-3 text-base"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="http://localhost:3000"
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
            >
              ← Main Portal
            </Link>
            <p className="text-[11px] font-medium text-slate-300">Authorized Access Only</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
