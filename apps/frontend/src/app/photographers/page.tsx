'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Photographer = {
  _id: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    location?: string;
  };
  location?: string;
  experience?: number;
  averageRating?: number;
  pricing?: { basePackage?: number };
  specializations?: string[];
  photographyStyles?: string[];
};

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const response = await api.get('/photographers');
        setPhotographers(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch photographers', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographers();
  }, []);

  return (
    <main className="container-shell py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Photographers</h1>
          <p className="text-slate-600">Discover vetted talent for your next product shoot.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {photographers.map((photographer) => {
            const firstName = photographer.user?.firstName || 'Photographer';
            const lastName = photographer.user?.lastName || '';
            const location = photographer.location || photographer.user?.location || 'India';
            const rating = photographer.averageRating ?? 4.5;
            const budget = photographer.pricing?.basePackage ?? 8000;
            const tags = photographer.specializations?.length ? photographer.specializations : photographer.photographyStyles || ['Product'];

            return (
              <article key={photographer._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-500 to-slate-900" />
                  <div>
                    <h2 className="font-semibold text-slate-900">{firstName} {lastName}</h2>
                    <p className="text-sm text-slate-500">{location}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>⭐ {rating.toFixed(1)}</span>
                  <span>₹{budget.toLocaleString()}+/project</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{tag}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-xs text-slate-500">Exp: {photographer.experience ?? 3}+ yrs</span>
                  <Link
                    href={`/photographers/${photographer._id}`}
                    className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    View profile
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
