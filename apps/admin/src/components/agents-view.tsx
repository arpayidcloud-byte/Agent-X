'use client';

import { useEffect, useState } from 'react';
import { Landmark, Code2, Search, FlaskConical, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fetchAgents, updateAgent, type AgentConfig } from '@/lib/api';

const ROLE_ICON: Record<string, LucideIcon> = {
  architect: Landmark,
  coder: Code2,
  reviewer: Search,
  tester: FlaskConical,
};

const ROLE_COLOR: Record<string, string> = {
  architect: 'text-accent-300 bg-accent-500/10',
  coder: 'text-secondary-300 bg-secondary-500/10',
  reviewer: 'text-amber-300 bg-amber-500/10',
  tester: 'text-emerald-300 bg-emerald-500/10',
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
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="section space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Agents</h1>
          <p className="mt-1 text-sm text-slate-500">
            {agents?.length ?? 0} specialist agents · {agents?.filter((a) => a.enabled).length ?? 0}{' '}
            enabled
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
          <p className="text-sm text-rose-300">⚠ {error}</p>
        </div>
      )}

      {agents?.map((agent) => {
        const RoleIcon = ROLE_ICON[agent.role] ?? Code2;
        const roleColor = ROLE_COLOR[agent.role] ?? 'text-slate-300 bg-surface-3';
        return (
          <div
            key={agent.id}
            className={`glass-card rounded-xl p-5 transition-all ${!agent.enabled ? 'opacity-60' : ''}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${roleColor}`}
                >
                  <RoleIcon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-100">{agent.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${agent.enabled ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-white/[0.06] bg-surface-3/80 text-slate-400'}`}
                    >
                      {agent.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-slate-400">{agent.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {agent.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="rounded-md bg-surface-3/60 px-2 py-0.5 text-[10px] font-medium text-slate-400"
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
                className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all disabled:opacity-50 ${
                  agent.enabled
                    ? 'bg-accent-500 text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)]'
                    : 'border border-white/[0.06] bg-surface-3/80 text-slate-200 hover:bg-surface-4'
                }`}
              >
                {saving === agent.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {agent.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Config controls */}
            <div className="mt-4 flex flex-wrap gap-4 border-t border-white/[0.04] pt-4 text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                Model
                <select
                  value={agent.model}
                  onChange={(e) => void patch(agent.id, { model: e.target.value })}
                  disabled={saving === agent.id}
                  className="rounded-lg border border-white/[0.06] bg-surface-2/60 px-2.5 py-1.5 text-xs text-slate-200 focus:border-accent-500/40 focus:outline-none disabled:opacity-50"
                >
                  {modelOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-slate-400">
                Complexity
                <select
                  value={agent.complexity}
                  onChange={(e) => void patch(agent.id, { complexity: e.target.value })}
                  disabled={saving === agent.id}
                  className="rounded-lg border border-white/[0.06] bg-surface-2/60 px-2.5 py-1.5 text-xs text-slate-200 focus:border-accent-500/40 focus:outline-none disabled:opacity-50"
                >
                  {COMPLEXITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <span className="rounded-lg bg-surface-2/40 px-2.5 py-1.5 font-mono text-[11px] text-slate-500">
                role: {agent.role} · id: {agent.id}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
