'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';

type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type Vendor = {
  id: string;
  name: string;
  domain: string;
  subDomain: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  city: string | null;
  country: string | null;
  techStack: string | null;
  certifications: string | null;
  partnerStatus: string | null;
  experienceYears: number | null;
  employeeStrength: number | null;
  status: VendorStatus;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
};

export default function VendorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<VendorStatus>('PENDING');
  const [rating, setRating] = useState<number | ''>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/vendors/${id}`);
        if (!res.ok) throw new Error('Failed to load vendor');
        const data = await res.json();
        setVendor(data);
        setStatus(data.status);
        setRating(typeof data.rating === 'number' ? data.rating : '');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading vendor');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!vendor) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vendor,
          status,
          rating: rating === '' ? null : Number(rating),
        }),
      });
      if (!res.ok) throw new Error('Failed to update vendor');
      const updated = await res.json();
      setVendor(updated);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error updating vendor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!vendor) return;
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete vendor');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error deleting vendor');
      setDeleting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute left-1/2 bottom-[-10rem] h-96 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10 md:px-8 md:py-14">
        <header className="mb-2 flex items-center justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
              Vendor Profile
            </h1>
            <p className="mt-2 text-sm text-slate-300 md:text-base">
              View and update the evaluation status for this IT vendor.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="rounded-full border border-white/20 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80"
          >
            ← Back to Dashboard
          </button>
        </header>

        {loading ? (
          <div className="glass neon-border flex h-64 items-center justify-center text-slate-200">
            Loading vendor…
          </div>
        ) : error || !vendor ? (
          <div className="glass neon-border flex h-64 flex-col items-center justify-center text-center text-slate-200">
            <p className="font-semibold text-rose-300">Failed to load vendor</p>
            <p className="mt-2 text-sm text-slate-300">{error || 'Unknown error'}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
            {/* Left: details */}
            <motion.section
              className="glass neon-border h-full px-5 py-6 md:px-6 md:py-7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">
                    {vendor.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    {vendor.subDomain || vendor.domain}
                  </p>
                </div>
                <StatusBadge status={vendor.status} />
              </div>

              <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
                <InfoBlock
                  label="Primary Domain"
                  value={vendor.domain}
                />
                <InfoBlock
                  label="Sub-domain"
                  value={vendor.subDomain}
                />
                <InfoBlock
                  label="Email"
                  value={vendor.email}
                />
                <InfoBlock
                  label="Phone"
                  value={vendor.phone}
                />
                <InfoBlock
                  label="Website"
                  value={vendor.website}
                  isLink
                />
                <InfoBlock
                  label="Location"
                  value={
                    vendor.city || vendor.country
                      ? `${vendor.city ?? ''}${
                          vendor.city && vendor.country ? ', ' : ''
                        }${vendor.country ?? ''}`
                      : null
                  }
                />
                <InfoBlock
                  label="Experience (Years)"
                  value={
                    vendor.experienceYears !== null
                      ? String(vendor.experienceYears)
                      : null
                  }
                />
                <InfoBlock
                  label="Employee Strength"
                  value={
                    vendor.employeeStrength !== null
                      ? String(vendor.employeeStrength)
                      : null
                  }
                />
              </div>

              <div className="mt-6 grid gap-4 text-sm">
                <InfoBlock
                  label="Tech Stack"
                  value={vendor.techStack}
                />
                <InfoBlock
                  label="Certifications"
                  value={vendor.certifications}
                />
                <InfoBlock
                  label="Partner Status"
                  value={vendor.partnerStatus}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>
                  Created:{' '}
                  {new Date(vendor.createdAt).toLocaleString()}
                </span>
                <span className="hidden text-slate-500 md:inline">•</span>
                <span>
                  Last Updated:{' '}
                  {new Date(vendor.updatedAt).toLocaleString()}
                </span>
              </div>
            </motion.section>

            {/* Right: evaluation panel */}
            <motion.section
              className="glass neon-border h-full px-5 py-6 md:px-6 md:py-7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                Evaluation
              </h2>

              <div className="mt-4 space-y-4 text-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as VendorStatus)
                    }
                    className="w-full rounded-2xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setRating('');
                      } else {
                        const n = Number(val);
                        if (n >= 1 && n <= 5) setRating(n);
                      }
                    }}
                    className="w-full rounded-2xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
                    placeholder="4"
                  />
                  {typeof rating === 'number' && (
                    <div className="text-xs text-amber-300">
                      {'★'.repeat(rating).padEnd(5, '☆')}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">
                    Internal Notes (local only)
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
                    placeholder="Capture quick evaluation notes here… (these are not saved to DB in this v1)"
                  />
                  <p className="text-[10px] text-slate-500">
                    Note: For now, notes are not persisted in the database in this version.
                  </p>
                </div>

                {error && (
                  <p className="text-xs font-medium text-rose-400">
                    {error}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{
                      scale: saving ? 1 : 1.02,
                      y: saving ? 0 : -1,
                    }}
                    whileTap={{ scale: saving ? 1 : 0.98, y: 0 }}
                    className="glass neon-border flex-1 px-4 py-2 text-sm font-semibold text-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 rounded-2xl border border-rose-500/50 bg-rose-900/60 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-900/80 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting ? 'Deleting…' : 'Delete Vendor'}
                  </button>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </div>
    </main>
  );
}

function InfoBlock({
  label,
  value,
  isLink,
}: {
  label: string;
  value: string | null;
  isLink?: boolean;
}) {
  return (
    <div className="space-y-1 rounded-2xl border border-white/5 bg-slate-950/40 px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="text-sm text-slate-100">
        {!value ? (
          <span className="text-xs italic text-slate-500">Not provided</span>
        ) : isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-300 underline decoration-cyan-500/60 underline-offset-2"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VendorStatus }) {
  const map: Record<VendorStatus, { label: string; classes: string }> = {
    PENDING: {
      label: 'Pending Evaluation',
      classes: 'bg-amber-500/10 text-amber-300 border-amber-400/40',
    },
    APPROVED: {
      label: 'Approved Vendor',
      classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
    },
    REJECTED: {
      label: 'Rejected',
      classes: 'bg-rose-500/10 text-rose-300 border-rose-400/40',
    },
  };

  const s = map[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${s.classes}`}
    >
      {s.label}
    </span>
  );
}

