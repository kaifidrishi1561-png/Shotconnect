'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUserData(response.data?.data || {});
      } catch (error) {
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const firstName = userData.firstName || 'User';
  const role = (userData.role || 'BRAND').toLowerCase();
  const roleLabel = userData.role || 'Brand';

  const metrics = [
    { label: 'Active projects', value: '12', tone: 'bg-violet-50 text-violet-700' },
    { label: 'Proposals', value: '24', tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Booked shoots', value: '8', tone: 'bg-amber-50 text-amber-700' },
    { label: 'Response rate', value: '94%', tone: 'bg-sky-50 text-sky-700' }
  ];

  const actions = role === 'photographer'
    ? [
        { label: 'View new briefs', href: '/photographers' },
        { label: 'Update portfolio', href: '/profile' },
        { label: 'Share availability', href: '/photographer/dashboard' }
      ]
    : [
        { label: 'Create project', href: '/brand/projects/create' },
        { label: 'Browse photographers', href: '/photographers' },
        { label: 'Review proposals', href: '/brand/projects' }
      ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_error) {
      // ignore backend errors and continue with local redirect
    }

    document.cookie = 'accessToken=; Max-Age=0; path=/; SameSite=Lax';
    document.cookie = 'refreshToken=; Max-Age=0; path=/; SameSite=Lax';
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Dashboard</p>
              <h1 className="mt-3 text-4xl font-black text-slate-900">Welcome back, {firstName}</h1>
              <p className="mt-2 text-slate-600">
                {roleLabel} workspace is ready. Here is your latest activity summary.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">{roleLabel}</div>
                <div>{userData.email || 'No email found'}</div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${metric.tone}`}>
                {metric.label}
              </div>
              <div className="mt-4 text-3xl font-black text-slate-900">{metric.value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
                {roleLabel}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleNavigate(action.href)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900">Recent activity</h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-600">
              <li className="rounded-xl bg-slate-50 p-3">
                <div className="font-semibold text-slate-900">New proposal received</div>
                <div className="mt-1">A photographer applied to your latest launch brief.</div>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <div className="font-semibold text-slate-900">Portfolio updated</div>
                <div className="mt-1">Your latest campaign preview is now live.</div>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <div className="font-semibold text-slate-900">Shoot scheduled</div>
                <div className="mt-1">The production team has confirmed your next session.</div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
