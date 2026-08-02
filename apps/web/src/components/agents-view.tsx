'use client';

import { useEffect, useState } from 'react';
import { fetchAgents, updateAgent, isAuthed, getToken, type AgentConfig } from '@/lib/api';

const ROLE_EMOJI: Record<string, string> = {
  architect: '🏛️',
  coder: '💻',
  reviewer: '🔍',
  tester: '🧪',
};

const COMPLEXITY_OPTIONS = ['simple', 'medium', 'complex'] as const;

// Web Pro agent configuration: read-only view for visitors, full editing for
// admins (PATCH requires a Bearer token with role admin).
export default function AgentsView() {
  const [agents, setAgents] = useState<AgentConfig[] | null>(null);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [authed] = useState(() => isAuthed() && getToken() !== null);

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
    return <p className="py-10 text-center text-sm text-slate-500">Loading agents…</p>;
  }
  if (error && !agents) {
    return (
      <p className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">
        ⚠ Failed to load agents: {error}
      </p>
    );
  }
  if (!agents) return null;

  return (
    <div className="space-y-4">
      {!authed && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-950/30 px-4 py-2 text-xs text-amber-300">
          Read-only view — login as admin (via the Beta Recruitment page) to edit agent
          configuration.
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-2 text-xs text-rose-300">
          ⚠ {error}
        </p>
      )}

      {agents.map((agent) => (
        <div
          key={agent.id}
          className={`rounded-xl border p-5 transition ${
            agent.enabled
              ? 'border-slate-700/50 bg-slate-900/50'
              : 'border-slate-800 bg-slate-950/40 opacity-70'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                {ROLE_EMOJI[agent.role]} {agent.name}
                <span className="ml-2 rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400">
                  {agent.id}
                </span>
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">{agent.description}</p>
              <p className="mt-1 text-xs text-slate-500">{agent.capabilities.join(' · ')}</p>
            </div>
            {authed && (
              <button
                onClick={() => void patch(agent.id, { enabled: !agent.enabled })}
                disabled={saving === agent.id}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition disabled:opacity-50 ${
                  agent.enabled
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {agent.enabled ? 'Enabled' : 'Disabled'}
              </button>
            )}
          </div>

          {authed && (
            <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-800 pt-4 text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                Model
                <select
                  value={agent.model}
                  onChange={(e) => void patch(agent.id, { model: e.target.value })}
                  disabled={saving === agent.id}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
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
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                >
                  {COMPLEXITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              {saving === agent.id && (
                <span className="self-center text-xs text-slate-500">saving…</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
