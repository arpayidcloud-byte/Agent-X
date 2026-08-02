'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Gauge, Braces, DollarSign, Wallet } from 'lucide-react';
import { fetchAnalytics, type AnalyticsSummary } from '@/lib/api';
import { StatCard } from '@/components/ui/stat-card';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function fmtUsd(n: number): string {
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.001) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(6)}`;
}

// Horizontal bar chart rendered with pure CSS (no chart library).
function BarChart({
  rows,
  format,
  color = 'bg-accent-500',
}: {
  rows: Array<{ label: string; value: number; sub?: string }>;
  format: (n: number) => string;
  color?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2.5">
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
          <div className="h-5 flex-1 overflow-hidden rounded bg-surface-2">
            <div
              className={`flex h-full items-center rounded px-2 ${color}`}
              style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }}
            >
              <span className="truncate text-[10px] font-semibold text-slate-950">
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
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} rows={1} />
          ))}
        </div>
        <SkeletonCard rows={4} />
      </div>
    );
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
    sub: `${p.errors} err · ${p.avgLatencyMs}ms · ${fmt(p.tokens)} tok · ${fmtUsd(p.costUsd)}`,
  }));
  const modelBars = data.byModel.map((m) => ({ label: m.model, value: m.requests }));
  const costBars = data.byProvider
    .map((p) => ({ label: p.provider, value: p.costUsd }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        Live metrics · generated {new Date(data.generatedAt).toLocaleString()}
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Requests"
          value={fmt(o.totalRequests)}
          sub={`${o.totalErrors} errors`}
          icon={Activity}
        />
        <StatCard
          label="Success rate"
          value={`${o.successRate}%`}
          sub={`${o.activeProviders} active providers`}
          icon={CheckCircle2}
          tone="text-emerald-300"
        />
        <StatCard
          label="Latency"
          value={`${o.avgLatencyMs}ms`}
          sub={`p50 ${o.p50LatencyMs}ms · p95 ${o.p95LatencyMs}ms`}
          icon={Gauge}
          tone="text-secondary-300"
        />
        <StatCard
          label="Tokens"
          value={fmt(o.totalTokens)}
          sub={`${fmt(o.inputTokens)} in · ${fmt(o.outputTokens)} out`}
          icon={Braces}
          tone="text-sky-300"
        />
      </div>

      <Card className="border-emerald-500/25 bg-emerald-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-emerald-300">
            <Wallet className="h-4 w-4" aria-hidden /> Total cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight text-emerald-200">
            {fmtUsd(o.totalCostUsd)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            across {fmt(o.totalRequests)} requests · avg{' '}
            {o.totalRequests > 0 ? `$${(o.totalCostUsd / o.totalRequests).toFixed(6)}` : '$0'} /
            request
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Requests by provider</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart rows={providerBars} format={fmt} />
            <div className="mt-4 flex gap-4 text-xs text-slate-500">
              <span>
                Cache hits: {fmt(o.totalCacheHits)} ({o.cacheHitRate}%)
              </span>
              <span>Fallbacks: {fmt(o.totalFallbacks)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Requests by model</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart rows={modelBars} format={fmt} color="bg-secondary-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" aria-hidden /> Cost by provider
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart rows={costBars} format={fmtUsd} color="bg-emerald-500" />
        </CardContent>
      </Card>
    </div>
  );
}
