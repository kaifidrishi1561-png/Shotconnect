import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Overview</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">Your dashboard</h1>
        <p className="mt-2 text-slate-600">
          Signed in as {user?.data?.email || 'your account'}.
        </p>
      </div>
    </main>
  );
}
