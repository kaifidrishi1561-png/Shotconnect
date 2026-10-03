export default function AdminDashboardPage() {
  return (
    <main className="container-shell py-12">
      <h1 className="text-3xl font-bold text-slate-900">Admin dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value="334" />
        <StatCard label="Projects" value="482" />
        <StatCard label="Revenue" value="₹18.3L" />
        <StatCard label="Commission" value="₹2.6L" />
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
