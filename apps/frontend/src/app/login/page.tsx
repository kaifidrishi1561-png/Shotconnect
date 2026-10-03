'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data?.success) {
        router.push('/home');
        router.refresh();
        return;
      }

      setError(response.data?.message || 'Login failed');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-14 top-10 h-56 w-56 rounded-full bg-violet-300/35 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-44 w-44 rounded-full bg-pink-200/30 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/90 shadow-[0_45px_130px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
        <div className="login-visual relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="login-pattern absolute inset-0 opacity-30" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-200 backdrop-blur-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              ShotMatch
            </div>

            <h1 className="mt-10 max-w-md text-4xl font-black leading-[1.08] tracking-[-0.04em] text-white">
              Welcome back to your creative marketplace.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Manage projects, discover photographers, and streamline brand collaborations in one place.
            </p>
          </div>

        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-violet-600">ShotMatch</p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Home
            </Link>
          </div>

          <div className="login-animate mt-10">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-600">Access your dashboard and manage bookings.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-animate mt-8 space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-slate-800 placeholder:text-slate-400 transition duration-200 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-violet-600 transition hover:text-violet-700">Forgot password?</a>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2.5 py-2 transition duration-200 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-0 bg-transparent px-1 py-2 text-slate-800 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="shrink-0 cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 px-4 py-3.5 font-semibold text-white shadow-[0_18px_35px_rgba(99,102,241,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="relative z-10">{loading ? 'login...' : 'Login'}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            New here?{' '}
            <Link href="/register" className="font-semibold text-violet-600 transition hover:text-violet-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
