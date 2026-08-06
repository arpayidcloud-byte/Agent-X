'use client';

import { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  RefreshCw,
  Loader2,
  Wallet,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface ProviderCost {
  provider: string;
  requests: number;
  errors: number;
  avgLatencyMs: number;
  tokens: number;
  costUsd: number;
}

interface ModelCost {
  model: string;
  requests: number;
  costUsd: number;
}

interface AnalyticsOverview {
  totalRequests: number;
  totalErrors: number;
  successRate: number;
  totalCacheHits: number;
  cacheHitRate: number;
  totalFallbacks: number;
  activeProviders: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalCostUsd: number;
}

interface AnalyticsData {
  overview: AnalyticsOverview;
  byProvider: ProviderCost[];
  byModel: ModelCost[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function api<T>(path: string): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('agentx_admin_token') : null;
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">{label}</p>
          <p className="text-lg font-bold text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function CostTrackingView() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api<AnalyticsData>('/v1/analytics/summary');
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setError(null);
    void (async () => {
      try {
        const res = await api<AnalyticsData>('/v1/analytics/summary');
        setData(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setRefreshing(false);
      }
    })();
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-sm text-rose-400">⚠ {error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-medium text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overview, byProvider, byModel } = data;

  // Sort providers by cost
  const sortedProviders = [...byProvider].sort((a, b) => b.costUsd - a.costUsd);
  const totalCost = overview.totalCostUsd;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Cost Tracking</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time cost visibility across providers and models
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/[0.1] hover:text-slate-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
          <p className="text-sm text-rose-300">⚠ {error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Cost"
          value={`$${totalCost.toFixed(6)}`}
          icon={DollarSign}
          color="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          label="Total Tokens"
          value={overview.totalTokens.toLocaleString()}
          icon={BarChart3}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="Active Providers"
          value={String(overview.activeProviders)}
          icon={Wallet}
          color="bg-purple-500/10 text-purple-400"
        />
        <StatCard
          label="Avg Latency"
          value={`${Math.round(overview.avgLatencyMs)}ms`}
          icon={TrendingUp}
          color="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Provider Cost Breakdown */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-200">Cost by Provider</h2>
        </div>
        {sortedProviders.length === 0 ? (
          <p className="text-sm text-slate-500">No provider data yet</p>
        ) : (
          <div className="space-y-3">
            {sortedProviders.map((p) => {
              const pct = totalCost > 0 ? (p.costUsd / totalCost) * 100 : 0;
              return (
                <div key={p.provider} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{p.provider}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{p.requests.toLocaleString()} req</span>
                      <span>{p.tokens.toLocaleString()} tok</span>
                      <span className="font-medium text-slate-300">${p.costUsd.toFixed(6)}</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-3/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all"
                      style={{ width: `${Math.max(pct, 1)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Model Cost Breakdown */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-200">Cost by Model</h2>
        </div>
        {byModel.length === 0 ? (
          <p className="text-sm text-slate-500">No model data yet</p>
        ) : (
          <div className="space-y-3">
            {[...byModel]
              .sort((a, b) => b.costUsd - a.costUsd)
              .map((m) => {
                const pct = totalCost > 0 ? (m.costUsd / totalCost) * 100 : 0;
                return (
                  <div key={m.model} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{m.model}</span>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{m.requests.toLocaleString()} req</span>
                        <span className="font-medium text-slate-300">${m.costUsd.toFixed(6)}</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-3/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Token Distribution */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-200">Token Distribution</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center p-4 rounded-xl bg-surface-2/40">
            <p className="text-2xl font-bold text-slate-100">
              {overview.inputTokens.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">Input Tokens</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface-2/40">
            <p className="text-2xl font-bold text-slate-100">
              {overview.outputTokens.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">Output Tokens</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface-2/40">
            <p className="text-2xl font-bold text-accent-400">
              {overview.totalTokens.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">Total Tokens</p>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-3">Cost Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Cost</span>
              <span className="font-medium text-slate-300">${totalCost.toFixed(6)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Cost per Request</span>
              <span className="font-medium text-slate-300">
                $
                {overview.totalRequests > 0 ? (totalCost / overview.totalRequests).toFixed(8) : '0'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Cost per 1K Tokens</span>
              <span className="font-medium text-slate-300">
                $
                {overview.totalTokens > 0
                  ? ((totalCost / overview.totalTokens) * 1000).toFixed(6)
                  : '0'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Success Rate</span>
              <span className="font-medium text-emerald-400">
                {overview.successRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Cache Hit Rate</span>
              <span className="font-medium text-blue-400">{overview.cacheHitRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Fallbacks</span>
              <span className="font-medium text-amber-400">{overview.totalFallbacks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
