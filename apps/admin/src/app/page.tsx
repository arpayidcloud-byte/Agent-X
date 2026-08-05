'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  Cable,
  CheckCircle2,
  CheckSquare,
  Clock,
  Loader2,
  Server,
  XCircle,
} from 'lucide-react';
import {
  isAuthed,
  adminListLlmProviders,
  adminListAuditLogs,
  fetchHealth,
  fetchTasks,
  fetchStats,
  type LlmProviderView,
  type AuditLogEntry,
  type TaskRecord,
  type HealthReport,
} from '@/lib/api';

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

const ACTION_STYLE: Record<string, string> = {
  create: 'bg-emerald-500/10 text-emerald-400',
  update: 'bg-cyan-500/10 text-cyan-300',
  delete: 'bg-red-500/10 text-red-400',
  test: 'bg-slate-500/10 text-slate-300',
  import: 'bg-secondary-500/10 text-secondary-300',
  export: 'bg-secondary-500/10 text-secondary-300',
};

const STATUS_STYLE: Record<string, string> = {
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  error: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [health, setHealth] = useState<HealthReport | null>(null);
  const [providers, setProviders] = useState<LlmProviderView[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed()) return;
    let cancelled = false;
    void Promise.allSettled([
      fetchHealth(),
      adminListLlmProviders(),
      fetchTasks(10),
      fetchStats(),
      adminListAuditLogs(10),
    ])
      .then(([healthR, provR, tasksR, statsR, auditR]) => {
        if (cancelled) return;
        if (healthR.status === 'fulfilled') setHealth(healthR.value);
        if (provR.status === 'fulfilled') setProviders(provR.value.providers);
        if (tasksR.status === 'fulfilled') {
          setTasks(tasksR.value.tasks);
          setTotalTasks(tasksR.value.total);
        }
        if (statsR.status === 'fulfilled') setStats(statsR.value.stats);
        if (auditR.status === 'fulfilled') setAuditLogs(auditR.value.logs);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAuthed() && !loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-100">Sign in required</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to access the admin panel.</p>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="mt-4 btn-gradient rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (loading && !isAuthed()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  const healthyProviders = health?.providers.filter((p) => p.status === 'healthy').length ?? 0;
  const providerCount = health?.providers.length ?? providers.length;
  const completedTasks = tasks.filter((t) => t.status === 'success').length;
  const errorTasks = tasks.filter((t) => t.status === 'error').length;
  const requests = stats.llm_requests_total ?? 0;
  const cacheHits = stats.llm_cache_hits_total ?? 0;

  return (
    <div className="section space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Dashboard</h1>
          <div className="mt-1.5 flex items-center gap-3">
            <p className="text-sm text-slate-500">System overview</p>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)] animate-pulse-slow" />
              <span className="text-emerald-400/80">
                {health ? `${health.status} · up ${formatDuration(health.uptime)}` : 'loading…'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/providers" className="stat-card card-hover group rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Providers
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-slate-500 group-hover:text-accent-300 group-hover:bg-accent-500/10 transition-colors">
              <Cable className="h-4 w-4" strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-accent-300">
            {healthyProviders}/{providerCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">healthy providers</p>
        </Link>

        <Link href="/tasks" className="stat-card card-hover group rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tasks
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-slate-500 group-hover:text-emerald-300 group-hover:bg-emerald-500/10 transition-colors">
              <CheckSquare className="h-4 w-4" strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-300">{totalTasks}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            {completedTasks} completed · {errorTasks} errors
          </p>
        </Link>

        <Link href="/analytics" className="stat-card card-hover group rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Requests
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-slate-500 group-hover:text-secondary-300 group-hover:bg-secondary-500/10 transition-colors">
              <Activity className="h-4 w-4" strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-secondary-300">
            {requests.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">{cacheHits.toLocaleString()} cache hits</p>
        </Link>

        <Link href="/agents" className="stat-card card-hover group rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Agents
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-slate-500 group-hover:text-sky-300 group-hover:bg-sky-500/10 transition-colors">
              <Server className="h-4 w-4" strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-sky-300">4</p>
          <p className="mt-1 text-[11px] text-slate-500">specialist agents</p>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Provider health */}
        <div className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Provider Health</h2>
            <Link
              href="/providers"
              className="flex items-center gap-1 text-[11px] text-accent-300 hover:text-accent-200 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-12 rounded-lg" />
              ))}
            </div>
          ) : health?.providers.length ? (
            <div className="space-y-2">
              {health.providers.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-surface-2/40 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2 w-2 rounded-full ${p.status === 'healthy' ? 'bg-emerald-400' : p.status === 'degraded' ? 'bg-amber-400' : 'bg-rose-400'}`}
                    />
                    <span className="text-sm text-slate-200">{p.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider ${p.status === 'healthy' ? 'text-emerald-400' : p.status === 'degraded' ? 'text-amber-400' : 'text-rose-400'}`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-slate-500">No providers configured</p>
          )}
        </div>

        {/* Recent audit logs */}
        <div className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Recent Activity</h2>
            <Link
              href="/audit"
              className="flex items-center gap-1 text-[11px] text-accent-300 hover:text-accent-200 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-lg" />
              ))}
            </div>
          ) : auditLogs.length ? (
            <div className="space-y-1.5">
              {auditLogs.slice(0, 8).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]"
                >
                  <span
                    className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${ACTION_STYLE[log.action] ?? 'bg-surface-3 text-slate-400'}`}
                  >
                    {log.action}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-slate-300">
                    {log.target}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-600">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-slate-500">No activity yet</p>
          )}
        </div>
      </div>

      {/* Recent tasks */}
      <div className="glass-card rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Recent Tasks</h2>
          <Link
            href="/tasks"
            className="flex items-center gap-1 text-[11px] text-accent-300 hover:text-accent-200 transition-colors"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-lg" />
            ))}
          </div>
        ) : tasks.length ? (
          <div className="space-y-1.5">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.02]"
              >
                {task.status === 'success' && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                )}
                {task.status === 'error' && <XCircle className="h-4 w-4 shrink-0 text-rose-400" />}
                {task.status === 'pending' && <Clock className="h-4 w-4 shrink-0 text-amber-400" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-200">{task.prompt}</p>
                  <p className="mt-0.5 text-[11px] font-mono text-slate-600">
                    {task.provider ?? '—'} · {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[task.status] ?? ''}`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-slate-500">No tasks yet</p>
        )}
      </div>
    </div>
  );
}
