'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type Vendor = {
  id: string;
  name: string;
  domain: string;
  subDomain: string | null;
  email: string;
  city: string | null;
  country: string | null;
  status: VendorStatus;
  rating: number | null;
};

export default function HomePage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/vendors');
        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error('Failed to load vendors', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = vendors.length;
  const approved = vendors.filter((v) => v.status === 'APPROVED').length;
  const pending = vendors.filter((v) => v.status === 'PENDING').length;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute left-1/2 bottom-[-10rem] h-96 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 md:px-8 md:py-14">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
              IT Vendor Database
            </h1>
            <p className="mt-2 text-sm text-slate-300 md:text-base">
              Central master for software, cloud, cybersecurity and IT service vendors.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97, y: 0 }}
            className="glass neon-border flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-100"
            onClick={() => {
              window.location.href = '/vendors/new';
            }}
          >
            <span className="text-lg">＋</span>
            Add IT Vendor
          </motion.button>
        </header>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total Vendors"
            value={total}
            subtitle="All onboarded IT vendors"
          />
          <StatCard
            label="Approved"
            value={approved}
            subtitle="Qualified & approved vendors"
            accent="from-emerald-400 to-emerald-200"
          />
          <StatCard
            label="Pending Evaluation"
            value={pending}
            subtitle="In pipeline"
            accent="from-amber-300 to-orange-200"
          />
        </section>

        {/* Table */}
        <section className="glass neon-border mt-4 flex-1 overflow-hidden p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">Vendor Directory</h2>
              <p className="text-xs text-slate-300 md:text-sm">
                Browse, filter and manage all IT vendors from one place.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center text-slate-300">
              Loading vendors…
            </div>
          ) : vendors.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center text-slate-300">
              <p className="font-medium">No vendors added yet.</p>
              <p className="mt-1 text-sm text-slate-400">
                Click on <span className="font-semibold text-cyan-300">“Add IT Vendor”</span> to create your first record.
              </p>
            </div>
          ) : (
            <div className="overflow-auto rounded-2xl border border-white/10 bg-slate-950/40">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">Domain</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v, idx) => (
                    <motion.tr
                      key={v.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="cursor-pointer border-t border-white/5 bg-slate-900/40 hover:bg-slate-800/60"
                      onClick={() => {
                        window.location.href = `/vendors/${v.id}`;
                      }}
                    >
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-slate-50">{v.name}</div>
                        <div className="text-xs text-slate-400">
                          {v.subDomain ? v.subDomain : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                          {v.domain}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-200">
                        {v.city || v.country
                          ? `${v.city ?? ''}${v.city && v.country ? ', ' : ''}${v.country ?? ''}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-200">
                        {v.email}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusPill status={v.status} />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {typeof v.rating === 'number' ? (
                          <span className="text-amber-300">
                            {'★'.repeat(v.rating).padEnd(5, '☆')}
                          </span>
                        ) : (
                          <span className="text-xs italic text-slate-500">
                            Not rated
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  accent = 'from-cyan-300 to-indigo-300',
}: {
  label: string;
  value: number;
  subtitle: string;
  accent?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="glass relative overflow-hidden p-[1px]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-40 blur-2xl`} />
      <div className="relative flex h-full flex-col justify-between rounded-3xl bg-slate-950/70 px-4 py-4 md:px-5 md:py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function StatusPill({ status }: { status: VendorStatus }) {
  const styles: Record<VendorStatus, { label: string; classes: string }> = {
    PENDING: {
      label: 'Pending',
      classes: 'bg-amber-500/10 text-amber-300 border-amber-400/40',
    },
    APPROVED: {
      label: 'Approved',
      classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
    },
    REJECTED: {
      label: 'Rejected',
      classes: 'bg-rose-500/10 text-rose-300 border-rose-400/40',
    },
  };

  const s = styles[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${s.classes}`}
    >
      {s.label}
    </span>
  );
}

