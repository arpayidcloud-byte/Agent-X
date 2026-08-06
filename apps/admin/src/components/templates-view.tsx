'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Tag,
  Loader2,
  RefreshCw,
  X,
  Hash,
} from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  description: string | null;
  content: string;
  tags: string[];
  version: number;
  usageCount: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export default function TemplatesView() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', content: '', tags: '' });
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api<{ templates: PromptTemplate[] }>('/v1/prompt-templates');
        if (!cancelled) setTemplates(res.templates);
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

  function handleRefresh() {
    setRefreshing(true);
    setError(null);
    void (async () => {
      try {
        const res = await api<{ templates: PromptTemplate[] }>('/v1/prompt-templates');
        setTemplates(res.templates);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setRefreshing(false);
      }
    })();
  }

  function openCreate() {
    setForm({ name: '', description: '', content: '', tags: '' });
    setEditingId(null);
    setShowCreate(true);
  }

  function openEdit(t: PromptTemplate) {
    setForm({
      name: t.name,
      description: t.description ?? '',
      content: t.content,
      tags: t.tags.join(', '),
    });
    setEditingId(t.id);
    setShowCreate(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (editingId) {
        await api(`/v1/prompt-templates/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: form.name,
            description: form.description || undefined,
            content: form.content,
            tags,
          }),
        });
      } else {
        await api('/v1/prompt-templates', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            description: form.description || undefined,
            content: form.content,
            tags,
          }),
        });
      }
      setShowCreate(false);
      setEditingId(null);
      handleRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this template?')) return;
    try {
      await api(`/v1/prompt-templates/${id}`, { method: 'DELETE' });
      handleRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleCopy(id: string) {
    try {
      const res = await api<{ templates: PromptTemplate[] }>('/v1/prompt-templates');
      const original = res.templates.find((t) => t.id === id);
      if (original) {
        await api('/v1/prompt-templates', {
          method: 'POST',
          body: JSON.stringify({
            name: `${original.name} (copy)`,
            description: original.description,
            content: original.content,
            tags: original.tags,
          }),
        });
        handleRefresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  // Collect all unique tags
  const allTags = [...new Set(templates.flatMap((t) => t.tags))].sort();
  const filtered = filterTag ? templates.filter((t) => t.tags.includes(filterTag)) : templates;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Prompt Templates</h1>
          <p className="mt-1 text-sm text-slate-500">
            {templates.length} template{templates.length !== 1 ? 's' : ''} · Save, version, and
            reuse prompts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/[0.1] hover:text-slate-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-accent-400"
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

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterTag(null)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
              !filterTag
                ? 'bg-accent-500/20 text-accent-300'
                : 'bg-surface-2/60 text-slate-500 hover:text-slate-300'
            }`}
          >
            All ({templates.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filterTag === tag
                  ? 'bg-accent-500/20 text-accent-300'
                  : 'bg-surface-2/60 text-slate-500 hover:text-slate-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Create / Edit form */}
      {showCreate && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave(e);
          }}
          className="glass-card rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              {editingId ? 'Edit Template' : 'New Template'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setEditingId(null);
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
                placeholder="e.g. Code Review Prompt"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
                placeholder="e.g. coding, review, quality"
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
              placeholder="Brief description of this template"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-500">
              Prompt Content *
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={8}
              className="w-full rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 font-mono focus:border-accent-500/40 focus:ring-1 focus:ring-accent-500/20 focus:outline-none"
              placeholder="Write your prompt template here..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setEditingId(null);
              }}
              className="rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-accent-400"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Template list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-3 text-sm text-slate-500">
              {templates.length === 0
                ? 'No templates yet. Create your first prompt template.'
                : 'No templates match the selected filter.'}
            </p>
          </div>
        )}
        {filtered.map((t) => (
          <div
            key={t.id}
            className="glass-card rounded-xl p-4 transition-all hover:border-white/[0.08]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-200">{t.name}</h3>
                  <span className="rounded bg-surface-3/60 px-1.5 py-0.5 text-[10px] text-slate-500">
                    v{t.version}
                  </span>
                  <span className="flex items-center gap-1 rounded bg-surface-3/60 px-1.5 py-0.5 text-[10px] text-slate-500">
                    <Hash className="h-2.5 w-2.5" />
                    {t.usageCount}
                  </span>
                </div>
                {t.description && <p className="mt-1 text-xs text-slate-500">{t.description}</p>}
                <p className="mt-2 line-clamp-2 text-xs text-slate-400 font-mono">{t.content}</p>
                {t.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded bg-accent-500/10 px-1.5 py-0.5 text-[10px] text-accent-300"
                      >
                        <Tag className="h-2 w-2" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(t)}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-surface-3/60 hover:text-slate-300"
                  title="Edit"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => void handleCopy(t.id)}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-surface-3/60 hover:text-slate-300"
                  title="Duplicate"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
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
    </div>
  );
}
