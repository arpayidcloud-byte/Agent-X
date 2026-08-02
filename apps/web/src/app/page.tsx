import TaskStreamView from '@/components/task-stream-view';
import { fetchHealth, fetchStats, fetchTasks } from '@/lib/api';

// Always render on the server per request — the dashboard is a live view of the
// API server, it must never be statically prerendered (avoids build-time fetches).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <main className="text-white">
      <div className="mx-auto max-w-6xl">
        <TaskStreamView />

        {/* Compact stat strip */}
        <section className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: 'Providers Healthy',
              value: health ? `${healthyProviders}/${providerCount}` : '—',
              sub: health ? `status: ${health.status}` : 'no data',
              color: 'text-cyan-400',
            },
            {
              label: 'Tasks Completed',
              value: tasks ? completed : '—',
              sub: tasks ? `of ${tasks.total} recorded` : 'no data',
              color: 'text-blue-400',
            },
            {
              label: 'LLM Requests',
              value: stats ? requests : '—',
              sub: 'router total',
              color: 'text-violet-400',
            },
            {
              label: 'Cache Hits',
              value: stats ? cacheHits : '—',
              sub: 'llm_cache_hits_total',
              color: 'text-emerald-400',
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className={`text-sm font-medium ${s.color}`}>{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-slate-100">{s.value}</div>
              <div className="mt-0.5 text-xs text-slate-600">{s.sub}</div>
            </div>
          ))}
        </section>

        {apiError && (
          <p className="mt-6 rounded-lg border border-amber-500/20 bg-amber-950/30 p-3 text-sm text-amber-300">
            ⚠ API unreachable: {apiError} — start the server with{' '}
            <code className="rounded bg-slate-800 px-1.5 py-0.5">
              ENABLE_MOCK_PROVIDER=true node apps/api/dist/agentx-server.js
            </code>
          </p>
        )}

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-slate-200">Recent tasks</h2>
          {tasks?.tasks.length ? (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Prompt</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tasks.tasks.map((t) => (
                    <tr key={t.id} className="bg-slate-950/40">
                      <td className="px-4 py-3 font-mono text-xs text-cyan-400">{t.id}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-300" title={t.prompt}>
                        {t.prompt}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            t.status === 'success'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : t.status === 'error'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-slate-500/15 text-slate-400'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">
                        {t.provider ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-500">
              {apiError
                ? 'API unreachable — no task data.'
                : 'No tasks yet. Submit your first task above.'}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
