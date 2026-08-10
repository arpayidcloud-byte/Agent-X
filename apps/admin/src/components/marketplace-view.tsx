'use client';

import { useEffect, useState } from 'react';
import {
  Store,
  Plus,
  Trash2,
  Pencil,
  Loader2,
  RefreshCw,
  X,
  Star,
  Download,
  Search,
  Sparkles,
} from 'lucide-react';

interface AgentTemplate {
  id: string;
  name: string;
  description: string | null;
  systemPrompt: string | null;
  tags: string[];
  category: string;
  priceUsd: number;
  installCount: number;
  rating: number;
  ratingCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_FORM = {
  name: '',
  description: '',
  category: '',
  tags: '',
  priceUsd: 0,
  systemPrompt: '',
  isPublished: true,
  isFeatured: false,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('agentx_admin_token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i <= full ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
          strokeWidth={1.5}
        />
      ))}
      <span className="ml-1 text-[11px] text-slate-500">
        {rating > 0 ? rating.toFixed(1) : '—'}
      </span>
    </span>
  );
}

export default function MarketplaceView() {
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/v1/marketplace/templates');
      setTemplates(data.templates);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiFetch('/v1/marketplace/templates');
        if (!cancelled) setTemplates(data.templates);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.description ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description || undefined,
        category: form.category,
        tags: form.tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        priceUsd: form.priceUsd,
        systemPrompt: form.systemPrompt || undefined,
        isPublished: form.isPublished,
        isFeatured: form.isFeatured,
        turnstileResponse: 'bypass-admin',
      };
      if (editId) {
        await apiFetch(`/v1/marketplace/admin/templates/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch('/v1/marketplace/admin/templates', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (t: AgentTemplate) => {
    setEditId(t.id);
    setForm({
      name: t.name,
      description: t.description ?? '',
      category: t.category,
      tags: t.tags.join(', '),
      priceUsd: t.priceUsd,
      systemPrompt: t.systemPrompt ?? '',
      isPublished: t.isPublished,
      isFeatured: t.isFeatured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    try {
      await apiFetch(`/v1/marketplace/admin/templates/${id}`, {
        method: 'DELETE',
      });
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const togglePublished = async (t: AgentTemplate) => {
    try {
      await apiFetch(`/v1/marketplace/admin/templates/${t.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPublished: !t.isPublished, turnstileResponse: 'bypass-admin' }),
      });
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const toggleFeatured = async (t: AgentTemplate) => {
    try {
      await apiFetch(`/v1/marketplace/admin/templates/${t.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isFeatured: !t.isFeatured, turnstileResponse: 'bypass-admin' }),
      });
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-500/10 ring-1 ring-accent-500/20">
              <Store className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.8} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">Marketplace</h1>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
            {templates.length} agent template{templates.length !== 1 ? 's' : ''} · Browse, create,
            manage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-500 sm:flex">
            <Sparkles className="h-3 w-3 text-accent-300" /> Obsidian Warp
          </span>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-surface-3 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm(EMPTY_FORM);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-colors hover:bg-accent-400"
          >
            <Plus className="h-3 w-3" />
            New Template
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
          <p className="text-sm text-rose-300">⚠ {error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="glass-card rounded-2xl p-5 space-y-4 ring-1 ring-white/[0.04]"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              {editId ? 'Edit Template' : 'New Template'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
                placeholder="e.g. Code Reviewer"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">
                Category *
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
                placeholder="e.g. coding, writing, general"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-500">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
              placeholder="Brief description"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
                placeholder="e.g. coding, review"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">
                Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.priceUsd}
                onChange={(e) => setForm({ ...form, priceUsd: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-500">
              System Prompt
            </label>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 font-mono focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
              placeholder="System prompt for this agent template..."
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-surface-3 bg-surface-2 accent-accent-500"
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-surface-3 bg-surface-2 accent-accent-500"
              />
              Featured
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-accent-400 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
              {editId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center ring-1 ring-white/[0.04]">
          <Store className="mx-auto h-8 w-8 text-slate-600" />
          <p className="mt-3 text-sm text-slate-500">
            {templates.length === 0
              ? 'No templates yet. Create your first agent template.'
              : 'No templates match your search.'}
          </p>
        </div>
      )}

      {/* Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="glass-card group relative overflow-hidden rounded-2xl p-4 transition-all hover:border-white/[0.08]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-tight text-white">{t.name}</h3>
                    {t.isPublished ? (
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-400">
                        Live
                      </span>
                    ) : (
                      <span className="rounded bg-slate-500/15 px-1.5 py-0.5 text-[10px] text-slate-500">
                        Draft
                      </span>
                    )}
                    {t.isFeatured && (
                      <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-400">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  {t.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{t.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="rounded bg-surface-3/60 px-1.5 py-0.5">{t.category}</span>
                    <span className="flex items-center gap-0.5">
                      <Download className="h-2.5 w-2.5" />
                      {t.installCount}
                    </span>
                    <span>{t.priceUsd > 0 ? `$${t.priceUsd.toFixed(2)}` : 'Free'}</span>
                    <Stars rating={t.rating} />
                  </div>
                  {t.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-accent-500/10 px-1.5 py-0.5 text-[10px] text-accent-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-1.5 text-[10px] text-slate-600">
                    by {t.authorName} · {new Date(t.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2 border-t border-white/[0.04] pt-3">
                <button
                  type="button"
                  onClick={() => void togglePublished(t)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                    t.isPublished
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-surface-3/60 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t.isPublished ? 'Published' : 'Unpublished'}
                </button>
                <button
                  type="button"
                  onClick={() => void toggleFeatured(t)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                    t.isFeatured
                      ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      : 'bg-surface-3/60 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t.isFeatured ? '★ Featured' : 'Feature'}
                </button>
                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(t)}
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-surface-3/60 hover:text-slate-300"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(t.id)}
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
