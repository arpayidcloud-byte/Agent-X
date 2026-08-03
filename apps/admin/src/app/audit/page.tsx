'use client';

import { useEffect, useState } from 'react';
import { History, Loader2, RefreshCw } from 'lucide-react';
import { adminListAuditLogs, type AuditLogEntry } from '@/lib/api';

const ACTION_STYLE: Record<string, string> = {
  create: 'bg-emerald-500/10 text-emerald-400',
  update: 'bg-cyan-500/10 text-cyan-300',
  delete: 'bg-red-500/10 text-red-400',
  test: 'bg-slate-500/10 text-slate-300',
  import: 'bg-secondary-500/10 text-secondary-300',
  export: 'bg-secondary-500/10 text-secondary-300',
};

export default function AuditView() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminListAuditLogs(200)
      .then((d) => {
        if (!cancelled) setLogs(d.logs);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Gagal memuat audit log.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = () => {
    void adminListAuditLogs(200)
      .then((d) => setLogs(d.logs))
      .catch((e) => setError(e instanceof Error ? e.message : 'Gagal memuat audit log.'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Audit Log</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Jejak aktivitas admin — siapa mengubah apa dan kapan.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1.5 rounded-lg border border-surface-3 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-surface-2"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
          Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-surface-3 bg-surface-1 py-16">
          <Loader2 className="h-5 w-5 animate-spin text-accent-400" aria-hidden />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-3 bg-surface-1 py-16 text-center">
          <History className="mb-3 h-8 w-8 text-slate-600" strokeWidth={1.5} aria-hidden />
          <p className="text-sm text-slate-400">Belum ada aktivitas tercatat.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-surface-3 bg-surface-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-3 bg-surface-2/50 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-medium">Waktu</th>
                <th className="px-4 py-2.5 font-medium">Admin</th>
                <th className="px-4 py-2.5 font-medium">Aksi</th>
                <th className="px-4 py-2.5 font-medium">Target</th>
                <th className="px-4 py-2.5 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-surface-2/60 last:border-0">
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] text-slate-500">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">{l.email}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${ACTION_STYLE[l.action] ?? 'bg-surface-3 text-slate-400'}`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">{l.target}</td>
                  <td className="max-w-[260px] truncate px-4 py-2.5 font-mono text-[10px] text-slate-500">
                    {l.detail ? JSON.stringify(l.detail) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
