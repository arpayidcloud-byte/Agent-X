'use client';

import { useEffect, useState } from 'react';
import {
  Cable,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  adminListLlmProviders,
  adminTestLlmProvider,
  adminDeleteLlmProvider,
  adminPatchLlmProvider,
  fetchHealth,
  type LlmProviderView,
} from '@/lib/api';
import ProviderWizard from '@/components/provider-wizard';

const TYPE_LABEL: Record<string, string> = {
  'openai-compatible': 'OpenAI-compatible',
  'anthropic-compatible': 'Anthropic-compatible',
};

const PRESET_LABEL: Record<string, string> = {
  openai: 'OpenAI',
  grok: 'Grok',
  deepseek: 'DeepSeek',
  qwen: 'Qwen',
  claude: 'Claude',
  gemini: 'Gemini',
  mistral: 'Mistral',
  openrouter: 'OpenRouter',
  groq: 'Groq',
  perplexity: 'Perplexity',
  custom: 'Custom',
};

export default function ProvidersView() {
  const [providers, setProviders] = useState<LlmProviderView[]>([]);
  const [health, setHealth] = useState<string>('unknown');
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editing, setEditing] = useState<LlmProviderView | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([adminListLlmProviders(), fetchHealth().catch(() => ({ status: 'unknown' }))])
      .then(([data, h]) => {
        if (!cancelled) {
          setProviders(data.providers);
          setHealth(h.status);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Gagal memuat provider.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = () => {
    void Promise.all([adminListLlmProviders(), fetchHealth().catch(() => ({ status: 'unknown' }))])
      .then(([data, h]) => {
        setProviders(data.providers);
        setHealth(h.status);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Gagal memuat provider.'));
  };

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 3500);
  };

  const handleTest = async (name: string) => {
    setTesting(name);
    setError('');
    try {
      const res = await adminTestLlmProvider(name);
      flash(
        res.ok
          ? `✓ ${name} OK — ${res.latencyMs}ms, $${res.cost?.toFixed(4) ?? '?'}`
          : `✗ ${name}: ${res.error ?? 'gagal'}`,
      );
    } catch (e) {
      flash(`✗ ${name}: ${e instanceof Error ? e.message : 'gagal'}`);
    } finally {
      setTesting(null);
      refresh();
    }
  };

  const handleToggle = async (p: LlmProviderView) => {
    try {
      await adminPatchLlmProvider(p.name, { enabled: !p.enabled });
      flash(`${p.name} ${p.enabled ? 'dinonaktifkan' : 'diaktifkan'}`);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal mengubah status.');
    }
  };

  const handleDelete = async (p: LlmProviderView) => {
    if (!window.confirm(`Hapus provider "${p.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await adminDeleteLlmProvider(p.name);
      flash(`✓ ${p.name} dihapus`);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus provider.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">LLM Providers</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Koneksi AI yang dipakai aplikasi &amp; CLI — API{' '}
            <span
              className={
                health === 'ok'
                  ? 'text-emerald-400'
                  : health === 'unknown'
                    ? 'text-slate-500'
                    : 'text-amber-400'
              }
            >
              {health === 'ok' ? 'healthy' : health}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-lg border border-surface-3 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-surface-2"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setWizardOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-accent-400"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
            Add provider
          </button>
        </div>
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
      ) : providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-3 bg-surface-1 py-16 text-center">
          <Cable className="mb-3 h-8 w-8 text-slate-600" strokeWidth={1.5} aria-hidden />
          <p className="text-sm text-slate-400">Belum ada provider terhubung.</p>
          <p className="mt-1 text-xs text-slate-600">
            Klik &quot;Add provider&quot; untuk menghubungkan LLM pertama (OpenAI, Anthropic, Grok,
            DeepSeek, dll).
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {providers.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border border-surface-3 bg-surface-1 p-4 shadow-soft transition-opacity ${
                p.enabled ? '' : 'opacity-60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-mono text-sm font-semibold text-slate-100">{p.name}</h3>
                    <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                      {PRESET_LABEL[p.provider] ?? p.provider}
                    </span>
                    <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                      {TYPE_LABEL[p.type] ?? p.type}
                    </span>
                    {p.lastTestOk === true && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" aria-hidden /> last test OK
                      </span>
                    )}
                    {p.lastTestOk === false && (
                      <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                        <XCircle className="h-3 w-3" aria-hidden /> last test failed
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 truncate font-mono text-[11px] text-slate-500">
                    {p.baseUrl}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Key <span className="font-mono text-slate-400">{p.apiKeyMasked}</span> ·{' '}
                    {p.models.length} model
                    {p.lastTestAt ? ` · tested ${new Date(p.lastTestAt).toLocaleString()}` : ''}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.models.slice(0, 6).map((m) => (
                      <span
                        key={m}
                        className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-slate-400"
                      >
                        {m}
                      </span>
                    ))}
                    {p.models.length > 6 && (
                      <span className="px-1 py-0.5 text-[10px] text-slate-600">
                        +{p.models.length - 6} lagi
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => void handleTest(p.name)}
                    disabled={testing === p.name}
                    title="Test connection"
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-surface-3 px-2.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-surface-2 disabled:opacity-50"
                  >
                    {testing === p.name ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                    )}
                    Test
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleToggle(p)}
                    title={p.enabled ? 'Disable' : 'Enable'}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      p.enabled
                        ? 'border-surface-3 text-slate-400 hover:bg-surface-2 hover:text-amber-300'
                        : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    <Power className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(p);
                      setWizardOpen(true);
                    }}
                    title="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-3 text-slate-400 transition-colors hover:bg-surface-2 hover:text-slate-200"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(p)}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-3 text-slate-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-surface-3 bg-surface-2 px-4 py-2 text-xs text-slate-200 shadow-2xl">
          {toast}
        </div>
      )}

      {wizardOpen && (
        <ProviderWizard
          editing={editing}
          onClose={() => {
            setWizardOpen(false);
            setEditing(null);
          }}
          onSaved={() => {
            setWizardOpen(false);
            setEditing(null);
            refresh();
            flash('✓ Provider disimpan');
          }}
        />
      )}
    </div>
  );
}
