'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, XCircle, Clock, RefreshCw, Search, ChevronDown, ChevronRight, Sparkles, ListChecks } from 'lucide-react';
import { fetchTasks, type TaskRecord } from '@/lib/api';

type FilterTab = 'all' | 'success' | 'error' | 'pending';
const STATUS_ICON = {
  success: <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />,
  error: <XCircle className="h-3.5 w-3.5 text-rose-400" />,
  pending: <Clock className="h-3.5 w-3.5 text-amber-400" />,
};
const STATUS_BADGE: Record<string, string> = {
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  error: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
};
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}
export default function TasksView() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    let c = false;
    void (async () => {
      try { const r = await fetchTasks(200); if (!c) { setTasks(r.tasks); setTotal(r.total); } } catch (e) { if (!c) setError(e instanceof Error ? e.message : String(e)); } finally { if (!c) setLoading(false); }
    })();
    return () => { c = true; };
  }, []);
  function handleRefresh() {
    setRefreshing(true); setError(null);
    void (async () => {
      try { const r = await fetchTasks(200); setTasks(r.tasks); setTotal(r.total); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setRefreshing(false); }
    })();
  }
  const filtered = tasks.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.prompt.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const successCount = tasks.filter((t) => t.status === 'success').length;
  const errorCount = tasks.filter((t) => t.status === 'error').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  if (loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>;
  return (
    <div className="section space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-500/10 ring-1 ring-accent-500/20"><ListChecks className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.8} /></span><h1 className="text-xl font-bold tracking-tight text-white">Tasks</h1><span className="rounded-full border border-white/[0.06] bg-surface-2/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">{total} total</span></div><p className="mt-1.5 text-sm text-slate-500">{successCount} completed · {errorCount} errors · {pendingCount} pending</p></div>
        <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-500 sm:flex"><Sparkles className="h-3 w-3 text-accent-300" /> Obsidian Warp</span><button type="button" onClick={handleRefresh} disabled={refreshing} className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-surface-2/60 px-3 text-xs font-medium text-slate-300 transition-all hover:bg-surface-3 hover:text-white disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />Refresh</button></div>
      </div>
      {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4"><p className="text-sm text-rose-300">⚠ {error}</p></div>}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl bg-surface-1 p-1 ring-1 ring-white/[0.06]">
          {(['all', 'success', 'error', 'pending'] as FilterTab[]).map((tab) => (
            <button key={tab} type="button" onClick={() => setFilter(tab)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${filter === tab ? 'bg-accent-500 text-white shadow-[0_2px_10px_rgba(79,70,229,0.35)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}`}>{tab === 'all' ? `All (${total})` : tab === 'success' ? `Completed (${successCount})` : tab === 'error' ? `Errors (${errorCount})` : `Pending (${pendingCount})`}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search prompt or ID…" className="w-full rounded-xl border border-white/[0.06] bg-surface-1 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 transition-all focus:border-accent-500/30 focus:ring-2 focus:ring-accent-500/15 focus:outline-none" /></div>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.06] bg-surface-1/30 p-12 text-center"><CheckSquare className="mx-auto h-8 w-8 text-slate-600" strokeWidth={1.5} /><p className="mt-3 text-sm text-slate-500">{search ? 'No tasks match your search.' : 'No tasks yet.'}</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => {
            const isOpen = expanded === task.id;
            const duration = task.completedAt && task.createdAt ? new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime() : null;
            return (
              <div key={task.id} className="glass-card overflow-hidden rounded-2xl transition-all hover:border-white/[0.08]">
                <button type="button" onClick={() => setExpanded(isOpen ? null : task.id)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]">
                  {isOpen ? <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" /> : <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />}{STATUS_ICON[task.status]}
                  <div className="min-w-0 flex-1"><p className="truncate text-sm text-slate-200">{task.prompt}</p><p className="mt-0.5 font-mono text-[11px] text-slate-600">{task.id}</p></div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE[task.status] ?? ''}`}>{task.status}</span>
                  <div className="hidden items-center gap-3 text-[11px] text-slate-500 sm:flex">{task.provider && <span className="rounded-full bg-surface-2 px-2 py-0.5">{task.provider}</span>}{duration !== null && <span>{formatDuration(duration)}</span>}<span>{new Date(task.createdAt).toLocaleString()}</span></div>
                </button>
                {isOpen && (
                  <div className="border-t border-white/[0.04] bg-surface-1/50 px-4 py-4">
                    <div className="grid gap-4 sm:grid-cols-2"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Prompt</p><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{task.prompt}</p></div><div className="space-y-3"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Provider / Model</p><p className="mt-1 text-sm text-slate-300">{task.provider ?? '—'}{task.model ? ` / ${task.model}` : ''}</p></div><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Created</p><p className="mt-1 text-sm text-slate-300">{new Date(task.createdAt).toLocaleString()}</p></div>{duration !== null && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Duration</p><p className="mt-1 text-sm text-slate-300">{formatDuration(duration)}</p></div>}</div></div>
                    {task.response && <div className="mt-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Response</p><pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-surface-0 p-3 font-mono text-xs text-slate-300">{task.response}</pre></div>}
                    {task.error && <div className="mt-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">Error</p><pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 font-mono text-xs text-rose-200">{task.error}</pre></div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
