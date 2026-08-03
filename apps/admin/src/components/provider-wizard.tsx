'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, PlugZap, X } from 'lucide-react';
import {
  adminListPresets,
  adminCreateLlmProvider,
  adminPatchLlmProvider,
  type LlmProviderView,
  type ProviderPreset,
  type ProviderType,
} from '@/lib/api';

type Tab = 'preset' | 'openai' | 'anthropic';

interface WizardProps {
  editing?: LlmProviderView | null;
  onClose: () => void;
  onSaved: () => void;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63);

const parseModels = (s: string) =>
  s
    .split(/[\n,]+/)
    .map((m) => m.trim())
    .filter(Boolean);

export default function ProviderWizard({ editing, onClose, onSaved }: WizardProps) {
  const [tab, setTab] = useState<Tab>('preset');
  const [presets, setPresets] = useState<ProviderPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const [name, setName] = useState(editing?.name ?? '');
  const [type, setType] = useState<ProviderType>(editing?.type ?? 'openai-compatible');
  const [baseUrl, setBaseUrl] = useState(editing?.baseUrl ?? '');
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState(editing?.models.join('\n') ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editing) {
      void adminListPresets().then((d) => {
        setPresets(d.presets);
        setSelectedPreset(d.presets[0]?.slug ?? '');
      });
    }
  }, [editing]);

  const activePreset = useMemo(
    () => presets.find((p) => p.slug === selectedPreset) ?? null,
    [presets, selectedPreset],
  );

  // When a preset is picked, autofill type/baseUrl/models via the select
  // onChange handler (event handlers are allowed to set state directly).
  const pickPreset = (slug: string) => {
    setSelectedPreset(slug);
    if (editing) return;
    const p = presets.find((x) => x.slug === slug);
    if (p) {
      setType(p.type);
      setBaseUrl(p.baseUrl);
      setModels(p.models.join('\n'));
      if (!name) setName(p.slug);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
    if (t === 'preset') {
      // restore preset defaults when returning to the gallery tab
      if (activePreset) {
        setType(activePreset.type);
        setBaseUrl(activePreset.baseUrl);
        setModels(activePreset.models.join('\n'));
      }
    } else {
      setType(t === 'openai' ? 'openai-compatible' : 'anthropic-compatible');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    const finalName = name.trim() || slugify(selectedPreset || 'provider');
    const finalModels = parseModels(models);
    const isPreset = tab === 'preset';

    try {
      setLoading(true);
      if (editing) {
        // PATCH: apiKey omitted keeps the existing encrypted key.
        const patch: Record<string, unknown> = {
          type,
          baseUrl: baseUrl.trim(),
          models: finalModels,
          enabled: true,
          provider: isPreset ? selectedPreset : 'custom',
        };
        if (apiKey.trim()) patch.apiKey = apiKey.trim();
        await adminPatchLlmProvider(editing.name, patch);
      } else {
        if (!apiKey.trim()) {
          setError('API key wajib diisi untuk provider baru.');
          return;
        }
        await adminCreateLlmProvider({
          name: finalName,
          type,
          baseUrl: baseUrl.trim(),
          apiKey: apiKey.trim(),
          models: finalModels,
          enabled: true,
          provider: isPreset ? selectedPreset : 'custom',
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan provider.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-accent-500/60';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-lg rounded-xl border border-surface-3 bg-surface-1 shadow-2xl">
        <div className="flex items-center justify-between border-b border-surface-3 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            {editing ? `Edit provider — ${editing.name}` : 'Tambah provider LLM'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-surface-2 hover:text-slate-200"
          >
            <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          </button>
        </div>

        {!editing && (
          <div className="flex gap-1 border-b border-surface-3 px-5 pt-3">
            {(
              [
                ['preset', 'Native presets'],
                ['openai', 'OpenAI-compatible'],
                ['anthropic', 'Anthropic-compatible'],
              ] as Array<[Tab, string]>
            ).map(([t, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={`rounded-t-lg px-3 py-2 text-xs font-medium transition-colors ${
                  tab === t
                    ? 'border-b-2 border-accent-400 text-accent-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 px-5 py-5">
          {!editing && tab === 'preset' && (
            <div>
              <label htmlFor="preset" className="mb-1.5 block text-xs font-medium text-slate-400">
                Pilih provider
              </label>
              <select
                id="preset"
                value={selectedPreset}
                onChange={(e) => pickPreset(e.target.value)}
                className={inputCls}
              >
                {presets.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.label}
                  </option>
                ))}
              </select>
              {activePreset && (
                <p className="mt-1.5 text-[11px] text-slate-500">
                  {activePreset.type === 'openai-compatible'
                    ? 'OpenAI-compatible'
                    : 'Anthropic-compatible'}{' '}
                  · {activePreset.baseUrl}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="p-name" className="mb-1.5 block text-xs font-medium text-slate-400">
              Nama provider (slug)
            </label>
            <input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={slugify(selectedPreset || 'my-provider')}
              disabled={!!editing}
              className={`${inputCls} ${editing ? 'opacity-60' : ''}`}
            />
          </div>

          <div>
            <label htmlFor="p-base" className="mb-1.5 block text-xs font-medium text-slate-400">
              Base URL
            </label>
            <input
              id="p-base"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="p-key" className="mb-1.5 block text-xs font-medium text-slate-400">
              API key{' '}
              {editing && <span className="text-slate-600">(kosongkan untuk pertahankan)</span>}
            </label>
            <input
              id="p-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={editing ? editing.apiKeyMasked : 'sk-…'}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="p-models" className="mb-1.5 block text-xs font-medium text-slate-400">
              Model IDs <span className="text-slate-600">(satu per baris / pisah koma)</span>
            </label>
            <textarea
              id="p-models"
              value={models}
              onChange={(e) => setModels(e.target.value)}
              rows={4}
              required
              placeholder={'gpt-4o\ngpt-4o-mini'}
              className={`${inputCls} font-mono text-xs`}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-surface-3 px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-surface-2 hover:text-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <PlugZap className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              )}
              {editing ? 'Simpan perubahan' : 'Simpan provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
