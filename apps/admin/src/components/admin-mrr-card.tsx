'use client';

import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, Users } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface AdminMrr {
  mrrUsd: number;
  arrUsd: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  plans: Array<{ slug: string; name: string; count: number; mrrUsd: number }>;
  generatedAt: string;
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-surface-3 bg-surface-1 p-6 shadow-soft">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <span className="text-accent-400">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function AdminMrrCard() {
  const [data, setData] = useState<AdminMrr | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    fetch(API_URL + '/v1/billing/metrics/mrr', {
      headers: t ? { Authorization: 'Bearer ' + t } : {},
      cache: 'no-store',
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = (await r.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? 'HTTP ' + r.status);
        }
        return r.json();
      })
      .then((d: AdminMrr) => {
        if (!cancelled) setData(d);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Card
        title="MRR / Billing Metrics"
        icon={<TrendingUp className="h-4 w-4" strokeWidth={1.8} />}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Memuat…
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card
        title="MRR / Billing Metrics"
        icon={<TrendingUp className="h-4 w-4" strokeWidth={1.8} />}
      >
        <p className="text-xs text-slate-500">
          {error ? 'Gagal memuat: ' + error : 'Tidak ada data.'}
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Endpoint admin — butuh role admin + DB billing siap.
        </p>
      </Card>
    );
  }

  return (
    <Card title="MRR / Billing Metrics" icon={<TrendingUp className="h-4 w-4" strokeWidth={1.8} />}>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">MRR</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">
            ${data.mrrUsd.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">ARR</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">
            ${data.arrUsd.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Active Subs</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-accent-400" strokeWidth={1.8} />
            {data.activeSubscriptions}
          </p>
          {data.trialingSubscriptions > 0 && (
            <p className="text-[11px] text-amber-400">+{data.trialingSubscriptions} trialing</p>
          )}
        </div>
      </div>

      {data.plans.length > 0 && (
        <div className="mt-4 rounded-lg border border-surface-3 bg-surface-0 p-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">By Plan</p>
          <ul className="space-y-1 text-xs text-slate-300">
            {data.plans.map((p) => (
              <li key={p.slug} className="flex items-center justify-between">
                <span>{p.name}</span>
                <span className="text-slate-500">
                  {p.count} sub · ${p.mrrUsd.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
