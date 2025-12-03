'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function NewVendorPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setError(null);

    const body = {
      name: String(formData.get('name') || '').trim(),
      domain: String(formData.get('domain') || '').trim(),
      subDomain: String(formData.get('subDomain') || '').trim() || null,
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim() || null,
      website: String(formData.get('website') || '').trim() || null,
      city: String(formData.get('city') || '').trim() || null,
      country: String(formData.get('country') || '').trim() || null,
      techStack: String(formData.get('techStack') || '').trim() || null,
      certifications: String(formData.get('certifications') || '').trim() || null,
      partnerStatus: String(formData.get('partnerStatus') || '').trim() || null,
      experienceYears: formData.get('experienceYears')
        ? Number(formData.get('experienceYears'))
        : null,
      employeeStrength: formData.get('employeeStrength')
        ? Number(formData.get('employeeStrength'))
        : null,
      status: (formData.get('status') as VendorStatus) || 'PENDING',
      rating: formData.get('rating') ? Number(formData.get('rating')) : null,
    };

    if (!body.name || !body.domain || !body.email) {
      setError('Name, Domain and Email are mandatory.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create vendor');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
      setSubmitting(false);
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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10 md:px-8 md:py-14">
        <header className="mb-2 flex items-center justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
              Add IT Vendor
            </h1>
            <p className="mt-2 text-sm text-slate-300 md:text-base">
              Capture key details for software, cloud, cybersecurity and IT service vendors.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="rounded-full border border-white/20 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80"
          >
            ← Back to Dashboard
          </button>
        </header>

        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            handleSubmit(fd);
          }}
          className="glass neon-border relative max-h-[80vh] overflow-y-auto px-4 py-6 md:px-6 md:py-7"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left column */}
            <div className="space-y-4">
              <SectionTitle title="Basic Info" />

              <Field
                label="Vendor Name*"
                name="name"
                placeholder="M/s Brio Technologies"
                required
              />
              <Field
                label="Primary Domain*"
                name="domain"
                placeholder="Software Development / Cloud / Cybersecurity"
                required
              />
              <Field
                label="Sub-domain / Specialization"
                name="subDomain"
                placeholder="DevOps, SAP, SOC, MSP, etc."
              />
              <Field
                label="Official Email*"
                name="email"
                type="email"
                placeholder="contact@vendor.com"
                required
              />
              <Field
                label="Phone"
                name="phone"
                placeholder="+91-9876543210"
              />
              <Field
                label="Website"
                name="website"
                placeholder="https://www.vendor.com"
              />

              <SectionTitle title="Location" />
              <Field
                label="City"
                name="city"
                placeholder="Mumbai / Bangalore / Pune"
              />
              <Field
                label="Country"
                name="country"
                placeholder="India"
              />
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <SectionTitle title="Capabilities" />
              <Field
                label="Technology Stack"
                name="techStack"
                placeholder="React, Node, .NET, AWS, Azure, Kubernetes"
              />
              <Field
                label="Certifications"
                name="certifications"
                placeholder="ISO 27001, CMMI Level 3, SOC2"
              />
              <Field
                label="Partner Status"
                name="partnerStatus"
                placeholder="AWS Advanced Partner, Microsoft Gold Partner"
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Experience (Years)"
                  name="experienceYears"
                  type="number"
                  min={0}
                  placeholder="5"
                />
                <Field
                  label="Employee Strength"
                  name="employeeStrength"
                  type="number"
                  min={1}
                  placeholder="100"
                />
              </div>

              <SectionTitle title="Evaluation" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full rounded-2xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
                    defaultValue="PENDING"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <Field
                  label="Rating (1-5)"
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  placeholder="4"
                />
              </div>

              {error && (
                <p className="mt-2 text-xs font-medium text-rose-400">
                  {error}
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02, y: submitting ? 0 : -1 }}
                  whileTap={{ scale: submitting ? 1 : 0.98, y: 0 }}
                  className="glass neon-border flex-1 px-4 py-2 text-sm font-semibold text-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Saving Vendor…' : 'Save Vendor'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="flex-1 rounded-2xl border border-white/15 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
      {title}
    </h2>
  );
}

type FieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
};

function Field({
  label,
  name,
  placeholder,
  type = 'text',
  required,
  min,
  max,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="text-xs font-medium text-slate-200"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
      />
    </div>
  );
}

