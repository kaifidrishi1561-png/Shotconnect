export default function BrandDashboardPage() {
  return (
    <main className="container-shell py-12">
      <h1 className="text-3xl font-bold text-slate-900">Brand dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Active projects" value="12" />
        <StatCard label="Proposals" value="28" />
        <StatCard label="Spend" value="₹2.4L" />
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
