'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type PhotographerProfile = {
  _id: string;
  bio?: string;
  location?: string;
  experience?: number;
  averageRating?: number;
  pricing?: { basePackage?: number; additionalDayRate?: number };
  specializations?: string[];
  photographyStyles?: string[];
  equipment?: string[];
  availability?: string[];
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    location?: string;
  };
};

export default function PhotographerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<PhotographerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        const response = await api.get(`/photographers/${id}`);
        setProfile(response.data?.data || null);
      } catch (error) {
        console.error('Failed to fetch photographer profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-bold text-slate-900">Photographer not found</h1>
          <button
            onClick={() => router.push('/photographers')}
            className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Back to photographers
          </button>
        </div>
      </main>
    );
  }

  const fullName = `${profile.user?.firstName || 'Photographer'} ${profile.user?.lastName || ''}`.trim();
  const location = profile.location || profile.user?.location || 'India';
  const rating = profile.averageRating ?? 4.5;
  const basePackage = profile.pricing?.basePackage ?? 8000;
  const tags = profile.specializations?.length ? profile.specializations : profile.photographyStyles || ['Product'];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/photographers" className="text-sm font-medium text-violet-600 hover:text-violet-700">
            ← Back to photographers
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-[180px_1fr]">
          <div className="h-40 w-40 rounded-full bg-gradient-to-br from-violet-600 to-slate-900" />

          <div>
            <h1 className="text-4xl font-black text-slate-900">{fullName}</h1>
            <p className="mt-2 text-lg text-slate-600">{location}</p>

            <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-slate-700">
              <span>⭐ {rating.toFixed(1)}</span>
              <span>₹{basePackage.toLocaleString()}+/project</span>
              <span>Exp: {profile.experience ?? 2}+ yrs</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{tag}</span>
              ))}
            </div>

            <div className="mt-7 rounded-2xl bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">About</h2>
              <p className="mt-2 text-slate-600">
                {profile.bio || 'This photographer has not added a bio yet, but their portfolio is ready for review.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Equipment</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              {(profile.equipment || ['Camera kit', 'Lighting setup']).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Availability</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              {(profile.availability || ['Weekdays', 'Weekends']).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href={{
              pathname: '/brand/projects/create',
              query: {
                photographerId: profile._id,
                photographerName: fullName,
                location,
                budget: String(basePackage)
              }
            }}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Book this photographer
          </Link>
        </div>
      </div>
    </main>
  );
}
