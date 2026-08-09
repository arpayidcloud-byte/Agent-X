'use client';

import { useEffect, useState } from 'react';
import { Landmark, Code2, Search, FlaskConical, Loader2, Sparkles, Cpu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fetchAgents, updateAgent, type AgentConfig } from '@/lib/api';

const ROLE_ICON: Record<string, LucideIcon> = {
  architect: Landmark,
  coder: Code2,
  reviewer: Search,
  tester: FlaskConical,
};

const ROLE_META: Record<string, { color: string; ring: string; label: string }> = {
  architect: { color: 'text-violet-300 bg-violet-500/10', ring: 'ring-violet-500/20', label: 'Architect' },
  coder: { color: 'text-sky-300 bg-sky-500/10', ring: 'ring-sky-500/20', label: 'Coder' },
  reviewer: { color: 'text-amber-300 bg-amber-500/10', ring: 'ring-amber-500/20', label: 'Reviewer' },
  tester: { color: 'text-emerald-300 bg-emerald-500/10', ring: 'ring-emerald-500/20', label: 'Tester' },
};

const COMPLEXITY_OPTIONS = ['simple', 'medium', 'complex'] as const;

export default function AgentsView() {
  const [agents, setAgents] = useState<AgentConfig[] | null>(null);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchAgents()
      .then((d) => {
        if (!cancelled) {
          setAgents(d.agents);
          setModelOptions(d.modelOptions);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function patch(id: string, p: { enabled?: boolean; model?: string; complexity?: string }) {
    setSaving(id);
    setError(null);
    try {
      const { agent } = await updateAgent(id, p);
      setAgents((prev) => (prev ? prev.map((a) => (a.id === id ? agent : a)) : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="section space-y-6">
        <div className="h-10 w-48 skeleton rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const enabledCount = agents?.filter((a) => a.enabled).length ?? 0;

  return (
    <div className="section space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-500/10 ring-1 ring-accent-500/20">
              <Cpu className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.8} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">Agents</h1>
            <span className="rounded-full bg-accent-500/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-300 ring-1 ring-accent-500/20">
              {enabledCount}/{agents?.length ?? 0} active
            </span>
          </div>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400">
            Specialist agents — each tuned for a role. Toggle, pick model &amp; complexity.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-2/60 px-3 py-1.5">
            <Sparkles className="h-3 w-3 text-accent-300" /> Obsidian Warp
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
          <p className="text-sm text-rose-300">⚠ {error}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {agents?.map((agent) => {
          const RoleIcon = ROLE_ICON[agent.role] ?? Code2;
          const meta = ROLE_META[agent.role] ?? { color: 'text-slate-300 bg-surface-3', ring: 'ring-white/10', label: agent.role };
          return (
            <div
              key={agent.id}
              className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-200 ${
                agent.enabled
                  ? 'glass-card border-accent-500/15 shadow-[0_0_24px_-12px_rgba(79,70,229,0.25)] hover:border-accent-500/25 hover:shadow-[0_0_32px_-12px_rgba(79,70,229,0.3)]'
                  : 'glass-card opacity-70 hover:opacity-90 hover:border-white/[0.08]'
              }`}
            >
              {agent.enabled && <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent-500/10 blur-2xl" />}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${meta.color} ${meta.ring}`}>
                    <RoleIcon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold tracking-tight text-white">{agent.name}</h3>
                      <span className="rounded-full bg-surface-3/60 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-400 ring-1 ring-white/[0.06]">
                        {meta.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          agent.enabled
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                            : 'border-white/[0.06] bg-surface-3/50 text-slate-400'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${agent.enabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        {agent.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 max-w-[32ch] text-xs leading-relaxed text-slate-400">{agent.description}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {agent.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="rounded-full border border-white/[0.06] bg-surface-2/60 px-2 py-0.5 text-[10px] font-medium text-slate-400"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void patch(agent.id, { enabled: !agent.enabled })}
                  disabled={saving === agent.id}
                  className={`flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition-all disabled:opacity-50 ${
                    agent.enabled
                      ? 'bg-accent-500 text-white shadow-[0_2px_10px_rgba(79,70,229,0.35)] hover:bg-accent-400'
                      : 'border border-white/[0.08] bg-surface-2 text-slate-300 hover:bg-surface-3 hover:text-white'
                  }`}
                >
                  {saving === agent.id && <Loader2 className="h-3 w-3 animate-spin" />}
                  {agent.enabled ? 'On' : 'Off'}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-white/[0.05] pt-4">
                <label className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                  Model
                  <select
                    value={agent.model}
                    onChange={(e) => void patch(agent.id, { model: e.target.value })}
                    disabled={saving === agent.id}
                    className="rounded-lg border border-white/[0.06] bg-surface-1 px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:border-accent-500/30 focus:outline-none focus:ring-2 focus:ring-accent-500/15 disabled:opacity-50"
                  >
                    {modelOptions.map((m) => (
                      <option key={m} value={m} className="bg-surface-1">
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                  Complexity
                  <select
                    value={agent.complexity}
                    onChange={(e) => void patch(agent.id, { complexity: e.target.value })}
                    disabled={saving === agent.id}
                    className="rounded-lg border border-white/[0.06] bg-surface-1 px-2.5 py-1.5 text-xs font-medium capitalize text-slate-200 focus:border-accent-500/30 focus:outline-none focus:ring-2 focus:ring-accent-500/15 disabled:opacity-50"
                  >
                    {COMPLEXITY_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-surface-1">
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="ml-auto rounded-full border border-white/[0.04] bg-surface-0/60 px-2.5 py-1 font-mono text-[10px] text-slate-500">
                  {agent.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
