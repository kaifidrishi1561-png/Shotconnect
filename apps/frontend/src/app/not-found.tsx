export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you requested could not be found.</p>
      </div>
    </main>
  );
}
