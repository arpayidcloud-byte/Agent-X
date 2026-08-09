'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  GitBranch,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  ShieldAlert,
  Trash2,
  X,
  XCircle,
  Sparkles,
  Boxes,
} from 'lucide-react';
import {
  adminListGroups,
  adminListLlmProviders,
  adminCreateGroup,
  adminUpdateGroup,
  adminDeleteGroup,
  adminTestGroup,
  type ProviderGroupView,
  type LlmProviderView,
  type GroupStrategy,
  type GroupTestResult,
} from '@/lib/api';

const STRATEGY_LABEL: Record<string, string> = {
  priority: 'Priority (fallback berurutan)',
  'round-robin': 'Round-robin (bergilir)',
};

export default function GroupsView() {
  const [groups, setGroups] = useState<ProviderGroupView[]>([]);
  const [providers, setProviders] = useState<LlmProviderView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, GroupTestResult>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProviderGroupView | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStrategy, setFormStrategy] = useState<GroupStrategy>('priority');
  const [formMembers, setFormMembers] = useState<string[]>([]);
  const [formEnabled, setFormEnabled] = useState(true);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 3500);
  };

  const refresh = () => {
    void Promise.all([
      adminListGroups(),
      adminListLlmProviders().catch(() => ({ providers: [] as LlmProviderView[] })),
    ])
      .then(([g, p]) => {
        setGroups(g.groups);
        setProviders(p.providers);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Gagal memuat combo.'));
  };

  useEffect(() => {
    void Promise.all([
      adminListGroups(),
      adminListLlmProviders().catch(() => ({ providers: [] as LlmProviderView[] })),
    ])
      .then(([g, p]) => {
        setGroups(g.groups);
        setProviders(p.providers);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Gagal memuat combo.'))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormName('');
    setFormDesc('');
    setFormStrategy('priority');
    setFormMembers([]);
    setFormEnabled(true);
    setModalOpen(true);
  };

  const openEdit = (g: ProviderGroupView) => {
    setEditing(g);
    setFormName(g.name);
    setFormDesc(g.description ?? '');
    setFormStrategy(g.strategy);
    setFormMembers(g.members.map((m) => m.provider));
    setFormEnabled(g.enabled);
    setModalOpen(true);
  };

  const toggleMember = (name: string) => {
    setFormMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const moveMember = (idx: number, dir: -1 | 1) => {
    setFormMembers((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target]!, next[idx]!];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const name = formName.trim().toLowerCase();
      if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(name)) {
        throw new Error('Nama: huruf kecil, angka, atau dash (contoh: combo-utama)');
      }
      if (formMembers.length === 0) {
        throw new Error('Pilih minimal 1 provider member');
      }
      const members = formMembers.map((provider) => ({ provider }));
      if (editing) {
        await adminUpdateGroup(editing.name, {
          description: formDesc || null,
          strategy: formStrategy,
          members,
          enabled: formEnabled,
        });
        flash('✓ Combo diperbarui');
      } else {
        await adminCreateGroup({
          name,
          description: formDesc || null,
          strategy: formStrategy,
          members,
          enabled: formEnabled,
        });
        flash('✓ Combo dibuat');
      }
      setModalOpen(false);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan combo.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (name: string) => {
    setTesting(name);
    setError('');
    try {
      const result = await adminTestGroup(name);
      setTestResult((prev) => ({ ...prev, [name]: result }));
      flash(
        result.usable
          ? `✓ Combo ${name} siap dipakai`
          : `✗ Combo ${name}: ada member tidak terdaftar`,
      );
    } catch (e) {
      flash(`✗ ${name}: ${e instanceof Error ? e.message : 'gagal test'}`);
    } finally {
      setTesting(null);
    }
  };

  const handleToggle = async (g: ProviderGroupView) => {
    try {
      await adminUpdateGroup(g.name, { enabled: !g.enabled });
      flash(`Combo ${g.name} ${g.enabled ? 'dinonaktifkan' : 'diaktifkan'}`);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal mengubah status.');
    }
  };

  const handleDelete = async (g: ProviderGroupView) => {
    if (!window.confirm(`Hapus combo "${g.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await adminDeleteGroup(g.name);
      flash(`✓ ${g.name} dihapus`);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus combo.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-500/10 ring-1 ring-accent-500/20"><Boxes className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.8} /></span><h1 className="text-xl font-bold tracking-tight text-white">Combo Providers</h1></div>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400">
            Gabungan beberapa provider dalam satu nama — dipakai di CLI/web sebagai{' '}
            <code className="text-slate-400">provider</code>. Server otomatis memilih member sesuai
            strategi &amp; failover ke member berikutnya saat gagal (5xx/429/timeout).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-500 sm:flex"><Sparkles className="h-3 w-3 text-accent-300" /> Obsidian Warp</span>
          <button
            type="button"
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-surface-3 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-xl bg-accent-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-colors hover:bg-accent-400"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
            Add combo
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <div className="glass-card flex items-center justify-center rounded-2xl py-16">
          <Loader2 className="h-5 w-5 animate-spin text-accent-400" aria-hidden />
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] bg-surface-1/50 py-16 text-center">
          <Layers className="mb-3 h-8 w-8 text-slate-600" strokeWidth={1.5} aria-hidden />
          <p className="text-sm text-slate-400">Belum ada combo provider.</p>
          <p className="mt-1 max-w-sm text-xs text-slate-600">
            Buat combo pertama: gabungkan beberapa provider (misal Gemini, DeepSeek, Qwen) jadi satu
            nama yang dipakai di CLI.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((g) => {
            const test = testResult[g.name];
            return (
              <div
                key={g.name}
                className={`glass-card rounded-2xl p-4 transition-all hover:border-white/[0.08] ${
                  g.enabled ? '' : 'opacity-60'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-mono text-sm font-semibold tracking-tight text-white">{g.name}</h3>
                      <span className="flex items-center gap-1 rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                        <GitBranch className="h-3 w-3" aria-hidden />
                        {STRATEGY_LABEL[g.strategy] ?? g.strategy}
                      </span>
                      {g.enabled ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" aria-hidden /> enabled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                          <ShieldAlert className="h-3 w-3" aria-hidden /> disabled
                        </span>
                      )}
                    </div>
                    {g.description && (
                      <p className="mt-1 text-[11px] text-slate-500">{g.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {g.members.map((m, i) => (
                        <span key={m.provider} className="flex items-center gap-1.5">
                          {i > 0 && <span className="text-[10px] text-slate-600">→</span>}
                          <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                            {m.provider}
                          </span>
                        </span>
                      ))}
                    </div>
                    {test && (
                      <div
                        className={`mt-2 flex flex-wrap items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] ${
                          test.usable
                            ? 'bg-emerald-500/5 text-emerald-400'
                            : 'bg-red-500/5 text-red-400'
                        }`}
                      >
                        {test.usable ? (
                          <CheckCircle2 className="h-3 w-3" aria-hidden />
                        ) : (
                          <XCircle className="h-3 w-3" aria-hidden />
                        )}
                        {test.usable
                          ? `Rantai siap: ${test.chain.join(' → ')}`
                          : `Member belum siap: ${test.members
                              .filter((m) => !m.registered)
                              .map((m) => m.provider)
                              .join(', ')}`}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => void handleTest(g.name)}
                      disabled={testing === g.name}
                      title="Test combo"
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-surface-3 px-2.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-surface-2 disabled:opacity-50"
                    >
                      {testing === g.name ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                      )}
                      Test
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleToggle(g)}
                      title={g.enabled ? 'Disable' : 'Enable'}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                        g.enabled
                          ? 'border-surface-3 text-slate-400 hover:bg-surface-2 hover:text-amber-300'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(g)}
                      title="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-3 text-slate-400 transition-colors hover:bg-surface-2 hover:text-slate-200"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(g)}
                      title="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-3 text-slate-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-surface-3 bg-surface-2 px-4 py-2 text-xs text-slate-200 shadow-2xl">
          {toast}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-surface-3 bg-surface-1 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                {editing ? `Edit combo ${editing.name}` : 'Buat combo baru'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-surface-2 hover:text-slate-200"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">Nama</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  disabled={Boolean(editing)}
                  placeholder="combo-utama"
                  className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500 focus:outline-none disabled:opacity-50"
                />
                <p className="mt-1 text-[10px] text-slate-600">
                  Nama ini yang dipakai sebagai <code>provider</code> di CLI/web.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">
                  Deskripsi (opsional)
                </label>
                <input
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Gabungan utama untuk produksi"
                  className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">
                  Strategi
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(['priority', 'round-robin'] as GroupStrategy[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormStrategy(s)}
                      className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                        formStrategy === s
                          ? 'border-accent-500 bg-accent-500/10'
                          : 'border-surface-3 hover:bg-surface-2'
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-200">{STRATEGY_LABEL[s]}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {s === 'priority'
                          ? 'Coba member pertama, pindah ke berikutnya saat gagal.'
                          : 'Bagi beban bergilir antar member.'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">
                  Members (urutan = prioritas)
                </label>
                <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border border-surface-3 bg-surface-0 p-2">
                  {providers.length === 0 && (
                    <p className="px-2 py-3 text-center text-[11px] text-slate-600">
                      Belum ada provider. Tambahkan dulu di menu LLM Providers.
                    </p>
                  )}
                  {providers.map((p) => {
                    const selected = formMembers.includes(p.name);
                    const idx = formMembers.indexOf(p.name);
                    return (
                      <div
                        key={p.name}
                        className={`flex items-center justify-between rounded-md px-2 py-1.5 transition-colors ${
                          selected ? 'bg-accent-500/10' : 'hover:bg-surface-2'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleMember(p.name)}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left"
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              selected
                                ? 'border-accent-500 bg-accent-500 text-slate-950'
                                : 'border-surface-3'
                            }`}
                          >
                            {selected && (
                              <CheckCircle2 className="h-3 w-3" strokeWidth={3} aria-hidden />
                            )}
                          </span>
                          <span className="truncate font-mono text-xs text-slate-200">
                            {p.name}
                          </span>
                          {!p.enabled && (
                            <span className="text-[10px] text-amber-400">(disabled)</span>
                          )}
                        </button>
                        {selected && (
                          <div className="flex shrink-0 items-center gap-1">
                            <span className="px-1 font-mono text-[10px] text-slate-500">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => moveMember(idx, -1)}
                              disabled={idx === 0}
                              className="rounded px-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveMember(idx, 1)}
                              disabled={idx === formMembers.length - 1}
                              className="rounded px-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                            >
                              ↓
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                  className="h-4 w-4 accent-accent-500"
                />
                Aktifkan combo
              </label>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-surface-3 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-surface-2"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-accent-400 disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />}
                  {editing ? 'Simpan' : 'Buat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
