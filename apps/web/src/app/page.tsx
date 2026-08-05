import TaskStreamView from '@/components/task-stream-view';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Server, CheckCircle2, Zap, Database, Clock, Wifi } from 'lucide-react';
import { fetchHealth, fetchStats, fetchTasks } from '@/lib/api';

// Always render on the server per request — the dashboard is a live view of the
// API server, it must never be statically prerendered (avoids build-time fetches).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATUS_TONE = {
  success: 'success' as const,
  error: 'danger' as const,
  running: 'info' as const,
  pending: 'neutral' as const,
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

export default async function AgentXDashboard() {
  let health;
  let stats;
  let tasks;
  let apiError: string | null = null;

  try {
    [health, stats, tasks] = await Promise.all([fetchHealth(), fetchStats(), fetchTasks(50)]);
  } catch (e) {
    apiError = e instanceof Error ? e.message : String(e);
  }

  const healthyProviders = health?.providers.filter((p) => p.status === 'healthy').length ?? 0;
  const providerCount = health?.providers.length ?? 0;
  const completed = tasks?.tasks.filter((t) => t.status === 'success').length ?? 0;
  const requests = stats?.stats.llm_requests_total ?? 0;
  const cacheHits = stats?.stats.llm_cache_hits_total ?? 0;
  const uptime = health?.uptime ?? 0;

  return (
    <main className="section">
      {/* ── Welcome section ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          {getGreeting()}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-sm text-slate-500">Your AI workforce is ready.</p>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="status-dot" />
            <span className="text-emerald-400/80">
              {apiError ? 'API unreachable' : 'All systems operational'}
            </span>
          </div>
        </div>
      </div>

      {/* ── AI Command Panel ── */}
      <TaskStreamView />

      {/* ── Stats strip ── */}
      <section className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Providers"
          value={health ? `${healthyProviders}/${providerCount}` : '—'}
          sub={health ? `${health.status} · ${formatDuration(uptime * 1000)} up` : 'no data'}
          icon={Server}
          tone="text-accent-300"
        />
        <StatCard
          label="Tasks completed"
          value={tasks ? completed : '—'}
          sub={tasks ? `of ${tasks.total} recorded` : 'no data'}
          icon={CheckCircle2}
          tone="text-emerald-300"
        />
        <StatCard
          label="LLM requests"
          value={stats ? requests.toLocaleString() : '—'}
          sub="via the router"
          icon={Zap}
          tone="text-secondary-300"
        />
        <StatCard
          label="Cache hits"
          value={stats ? cacheHits.toLocaleString() : '—'}
          sub="repeated prompts answered free"
          icon={Database}
          tone="text-sky-300"
        />
      </section>

      {apiError && (
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <Wifi className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-amber-300">API unreachable</p>
              <p className="mt-1 text-xs text-amber-400/70">
                {apiError} — start the server with{' '}
                <code className="rounded bg-surface-3/80 px-1.5 py-0.5 font-mono text-amber-300">
                  ENABLE_MOCK_PROVIDER=true node apps/api/dist/agentx-server.js
                </code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Recent tasks ── */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Recent tasks</h2>
          {tasks && tasks.total > 0 && (
            <span className="text-[11px] text-slate-500">{tasks.total} total</span>
          )}
        </div>
        {tasks?.tasks.length ? (
          <div className="glass-card overflow-hidden rounded-xl">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="font-medium">ID</th>
                  <th className="font-medium">Prompt</th>
                  <th className="font-medium">Status</th>
                  <th className="hidden font-medium sm:table-cell">Provider</th>
                  <th className="hidden font-medium md:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.tasks.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-xs text-slate-500">{t.id}</td>
                    <td className="max-w-xs truncate text-slate-300" title={t.prompt}>
                      {t.prompt}
                    </td>
                    <td>
                      <Badge tone={STATUS_TONE[t.status] ?? 'neutral'}>{t.status}</Badge>
                    </td>
                    <td className="hidden font-mono text-xs text-slate-500 sm:table-cell">
                      {t.provider ?? '—'}
                    </td>
                    <td className="hidden text-xs text-slate-500 md:table-cell">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/[0.06] bg-surface-1/30 p-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-slate-600" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-slate-500">
              {apiError
                ? 'API unreachable — no task data.'
                : 'No tasks yet. Submit your first task above.'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
