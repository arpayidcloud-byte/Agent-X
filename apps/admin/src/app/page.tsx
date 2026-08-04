'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, Cable, CheckCircle2, Loader2, Server, XCircle } from 'lucide-react';
import {
  isAuthed,
  adminListLlmProviders,
  adminListAuditLogs,
  fetchHealth,
  type LlmProviderView,
  type AuditLogEntry,
} from '@/lib/api';

const ACTION_STYLE: Record<string, string> = {
  create: 'bg-emerald-500/10 text-emerald-400',
  update: 'bg-cyan-500/10 text-cyan-300',
  delete: 'bg-red-500/10 text-red-400',
  test: 'bg-slate-500/10 text-slate-300',
  import: 'bg-secondary-500/10 text-secondary-300',
  export: 'bg-secondary-500/10 text-secondary-300',
};

const ACTION_LABEL: Record<string, string> = {
  create: 'create',
  update: 'update',
  delete: 'delete',
  test: 'test',
  import: 'import',
  export: 'export',
};

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number | string;
  tone: 'accent' | 'emerald' | 'red' | 'slate';
  icon: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    accent: 'text-accent-400',
    emerald: 'text-emerald-400',
    red: 'text-red-400',
    slate: 'text-slate-300',
  };
  return (
    <div className="rounded-xl border border-surface-3 bg-surface-1 p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <span className={tones[tone]}>{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}

export default function DashboardView() {
  const router = useRouter();
  const [providers, setProviders] = useState<LlmProviderView[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [health, setHealth] = useState('unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed()) {
      router.replace('/login');
      return;
    }
    let cancelled = false;
    Promise.all([
      adminListLlmProviders(),
      adminListAuditLogs(6).catch(() => ({ logs: [] as AuditLogEntry[] })),
      fetchHealth().catch(() => ({ status: 'unknown' })),
    ])
      .then(([p, a, h]) => {
        if (!cancelled) {
          setProviders(p.providers);
          setLogs(a.logs);
          setHealth(h.status);
        }
      })
      .catch(() => {
        if (!cancelled) setProviders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent-400" aria-hidden />
      </div>
    );
  }

  const enabled = providers.filter((p) => p.enabled).length;
  const testOk = providers.filter((p) => p.lastTestOk === true).length;
  const testFail = providers.filter((p) => p.lastTestOk === false).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan provider LLM &amp; aktivitas admin. API:{' '}
          <span className="text-slate-300">{health}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Provider"
          value={providers.length}
          tone="accent"
          icon={<Cable className="h-4 w-4" strokeWidth={1.8} />}
        />
        <StatCard
          label="Aktif"
          value={enabled}
          tone="emerald"
          icon={<Activity className="h-4 w-4" strokeWidth={1.8} />}
        />
        <StatCard
          label="Test Terakhir OK"
          value={testOk}
          tone="slate"
          icon={<CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />}
        />
        <StatCard
          label="Test Gagal"
          value={testFail}
          tone={testFail > 0 ? 'red' : 'slate'}
          icon={<XCircle className="h-4 w-4" strokeWidth={1.8} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-surface-3 bg-surface-1 p-5 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Provider</h2>
            <Link
              href="/providers"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent-400 transition-colors hover:text-accent-300"
            >
              Kelola <ArrowRight className="h-3 w-3" strokeWidth={2} />
            </Link>
          </div>
          {providers.length === 0 ? (
            <p className="text-xs text-slate-500">
              Belum ada provider. Tambahkan lewat halaman LLM Providers.
            </p>
          ) : (
            <ul className="divide-y divide-surface-3">
              {providers.slice(0, 6).map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-2 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-slate-200">{p.name}</p>
                    <p className="truncate text-[11px] text-slate-500">{p.baseUrl}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {p.lastTestOk === null ? (
                      <span className="rounded-md bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                        belum dites
                      </span>
                    ) : p.lastTestOk ? (
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        test OK
                      </span>
                    ) : (
                      <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                        test gagal
                      </span>
                    )}
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
                        p.enabled
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}
                    >
                      {p.enabled ? 'aktif' : 'nonaktif'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-surface-3 bg-surface-1 p-5 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Aktivitas Terakhir</h2>
            <Link
              href="/audit"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent-400 transition-colors hover:text-accent-300"
            >
              Audit Log <ArrowRight className="h-3 w-3" strokeWidth={2} />
            </Link>
          </div>
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500">Belum ada aktivitas tercatat.</p>
          ) : (
            <ul className="divide-y divide-surface-3">
              {logs.map((l) => (
                <li key={l.id} className="flex items-center gap-2.5 py-2.5">
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                      ACTION_STYLE[l.action] ?? 'bg-slate-500/10 text-slate-300'
                    }`}
                  >
                    {ACTION_LABEL[l.action] ?? l.action}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-slate-300">
                    {l.target}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-600">
                    {new Date(l.createdAt).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-600">
        <Server className="h-3 w-3" strokeWidth={1.8} />
        Konfigurasi dikelola di panel ini dan disinkronkan ke API &amp; CLI secara otomatis.
      </p>
    </div>
  );
}
