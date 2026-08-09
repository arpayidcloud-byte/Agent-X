'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Gauge, Braces, DollarSign, Wallet, Sparkles, TrendingUp } from 'lucide-react';
import { fetchAnalytics, type AnalyticsSummary } from '@/lib/api';

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
function fmtUsd(n: number): string {
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.001) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(6)}`;
}
function StatCard({ label, value, sub, icon: Icon, tone = 'text-white', accent = 'ring-white/[0.06]' }: { label: string; value: string | number; sub?: string; icon: React.ElementType; tone?: string; accent?: string }) {
  return (
    <div className={`glass-card rounded-2xl p-4 ring-1 ${accent}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-2/80 ring-1 ring-white/[0.04] text-slate-400">
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${tone}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{sub}</p>}
    </div>
  );
}
function BarChart({ rows, format, color = 'bg-accent-500' }: { rows: Array<{ label: string; value: number; sub?: string }>; format: (n: number) => string; color?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-3">
      {rows.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No data yet — run a task to see it here.</p>}
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate text-right text-xs font-medium text-slate-400">{r.label}</span>
          <div className="h-7 flex-1 overflow-hidden rounded-xl bg-surface-3/40 ring-1 ring-white/[0.04]">
            <div className={`flex h-full items-center rounded-xl px-2.5 transition-all duration-500 ${color}`} style={{ width: `${Math.max(6, (r.value / max) * 100)}%` }}>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let c = false;
    void fetchAnalytics().then((d) => { if (!c) setData(d); }).catch((e) => { if (!c) setError(e instanceof Error ? e.message : String(e)); }).finally(() => { if (!c) setLoading(false); });
    return () => { c = true; };
  }, []);
  if (loading) return <div className="space-y-4"><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div><div className="skeleton h-48 rounded-2xl" /></div>;
  if (error || !data) return <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"><p className="text-sm text-rose-300">⚠ Failed to load analytics: {error ?? 'no data'}</p></div>;
  const o = data.overview;
  const providerBars = data.byProvider.map((p) => ({ label: p.provider, value: p.requests, sub: `${p.errors} err · ${p.avgLatencyMs}ms · ${fmt(p.tokens)} tok` }));
  const modelBars = data.byModel.map((m) => ({ label: m.model, value: m.requests }));
  const costBars = data.byProvider.map((p) => ({ label: p.provider, value: p.costUsd })).filter((r) => r.value > 0).sort((a, b) => b.value - a.value);
  return (
    <div className="section space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-500/10 ring-1 ring-accent-500/20"><TrendingUp className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.8} /></span><h1 className="text-xl font-bold tracking-tight text-white">Analytics</h1></div><p className="mt-1.5 text-xs text-slate-500">Live metrics · generated {new Date(data.generatedAt).toLocaleString()}</p></div>
        <span className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-500"><Sparkles className="h-3 w-3 text-accent-300" /> Obsidian Warp</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Requests" value={fmt(o.totalRequests)} sub={`${o.totalErrors} errors`} icon={Activity} tone="text-white" accent="ring-white/[0.06]" />
        <StatCard label="Success rate" value={`${o.successRate}%`} sub={`${o.activeProviders} active providers`} icon={CheckCircle2} tone="text-emerald-300" accent="ring-emerald-500/15" />
        <StatCard label="Latency" value={`${o.avgLatencyMs}ms`} sub={`p50 ${o.p50LatencyMs}ms · p95 ${o.p95LatencyMs}ms`} icon={Gauge} tone="text-sky-300" accent="ring-sky-500/15" />
        <StatCard label="Tokens" value={fmt(o.totalTokens)} sub={`${fmt(o.inputTokens)} in · ${fmt(o.outputTokens)} out`} icon={Braces} tone="text-violet-300" accent="ring-violet-500/15" />
      </div>
      <div className="glass-card rounded-2xl border-emerald-500/15 p-5 ring-1 ring-emerald-500/10">
        <div className="flex items-center gap-2 text-emerald-300"><Wallet className="h-4 w-4" /> <span className="text-sm font-semibold">Total cost</span></div>
        <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-200">{fmtUsd(o.totalCostUsd)}</p>
        <p className="mt-1 text-xs text-slate-500">across {fmt(o.totalRequests)} requests · avg {o.totalRequests > 0 ? `$${(o.totalCostUsd / o.totalRequests).toFixed(6)}` : '$0'} / request</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card rounded-2xl p-5"><h3 className="mb-4 text-sm font-semibold text-white">Requests by provider</h3><BarChart rows={providerBars} format={fmt} /><div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500"><span>Cache hits: {fmt(o.totalCacheHits)} ({o.cacheHitRate}%)</span><span>Fallbacks: {fmt(o.totalFallbacks)}</span></div></div>
        <div className="glass-card rounded-2xl p-5"><h3 className="mb-4 text-sm font-semibold text-white">Requests by model</h3><BarChart rows={modelBars} format={fmt} color="bg-sky-500" /></div>
      </div>
      <div className="glass-card rounded-2xl p-5"><h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white"><DollarSign className="h-4 w-4 text-emerald-400" /> Cost by provider</h3><BarChart rows={costBars} format={fmtUsd} color="bg-emerald-500" /></div>
    </div>
  );
}
