'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Project = {
  _id: string;
  title: string;
  category: string;
  productName: string;
  status: string;
  budget: number;
  location: string;
  requiredPhotos: number;
  createdAt: string;
};

export default function BrandProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data?.data || []);
      } catch (error) {
        console.error('Failed to load projects', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <main className="container-shell py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My projects</h1>
          <p className="text-slate-600">Track your active shoots and recent campaigns.</p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/brand/projects/create')}
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + New project
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">
          <p className="text-lg font-semibold text-slate-900">No projects yet</p>
          <p className="mt-2 text-sm text-slate-600">Create your first product photography brief to start matching with photographers.</p>
          <button
            type="button"
            onClick={() => router.push('/brand/projects/create')}
            className="mt-5 inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Create project
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <article key={project._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">{project.status}</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">{project.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {project.productName} · {project.category} · {project.location}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                  ₹{Number(project.budget || 0).toLocaleString()}
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                <div>
                  <span className="block text-xs uppercase tracking-wide text-slate-400">Photos</span>
                  {project.requiredPhotos}
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide text-slate-400">Created</span>
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide text-slate-400">Location</span>
                  {project.location}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
