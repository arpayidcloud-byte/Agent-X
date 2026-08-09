'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Gauge, Braces, DollarSign, Wallet, TrendingUp, Sparkles } from 'lucide-react';
import { fetchAnalytics, type AnalyticsSummary } from '@/lib/api';
import { StatCard } from '@/components/ui/stat-card';
import { SkeletonCard, SkeletonStat } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function fmt(n: number): string { if (n >= 1000) return `${(n / 1000).toFixed(1)}k`; return String(n); }
function fmtUsd(n: number): string { if (n >= 1) return `$${n.toFixed(2)}`; if (n >= 0.001) return `$${n.toFixed(4)}`; return `$${n.toFixed(6)}`; }

function BarChart({ rows, format, color = 'bg-accent-500' }: { rows: Array<{ label: string; value: number; sub?: string }>; format: (n: number) => string; color?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-3">
      {rows.length === 0 && <p className="py-8 text-center text-xs text-slate-500">No data yet — run a task to see it here.</p>}
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-right text-xs font-medium text-slate-400">{r.label}</span>
          <div className="h-7 flex-1 overflow-hidden rounded-xl border border-white/[0.03] bg-surface-3/40 p-0.5">
            <div className={`flex h-full items-center rounded-lg px-2.5 transition-all duration-500 ${color}`} style={{ width: `${Math.max(6, (r.value / max) * 100)}%` }}>
              <span className="truncate text-[11px] font-semibold text-white">{format(r.value)}{r.sub ? ` · ${r.sub}` : ''}</span>
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
    void fetchAnalytics().then((d) => { if (!cancelled) setData(d); }).catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="section space-y-4"><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)}</div><SkeletonCard rows={4} /></div>;
  if (error || !data) return <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"><p className="text-sm text-rose-300">⚠ Failed to load analytics: {error ?? 'no data'}</p></div>;

  const o = data.overview;
  const providerBars = data.byProvider.map((p) => ({ label: p.provider, value: p.requests, sub: `${p.errors} err · ${p.avgLatencyMs}ms · ${fmt(p.tokens)} tok` }));
  const modelBars = data.byModel.map((m) => ({ label: m.model, value: m.requests }));
  const costBars = data.byProvider.map((p) => ({ label: p.provider, value: p.costUsd })).filter((r) => r.value > 0).sort((a, b) => b.value - a.value);

  return (
    <div className="section space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-secondary-600 shadow-[0_0_16px_rgba(99,102,241,0.25)]">
            <TrendingUp className="h-4 w-4 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-white">Analytics</p>
            <p className="text-[11px] text-slate-500">Live metrics · {new Date(data.generatedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-1/60 px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium text-slate-400">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Requests" value={fmt(o.totalRequests)} sub={`${o.totalErrors} errors`} icon={Activity} />
        <StatCard label="Success rate" value={`${o.successRate}%`} sub={`${o.activeProviders} active providers`} icon={CheckCircle2} tone="text-emerald-300" />
        <StatCard label="Latency" value={`${o.avgLatencyMs}ms`} sub={`p50 ${o.p50LatencyMs}ms · p95 ${o.p95LatencyMs}ms`} icon={Gauge} tone="text-secondary-300" />
        <StatCard label="Tokens" value={fmt(o.totalTokens)} sub={`${fmt(o.inputTokens)} in · ${fmt(o.outputTokens)} out`} icon={Braces} tone="text-sky-300" />
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-surface-1/60 to-surface-1/40 p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-emerald-400"><Wallet className="h-3.5 w-3.5" /> Total cost</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-100">{fmtUsd(o.totalCostUsd)}</p>
            <p className="mt-1 text-xs text-slate-500">across {fmt(o.totalRequests)} requests · avg {o.totalRequests > 0 ? `$${(o.totalCostUsd / o.totalRequests).toFixed(6)}` : '$0'} / request</p>
          </div>
          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 sm:flex">
            <Sparkles className="h-5 w-5 text-emerald-300" strokeWidth={1.6} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border-white/[0.05]">
          <CardHeader className="border-b border-white/[0.04] bg-surface-2/20"><CardTitle>Requests by provider</CardTitle></CardHeader>
          <CardContent className="pt-5">
            <BarChart rows={providerBars} format={fmt} />
            <div className="mt-4 flex gap-4 border-t border-white/[0.04] pt-3 text-xs text-slate-500">
              <span>Cache hits: {fmt(o.totalCacheHits)} ({o.cacheHitRate}%)</span>
              <span>Fallbacks: {fmt(o.totalFallbacks)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden rounded-2xl border-white/[0.05]">
          <CardHeader className="border-b border-white/[0.04] bg-surface-2/20"><CardTitle>Requests by model</CardTitle></CardHeader>
          <CardContent className="pt-5"><BarChart rows={modelBars} format={fmt} color="bg-secondary-500" /></CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden rounded-2xl border-white/[0.05]">
        <CardHeader className="border-b border-white/[0.04] bg-surface-2/20">
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-emerald-400" /> Cost by provider</CardTitle>
        </CardHeader>
        <CardContent className="pt-5"><BarChart rows={costBars} format={fmtUsd} color="bg-emerald-500" /></CardContent>
      </Card>
    </div>
  );
}
