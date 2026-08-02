'use client';

import { useEffect, useState } from 'react';
import { fetchAnalytics, type AnalyticsSummary } from '@/lib/api';

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// Horizontal bar chart rendered with pure CSS (no chart library).
function BarChart({
  rows,
  format,
  color = 'bg-cyan-500',
}: {
  rows: Array<{ label: string; value: number; sub?: string }>;
  format: (n: number) => string;
  color?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2">
      {rows.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">
          No data yet — run a task to see it here.
        </p>
      )}
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate text-right font-medium text-slate-300">
            {r.label}
          </span>
          <div className="h-5 flex-1 overflow-hidden rounded bg-slate-800/60">
            <div
              className={`flex h-full items-center rounded px-2 ${color}`}
              style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }}
            >
              <span className="truncate text-[10px] font-semibold text-white/90">
                {format(r.value)}
                {r.sub ? ` · ${r.sub}` : ''}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function AnalyticsView() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchAnalytics()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-500">Loading analytics…</p>;
  }
  if (error || !data) {
    return (
      <p className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">
        ⚠ Failed to load analytics: {error ?? 'no data'}
      </p>
    );
  }

  const o = data.overview;
  const providerBars = data.byProvider.map((p) => ({
    label: p.provider,
    value: p.requests,
    sub: `${p.errors} err · ${p.avgLatencyMs}ms · ${fmt(p.tokens)} tok`,
  }));
  const modelBars = data.byModel.map((m) => ({ label: m.model, value: m.requests }));

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        Aggregated from live LLM metrics · generated {new Date(data.generatedAt).toLocaleString()}
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Requests" value={fmt(o.totalRequests)} sub={`${o.totalErrors} errors`} />
        <StatCard
          label="Success rate"
          value={`${o.successRate}%`}
          sub={`${o.activeProviders} active providers`}
        />
        <StatCard
          label="Latency"
          value={`${o.avgLatencyMs}ms`}
          sub={`p50 ${o.p50LatencyMs}ms · p95 ${o.p95LatencyMs}ms`}
        />
        <StatCard
          label="Tokens"
          value={fmt(o.totalTokens)}
          sub={`${fmt(o.inputTokens)} in · ${fmt(o.outputTokens)} out`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-200">Requests by provider</h3>
          <BarChart rows={providerBars} format={fmt} />
          <div className="mt-4 flex gap-4 text-xs text-slate-500">
            <span>
              Cache hits: {fmt(o.totalCacheHits)} ({o.cacheHitRate}%)
            </span>
            <span>Fallbacks: {fmt(o.totalFallbacks)}</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-200">Requests by model</h3>
          <BarChart rows={modelBars} format={fmt} color="bg-violet-500" />
        </div>
      </div>
    </div>
  );
}
