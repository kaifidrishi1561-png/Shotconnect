export function Hero() {
  return (
    <section className="container-shell py-20">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            Trusted marketplace for product storytelling
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Book the right product photography team for your next launch.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            ShotMatch matches e-commerce brands with vetted photographers, stylists, and studios for high-converting product content.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/register" className="rounded-xl bg-brand-600 px-5 py-3 font-medium text-white shadow-soft hover:bg-brand-700">
              Start a project
            </a>
            <a href="/photographers" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 hover:border-slate-300">
              Explore talent
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Brand match score</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">94%</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Excellent</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Projects" value="1.8k" />
              <Stat label="Photographers" value="420" />
              <Stat label="Avg. rating" value="4.9" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
