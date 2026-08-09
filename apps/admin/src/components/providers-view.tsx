'use client';

import { useEffect, useState } from 'react';
import { Cable, CheckCircle2, Loader2, Pencil, Plus, Power, RefreshCw, Trash2, XCircle, Sparkles, Boxes } from 'lucide-react';
import { adminListLlmProviders, adminTestLlmProvider, adminDeleteLlmProvider, adminPatchLlmProvider, fetchHealth, type LlmProviderView } from '@/lib/api';
import ProviderWizard from '@/components/provider-wizard';

const TYPE_LABEL: Record<string, string> = { 'openai-compatible': 'OpenAI-compatible', 'anthropic-compatible': 'Anthropic-compatible' };
const PRESET_LABEL: Record<string, string> = { openai: 'OpenAI', grok: 'Grok', deepseek: 'DeepSeek', qwen: 'Qwen', claude: 'Claude', gemini: 'Gemini', mistral: 'Mistral', openrouter: 'OpenRouter', groq: 'Groq', perplexity: 'Perplexity', custom: 'Custom' };

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
    let c = false;
    Promise.all([adminListLlmProviders(), fetchHealth().catch(() => ({ status: 'unknown' }))]).then(([data, h]) => { if (!c) { setProviders(data.providers); setHealth(h.status); } }).catch((e) => { if (!c) setError(e instanceof Error ? e.message : 'Gagal memuat provider.'); }).finally(() => { if (!c) setLoading(false); });
    return () => { c = true; };
  }, []);
  const refresh = () => { void Promise.all([adminListLlmProviders(), fetchHealth().catch(() => ({ status: 'unknown' }))]).then(([data, h]) => { setProviders(data.providers); setHealth(h.status); }).catch((e) => setError(e instanceof Error ? e.message : 'Gagal memuat provider.')); };
  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(''), 3500); };
  const handleTest = async (name: string) => {
    setTesting(name); setError('');
    try { const res = await adminTestLlmProvider(name); flash(res.ok ? `✓ ${name} OK — ${res.latencyMs}ms, $${res.cost?.toFixed(4) ?? '?'}` : `✗ ${name}: ${res.error ?? 'gagal'}`); } catch (e) { flash(`✗ ${name}: ${e instanceof Error ? e.message : 'gagal'}`); } finally { setTesting(null); refresh(); }
  };
  const handleToggle = async (p: LlmProviderView) => { try { await adminPatchLlmProvider(p.name, { enabled: !p.enabled }); flash(`${p.name} ${p.enabled ? 'dinonaktifkan' : 'diaktifkan'}`); refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Gagal mengubah status.'); } };
  const handleDelete = async (p: LlmProviderView) => {
    if (!window.confirm(`Hapus provider "${p.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try { await adminDeleteLlmProvider(p.name); flash(`✓ ${p.name} dihapus`); refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Gagal menghapus provider.'); }
  };
  return (
    <div className="section space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-500/10 ring-1 ring-accent-500/20"><Boxes className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.8} /></span><h1 className="text-xl font-bold tracking-tight text-white">LLM Providers</h1><span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${health === 'ok' ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20' : 'bg-surface-2 text-slate-400 ring-white/[0.06]'}`}>{health === 'ok' ? 'healthy' : health}</span></div><p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400">Koneksi AI yang dipakai aplikasi &amp; CLI — kelola, test, aktifkan.</p></div>
        <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-500 sm:flex"><Sparkles className="h-3 w-3 text-accent-300" /> Obsidian Warp</span><button type="button" onClick={refresh} className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-surface-3 hover:text-white"><RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} />Refresh</button><button type="button" onClick={() => { setEditing(null); setWizardOpen(true); }} className="flex items-center gap-1.5 rounded-xl bg-accent-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-colors hover:bg-accent-400"><Plus className="h-3.5 w-3.5" strokeWidth={2.2} />Add provider</button></div>
      </div>
      {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5 text-xs text-rose-300">{error}</p>}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}</div>
      ) : providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] bg-surface-1/50 py-16 text-center"><Cable className="mb-3 h-8 w-8 text-slate-600" strokeWidth={1.5} /><p className="text-sm text-slate-400">Belum ada provider terhubung.</p><p className="mt-1 text-xs text-slate-600">Klik &quot;Add provider&quot; untuk menghubungkan LLM pertama.</p></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((p) => (
            <div key={p.name} className={`glass-card group relative overflow-hidden rounded-2xl p-4 transition-all hover:border-white/[0.08] ${p.enabled ? '' : 'opacity-60'}`}>
              {p.enabled && <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-accent-500/10 blur-2xl" />}
              <div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1.5"><h3 className="font-mono text-sm font-semibold tracking-tight text-white">{p.name}</h3><span className="rounded-full border border-white/[0.06] bg-surface-3/60 px-2 py-0.5 text-[10px] font-medium text-slate-400">{PRESET_LABEL[p.provider] ?? p.provider}</span><span className="rounded-full border border-white/[0.06] bg-surface-3/60 px-2 py-0.5 text-[10px] font-medium text-slate-400">{TYPE_LABEL[p.type] ?? p.type}</span>{p.lastTestOk === true && <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20"><CheckCircle2 className="h-3 w-3" /> OK</span>}{p.lastTestOk === false && <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 ring-1 ring-rose-500/20"><XCircle className="h-3 w-3" /> failed</span>}</div><p className="mt-1.5 truncate font-mono text-[11px] text-slate-500">{p.baseUrl}</p><p className="mt-1 text-[11px] text-slate-500">Key <span className="font-mono text-slate-400">{p.apiKeyMasked}</span> · {p.models.length} model{p.lastTestAt ? ` · ${new Date(p.lastTestAt).toLocaleString()}` : ''}</p><div className="mt-2 flex flex-wrap gap-1">{p.models.slice(0, 6).map((m) => <span key={m} className="rounded-full border border-white/[0.06] bg-surface-2/60 px-2 py-0.5 font-mono text-[10px] text-slate-400">{m}</span>)}{p.models.length > 6 && <span className="px-1 py-0.5 text-[10px] text-slate-600">+{p.models.length - 6}</span>}</div></div></div>
              <div className="mt-3 flex items-center gap-1.5 border-t border-white/[0.04] pt-3">
                <button type="button" onClick={() => void handleTest(p.name)} disabled={testing === p.name} className="flex h-7 items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-2/60 px-2.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-surface-3 hover:text-white disabled:opacity-50">{testing === p.name ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" strokeWidth={1.8} />}Test</button>
                <button type="button" onClick={() => void handleToggle(p)} title={p.enabled ? 'Disable' : 'Enable'} className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${p.enabled ? 'border-white/[0.06] text-slate-400 hover:bg-surface-3 hover:text-amber-300' : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'}`}><Power className="h-3.5 w-3.5" strokeWidth={1.8} /></button>
                <button type="button" onClick={() => { setEditing(p); setWizardOpen(true); }} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.06] text-slate-400 transition-colors hover:bg-surface-3 hover:text-white"><Pencil className="h-3.5 w-3.5" strokeWidth={1.8} /></button>
                <button type="button" onClick={() => void handleDelete(p)} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.06] text-slate-400 transition-colors hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/[0.06] bg-surface-2 px-4 py-2 text-xs text-slate-200 shadow-2xl">{toast}</div>}
      {wizardOpen && <ProviderWizard editing={editing} onClose={() => { setWizardOpen(false); setEditing(null); }} onSaved={() => { setWizardOpen(false); setEditing(null); refresh(); flash('✓ Provider disimpan'); }} />}
    </div>
  );
}
