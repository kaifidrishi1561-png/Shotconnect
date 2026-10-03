'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type ProfileState = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  location?: string;
  bio?: string;
  experience?: number;
  specializations?: string[];
  photographyStyles?: string[];
  equipment?: string[];
  availability?: string[];
  pricing?: {
    basePackage?: number;
    additionalDayRate?: number;
  };
};

const emptyProfile: ProfileState = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'PHOTOGRAPHER',
  location: '',
  bio: '',
  experience: 2,
  specializations: ['Product'],
  photographyStyles: ['Studio'],
  equipment: ['Camera'],
  availability: ['Weekdays'],
  pricing: { basePackage: 8000, additionalDayRate: 2500 }
};

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileState>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        const payload = response.data?.data || response.data || {};
        const user = payload.user || payload || {};
        const profile = payload.profile || {};

        const nextForm: ProfileState = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          role: user.role || 'PHOTOGRAPHER',
          location: profile.location || user.location || '',
          bio: profile.bio || '',
          experience: profile.experience || user.experience || 2,
          specializations: profile.specializations || user.specializations || ['Product'],
          photographyStyles: profile.photographyStyles || user.photographyStyles || ['Studio'],
          equipment: profile.equipment || user.equipment || ['Camera'],
          availability: profile.availability || user.availability || ['Weekdays'],
          pricing: {
            basePackage: profile.pricing?.basePackage || user.pricing?.basePackage || 8000,
            additionalDayRate: profile.pricing?.additionalDayRate || user.pricing?.additionalDayRate || 2500
          }
        };

        setForm(nextForm);
      } catch (err) {
        console.error('Failed to load profile', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleChange = (field: keyof ProfileState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayField = (field: 'specializations' | 'photographyStyles' | 'equipment' | 'availability', value: string) => {
    const parsed = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    setForm((prev) => ({ ...prev, [field]: parsed }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const role = (form.role || 'PHOTOGRAPHER').toUpperCase();
      const payload = {
        bio: form.bio,
        location: form.location,
        experience: Number(form.experience || 0),
        specializations: form.specializations || [],
        photographyStyles: form.photographyStyles || [],
        equipment: form.equipment || [],
        availability: form.availability || [],
        pricing: {
          basePackage: Number(form.pricing?.basePackage || 0),
          additionalDayRate: Number(form.pricing?.additionalDayRate || 0)
        }
      };

      if (role === 'PHOTOGRAPHER') {
        await api.put('/photographers/profile', payload);
      } else if (role === 'BRAND') {
        await api.put('/brands/profile', payload);
      } else if (role === 'STYLIST') {
        await api.put('/stylists/profile', payload);
      }

      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-12 w-72 animate-pulse rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Profile</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">Update profile</h1>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">First name</label>
            <input
              value={form.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Last name</label>
            <input
              value={form.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              disabled
              value={form.email || ''}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <input
              disabled
              value={form.role || 'PHOTOGRAPHER'}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <input
              value={form.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Bio</label>
            <textarea
              value={form.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Experience (years)</label>
            <input
              type="number"
              min={0}
              value={form.experience || 0}
              onChange={(e) => handleChange('experience', Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Base package (₹)</label>
            <input
              type="number"
              min={0}
              value={form.pricing?.basePackage || 0}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  pricing: { ...prev.pricing, basePackage: Number(e.target.value) }
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Specializations</label>
            <input
              value={(form.specializations || []).join(', ')}
              onChange={(e) => handleArrayField('specializations', e.target.value)}
              placeholder="Product, Lifestyle, Editorial"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Photography styles</label>
            <input
              value={(form.photographyStyles || []).join(', ')}
              onChange={(e) => handleArrayField('photographyStyles', e.target.value)}
              placeholder="Studio, Outdoor, Commercial"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Equipment</label>
            <input
              value={(form.equipment || []).join(', ')}
              onChange={(e) => handleArrayField('equipment', e.target.value)}
              placeholder="Canon 5D, Light kit, Drone"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Availability</label>
            <input
              value={(form.availability || []).join(', ')}
              onChange={(e) => handleArrayField('availability', e.target.value)}
              placeholder="Weekdays, Weekends"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
