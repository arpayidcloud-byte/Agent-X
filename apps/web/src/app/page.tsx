import TaskStreamView from '@/components/task-stream-view';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Server, CheckCircle2, Zap, Database } from 'lucide-react';
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

  return (
    <main>
      <PageHeader
        title="Overview"
        description="Run tasks and monitor your agent platform in real time."
      />

      <TaskStreamView />

      {/* Compact stat strip */}
      <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Providers"
          value={health ? `${healthyProviders}/${providerCount}` : '—'}
          sub={health ? `${health.status}` : 'no data'}
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
          value={stats ? requests : '—'}
          sub="via the router"
          icon={Zap}
          tone="text-secondary-300"
        />
        <StatCard
          label="Cache hits"
          value={stats ? cacheHits : '—'}
          sub="repeated prompts answered free"
          icon={Database}
          tone="text-sky-300"
        />
      </section>

      {apiError && (
        <p className="mt-6 rounded-lg border border-amber-500/20 bg-amber-950/30 p-3 text-sm text-amber-300">
          ⚠ API unreachable: {apiError} — start the server with{' '}
          <code className="rounded bg-surface-2 px-1.5 py-0.5">
            ENABLE_MOCK_PROVIDER=true node apps/api/dist/agentx-server.js
          </code>
        </p>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Recent tasks</h2>
        {tasks?.tasks.length ? (
          <div className="overflow-hidden rounded-xl border border-surface-3 bg-surface-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-1 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Prompt</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Provider</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3/60">
                {tasks.tasks.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-surface-2/50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.id}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-slate-300" title={t.prompt}>
                      {t.prompt}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[t.status] ?? 'neutral'}>{t.status}</Badge>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-slate-500 sm:table-cell">
                      {t.provider ?? '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-slate-500 md:table-cell">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-surface-3 bg-surface-1/50 p-6 text-sm text-slate-500">
            {apiError
              ? 'API unreachable — no task data.'
              : 'No tasks yet. Submit your first task above.'}
          </p>
        )}
      </section>
    </main>
  );
}
