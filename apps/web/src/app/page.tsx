import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubmitForm from '@/components/submit-form';
import TaskStreamView from '@/components/task-stream-view';
import { API_URL, fetchHealth, fetchStats, fetchTasks } from '@/lib/api';

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
  const errors = stats?.stats.llm_errors_total ?? 0;
  const fallbacks = stats?.stats.llm_fallbacks_total ?? 0;
  const cacheHits = stats?.stats.llm_cache_hits_total ?? 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-8 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
            AgentX Dashboard
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Enterprise AI Agent Platform — live data from{' '}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-cyan-300">
              {API_URL}
            </code>
          </p>
          <nav className="mt-4 flex gap-4 text-sm">
            <a
              href="/chat"
              className="rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-4 py-2 font-medium text-cyan-300 transition hover:bg-cyan-900/40"
            >
              💬 Chat
            </a>
            <a
              href="/analytics"
              className="rounded-lg border border-blue-500/40 bg-blue-950/40 px-4 py-2 font-medium text-blue-300 transition hover:bg-blue-900/40"
            >
              📊 Analytics
            </a>
            <a
              href="/agents"
              className="rounded-lg border border-violet-500/40 bg-violet-950/40 px-4 py-2 font-medium text-violet-300 transition hover:bg-violet-900/40"
            >
              🤖 Agents
            </a>
            <a
              href="/team"
              className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 font-medium text-emerald-300 transition hover:bg-emerald-900/40"
            >
              👥 Team
            </a>
            <a
              href="/settings"
              className="rounded-lg border border-slate-500/40 bg-slate-800/40 px-4 py-2 font-medium text-slate-300 transition hover:bg-slate-700/40"
            >
              ⚙️ Settings
            </a>
            <a
              href="/beta"
              className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 font-medium text-emerald-300 transition hover:bg-emerald-900/40"
            >
              🚀 Beta Recruitment — waitlist &amp; feedback
            </a>
          </nav>
          {apiError && (
            <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-950/30 p-3 text-sm text-amber-300">
              ⚠ API unreachable: {apiError} — start the server with{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5">
                ENABLE_MOCK_PROVIDER=true node apps/api/dist/agentx-server.js
              </code>
            </p>
          )}
        </header>

        <section className="mb-12 grid grid-cols-4 gap-4">
          <Card className="bg-slate-900/40 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-cyan-400">Providers Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {health ? `${healthyProviders}/${providerCount}` : '—'}
              </div>
              <div className="text-xs text-slate-500">
                {health ? `status: ${health.status}` : 'no data'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-blue-400">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasks ? completed : '—'}</div>
              <div className="text-xs text-slate-500">
                {tasks ? `of ${tasks.total} recorded` : 'no data'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-violet-400">LLM Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats ? requests : '—'}</div>
              <div className="text-xs text-slate-500">
                {stats ? `${errors} errors · ${fallbacks} fallbacks` : 'no data'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-emerald-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-emerald-400">Cache Hits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats ? cacheHits : '—'}</div>
              <div className="text-xs text-slate-500">from llm_cache_hits_total</div>
            </CardContent>
          </Card>
        </section>

        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SubmitForm />
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-300">Provider health</h2>
            {health?.providers.length ? (
              <ul className="space-y-2">
                {health.providers.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between rounded-lg bg-slate-950/60 px-4 py-2 text-sm"
                  >
                    <span className="font-mono text-slate-300">{p.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.status === 'healthy'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : p.status === 'degraded'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                {apiError ? 'API unreachable' : 'No providers registered'}
              </p>
            )}
          </div>
        </div>

        <section className="mb-12">
          <TaskStreamView />
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-200">Recent tasks</h2>
          {tasks?.tasks.length ? (
            <div className="overflow-x-auto rounded-xl border border-slate-700/50">
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
            <p className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-6 text-sm text-slate-500">
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
