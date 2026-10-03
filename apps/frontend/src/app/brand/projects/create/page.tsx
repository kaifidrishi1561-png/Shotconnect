'use client';

import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

function CreateProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: 'Fashion',
    productName: '',
    numberOfProducts: 1,
    requiredPhotos: 20,
    photographyStyle: 'Studio',
    backgroundRequirement: 'Clean white',
    modelRequired: false,
    propsRequired: false,
    videoRequired: false,
    description: '',
    referenceImages: [''],
    budget: 15000,
    location: 'Bengaluru',
    deadline: '',
    additionalInstructions: ''
  });

  useEffect(() => {
    const selectedPhotographerName = searchParams.get('photographerName');
    const locationFromQuery = searchParams.get('location');
    const budgetFromQuery = searchParams.get('budget');

    if (selectedPhotographerName) {
      setForm((prev) => ({
        ...prev,
        title: `${selectedPhotographerName} shoot`,
        productName: selectedPhotographerName,
        location: locationFromQuery || prev.location,
        budget: Number(budgetFromQuery || prev.budget),
        description: `Booking request for ${selectedPhotographerName}. Please share availability and next steps.`
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        referenceImages: form.referenceImages.filter(Boolean),
        numberOfProducts: Number(form.numberOfProducts),
        requiredPhotos: Number(form.requiredPhotos),
        budget: Number(form.budget)
      };

      const response = await api.post('/projects', payload);

      if (response.data?.success) {
        router.push('/brand/projects');
        return;
      }

      setError(response.data?.message || 'Unable to create project');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-shell py-12">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Brand</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Create photography brief</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Project title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option>Fashion</option>
              <option>Beauty</option>
              <option>Home Decor</option>
              <option>Jewellery</option>
              <option>Accessories</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Product name</label>
            <input
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Number of products</label>
            <input
              type="number"
              min={1}
              value={form.numberOfProducts}
              onChange={(e) => setForm({ ...form, numberOfProducts: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Required photos</label>
            <input
              type="number"
              min={1}
              value={form.requiredPhotos}
              onChange={(e) => setForm({ ...form, requiredPhotos: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Photography style</label>
            <input
              value={form.photographyStyle}
              onChange={(e) => setForm({ ...form, photographyStyle: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Budget (₹)</label>
            <input
              type="number"
              min={0}
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Additional instructions</label>
            <textarea
              value={form.additionalInstructions}
              onChange={(e) => setForm({ ...form, additionalInstructions: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.modelRequired}
              onChange={(e) => setForm({ ...form, modelRequired: e.target.checked })}
            />
            <label className="text-sm text-slate-700">Model required</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.propsRequired}
              onChange={(e) => setForm({ ...form, propsRequired: e.target.checked })}
            />
            <label className="text-sm text-slate-700">Props required</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.videoRequired}
              onChange={(e) => setForm({ ...form, videoRequired: e.target.checked })}
            />
            <label className="text-sm text-slate-700">Video required</label>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand-600 px-5 py-3 font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function CreateProjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8" />}>
      <CreateProjectForm />
    </Suspense>
  );
}
