'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:30400';

interface Plan {
  slug: string;
  name: string;
  priceUsd: number;
  interval: string;
  maxTasksPerMonth: number;
  maxMembers: number;
  features?: Record<string, unknown>;
}

const FALLBACK: Plan[] = [
  {
    slug: 'free',
    name: 'Free',
    priceUsd: 0,
    interval: 'month',
    maxTasksPerMonth: 100,
    maxMembers: 1,
    features: { tasks: 100 },
  },
  {
    slug: 'pro',
    name: 'Pro',
    priceUsd: 2900,
    interval: 'month',
    maxTasksPerMonth: 1000,
    maxMembers: 1,
    features: { tasks: 1000, analytics: true },
  },
  {
    slug: 'team',
    name: 'Team',
    priceUsd: 9900,
    interval: 'month',
    maxTasksPerMonth: 5000,
    maxMembers: 5,
    features: { tasks: 5000, analytics: true },
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',
    priceUsd: 49900,
    interval: 'month',
    maxTasksPerMonth: 999999,
    maxMembers: 50,
    features: { tasks: 999999, analytics: true },
  },
];

function formatPrice(cents: number): string {
  if (cents === 0) return 'Gratis';
  return '$' + (cents / 100).toFixed(0);
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(API_URL + '/v1/billing/plans')
      .then((r) => (r.ok ? r.json() : { plans: FALLBACK }))
      .then((d: { plans?: Plan[] }) => {
        if (!cancelled && Array.isArray(d.plans) && d.plans.length > 0) setPlans(d.plans);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Harga</h1>
      <p className="text-center text-white/60 mb-12">
        Pilih paket sesuai kebutuhan tim{loading ? ' · memuat…' : ''}
      </p>
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const featured = p.slug === 'pro';
          const featuresList = p.features
            ? Object.entries(p.features).map(([k, v]) => k + ': ' + String(v))
            : ['tasks/bulan: ' + p.maxTasksPerMonth.toLocaleString(), 'members: ' + p.maxMembers];
          const cardCls = featured
            ? 'rounded-2xl border p-6 backdrop-blur border-violet-500/50 bg-violet-500/10'
            : 'rounded-2xl border p-6 backdrop-blur border-white/10 bg-white/5';
          const ctaCls = featured
            ? 'mt-8 block text-center rounded-xl py-3 text-sm font-semibold bg-violet-600 hover:bg-violet-500'
            : 'mt-8 block text-center rounded-xl py-3 text-sm font-semibold bg-white/10 hover:bg-white/20';
          return (
            <div key={p.slug} className={cardCls}>
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-3xl font-bold">
                {formatPrice(p.priceUsd)}
                <span className="text-sm font-normal text-white/60">/{p.interval}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/70">
                {featuresList.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
                <li>✓ {p.maxTasksPerMonth.toLocaleString()} task/bulan</li>
                <li>✓ {p.maxMembers} member</li>
              </ul>
              <Link
                href={p.slug === 'free' ? '/signup' : '/signup?plan=' + p.slug}
                className={ctaCls}
              >
                {p.slug === 'free' ? 'Daftar Gratis' : 'Pilih ' + p.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
