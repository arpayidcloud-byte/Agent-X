'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, RefreshCw, Trash2, PlugZap, ServerCog, ShieldAlert } from 'lucide-react';
import {
  adminListLlmProviders,
  adminUpsertLlmProvider,
  adminTestLlmProvider,
  adminDeleteLlmProvider,
  fetchMe,
  type AdminLlmProviderView,
} from '@/lib/api';

const PROVIDER_PRESETS: {
  type: 'openai-compatible' | 'anthropic-compatible';
  label: string;
  baseUrl: string;
  models: string[];
}[] = [
  {
    type: 'openai-compatible',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini'],
  },
  {
    type: 'openai-compatible',
    label: 'OpenRouter',
    baseUrl: 'https://api.openrouter.ai/api/v1',
    models: ['openrouter/auto'],
  },
  {
    type: 'openai-compatible',
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  {
    type: 'openai-compatible',
    label: 'Qwen (DashScope)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen-max', 'qwen-plus'],
  },
  {
    type: 'anthropic-compatible',
    label: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-7-sonnet-20250219', 'claude-3-haiku-20240307'],
  },
];

const TYPE_LABEL: Record<string, string> = {
  'openai-compatible': 'OpenAI-compatible',
  'anthropic-compatible': 'Anthropic-compatible',
};

const inputCls =
  'w-full rounded-lg border border-surface-3 bg-surface-0 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20';

export default function AdminLlmPanel() {
  const [providers, setProviders] = useState<AdminLlmProviderView[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'openai-compatible' | 'anthropic-compatible'>(
    'openai-compatible',
  );
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    try {
      const data = await adminListLlmProviders();
      setProviders(data.providers);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe()
      .then((d) => setIsAdmin(d.user.roles.includes('admin')))
      .catch(() => setIsAdmin(false));
    void refresh();
  }, [refresh]);

  function applyPreset(preset: (typeof PROVIDER_PRESETS)[number]) {
    setType(preset.type);
    setBaseUrl(preset.baseUrl);
    setModels(preset.models.join(', '));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const modelList = models
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      await adminUpsertLlmProvider({
        name: name.trim().toLowerCase(),
        type,
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim(),
        models: modelList,
      });
      setShowForm(false);
      setName('');
      setBaseUrl('');
      setApiKey('');
      setModels('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleTest(providerName: string) {
    setTesting(providerName);
    setTestResult((prev) => ({ ...prev, [providerName]: 'Testing…' }));
    try {
      const res = await adminTestLlmProvider(providerName);
      setTestResult((prev) => ({
        ...prev,
        [providerName]: res.ok
          ? `✓ OK (${res.latencyMs ?? '?'}ms${res.cost != null ? `, $${res.cost.toFixed(6)}` : ''})`
          : `✗ ${res.error ?? 'failed'}`,
      }));
    } catch (err) {
      setTestResult((prev) => ({
        ...prev,
        [providerName]: `✗ ${err instanceof Error ? err.message : String(err)}`,
      }));
    } finally {
      setTesting(null);
    }
  }

  async function handleDelete(providerName: string) {
    if (!window.confirm(`Hapus provider "${providerName}"?`)) return;
    try {
      await adminDeleteLlmProvider(providerName);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (isAdmin === false) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center">
        <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-rose-400" aria-hidden />
        <h1 className="text-base font-semibold text-slate-100">Admin access required</h1>
        <p className="mt-1 text-xs text-slate-400">
          Halaman ini khusus admin. Sign in dengan akun yang terdaftar di ADMIN_EMAILS.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ServerCog className="h-5 w-5 text-accent-400" aria-hidden />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">LLM Providers</h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Hubungkan AgentX ke berbagai LLM — OpenAI-compatible & Anthropic-compatible (OpenRouter,
            DeepSeek, Qwen, Groq, Together, Azure, dll). API key di-encrypt (AES-256-GCM) saat
            disimpan.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            className="flex items-center gap-1.5 rounded-lg border border-surface-3 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-surface-2"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-accent-400"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            {showForm ? 'Close' : 'Add provider'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
          ⚠ {error}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={(e) => void handleSave(e)}
          className="mb-6 space-y-3 rounded-2xl border border-surface-3 bg-surface-1 p-5"
        >
          <div>
            <label className="mb-1 block text-xs text-slate-400">Preset (opsional)</label>
            <div className="flex flex-wrap gap-1.5">
              {PROVIDER_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="rounded-md border border-surface-3 px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:border-accent-500/50 hover:text-accent-300"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Nama (slug)</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="deepseek, openrouter, claude…"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Tipe</label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as 'openai-compatible' | 'anthropic-compatible')
                }
                className={inputCls}
              >
                <option value="openai-compatible">OpenAI-compatible</option>
                <option value="anthropic-compatible">Anthropic-compatible</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Base URL</label>
            <input
              required
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">API Key</label>
            <input
              required
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-…"
              autoComplete="off"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Models (pisahkan dengan koma)
            </label>
            <input
              required
              value={models}
              onChange={(e) => setModels(e.target.value)}
              placeholder="gpt-4o, gpt-4o-mini"
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {saving ? 'Menyimpan…' : 'Simpan provider'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        </div>
      ) : providers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-3 py-16 text-center">
          <PlugZap className="mx-auto mb-3 h-8 w-8 text-slate-600" aria-hidden />
          <p className="text-sm text-slate-400">Belum ada LLM provider terhubung.</p>
          <p className="mt-1 text-xs text-slate-600">
            Klik &quot;Add provider&quot; untuk menghubungkan yang pertama.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {providers.map((p) => (
            <li
              key={p.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-3 bg-surface-1 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-100">{p.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      p.enabled
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-slate-700/40 text-slate-400'
                    }`}
                  >
                    {p.enabled ? 'enabled' : 'disabled'}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {TYPE_LABEL[p.type] ?? p.type} · {p.baseUrl}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {p.models.join(', ')} · key {p.apiKeyMasked}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {testResult[p.name] && (
                  <span
                    className={`text-[11px] ${
                      testResult[p.name].startsWith('✓') ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {testResult[p.name]}
                  </span>
                )}
                <button
                  type="button"
                  disabled={testing === p.name}
                  onClick={() => void handleTest(p.name)}
                  className="flex items-center gap-1 rounded-lg border border-surface-3 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:bg-surface-2 disabled:opacity-50"
                >
                  {testing === p.name ? (
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                  ) : (
                    <PlugZap className="h-3 w-3" aria-hidden />
                  )}
                  Test
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(p.name)}
                  className="flex items-center gap-1 rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-[11px] font-medium text-rose-300 transition hover:bg-rose-950/40"
                >
                  <Trash2 className="h-3 w-3" aria-hidden />
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
