'use client';

import { useState, useRef, useEffect } from 'react';
import {
  startMultiAgentRun,
  fetchMultiAgentRun,
  type MultiAgentStreamEvent,
  type MultiAgentRunDetail,
} from '@/lib/api';
import { openEventStream, type StreamHandle } from '@/lib/stream';

interface GoalCard {
  goalId: string;
  description: string;
  status: 'queued' | 'running' | 'done' | 'error';
  approved?: boolean;
  iterations?: number;
  error?: string;
}

// Web Pro parallel multi-agent execution: submit multiple goals (one per
// line), they run through the specialist team concurrently (bounded pool).
// Progress streams live via SSE with WebSocket fallback; the final status is
// also fetched as JSON so the page survives a refresh.
export default function MultiAgentView() {
  const [goalsText, setGoalsText] = useState(
    'Design an API gateway rate limiter\nBuild a user profile service\nAdd a search indexer',
  );
  const [concurrency, setConcurrency] = useState(2);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [goalCards, setGoalCards] = useState<GoalCard[]>([]);
  const [summary, setSummary] = useState<{
    approvedCount: number;
    totalGoals: number;
    wallTimeMs: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<StreamHandle | null>(null);
  const serverGoalIdsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      streamRef.current?.close();
    };
  }, []);

  async function handleRun(e: React.FormEvent) {
    e.preventDefault();
    const goals = goalsText
      .split('\n')
      .map((g) => g.trim())
      .filter(Boolean);
    if (goals.length === 0 || running) return;
    setError(null);
    setSummary(null);
    setRunning(true);
    setGoalCards(
      goals.map((g) => ({
        goalId: `local-${Math.random().toString(36).slice(2, 8)}`,
        description: g,
        status: 'queued',
      })),
    );
    serverGoalIdsRef.current = [];

    try {
      const { runId: rid } = await startMultiAgentRun(goals, concurrency);
      setRunId(rid);

      const handle = openEventStream(`ma:${rid}`, (raw) => {
        const ev = raw as MultiAgentStreamEvent;
        if (ev.type === 'run-accepted') {
          serverGoalIdsRef.current = ev.goalIds;
        } else if (ev.type === 'goal-start') {
          setGoalCards((prev) =>
            prev.map((c, i) => (i === ev.index ? { ...c, status: 'running' } : c)),
          );
        } else if (ev.type === 'goal-complete') {
          const index = serverGoalIdsRef.current.indexOf(ev.goalId);
          if (index === -1) return;
          setGoalCards((prev) =>
            prev.map((c, i) =>
              i === index
                ? {
                    ...c,
                    status: ev.approved ? 'done' : 'error',
                    approved: ev.approved,
                    iterations: ev.iterations,
                    error: ev.error,
                  }
                : c,
            ),
          );
        } else if (ev.type === 'run-complete') {
          setSummary({
            approvedCount: ev.approvedCount,
            totalGoals: ev.totalGoals,
            wallTimeMs: ev.wallTimeMs,
          });
          setRunning(false);
          handle.close();
          streamRef.current = null;
          void refreshFinal(rid);
        }
      });
      streamRef.current = handle;
    } catch (err) {
      setRunning(false);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function refreshFinal(rid: string) {
    try {
      const detail: MultiAgentRunDetail = await fetchMultiAgentRun(rid);
      const result = detail.run.result;
      if (!result) return;
      const byGoal = new Map(result.goals.map((g) => [g.goalId, g]));
      setGoalCards((prev) =>
        prev.map((c, i) => {
          const serverId = serverGoalIdsRef.current[i];
          const g = serverId ? byGoal.get(serverId) : undefined;
          if (!g) return c;
          return {
            ...c,
            status: g.error ? 'error' : 'done',
            approved: g.approved,
            iterations: g.iterations,
            error: g.error,
          };
        }),
      );
      setSummary({
        approvedCount: result.approvedCount,
        totalGoals: result.totalGoals,
        wallTimeMs: result.wallTimeMs,
      });
      setRunning(false);
    } catch {
      // Stream already gave us the summary; final refresh is best-effort.
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-violet-500/20 bg-slate-900/40 p-6">
        <h2 className="mb-1 text-lg font-semibold text-violet-400">
          Parallel Multi-Agent Run{' '}
          <span className="text-xs font-normal text-slate-500">(SSE + WS fallback)</span>
        </h2>
        <p className="mb-4 text-xs text-slate-500">
          One goal per line. Goals run through the specialist team (architect → coder → reviewer →
          tester) concurrently with a bounded pool. Live progress streams over SSE; WebSocket takes
          over automatically if SSE fails.
        </p>
        <form onSubmit={(e) => void handleRun(e)} className="space-y-3">
          <textarea
            value={goalsText}
            onChange={(e) => setGoalsText(e.target.value)}
            rows={4}
            placeholder="One goal per line…"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              Concurrency
              <select
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                disabled={running}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-violet-500 focus:outline-none disabled:opacity-50"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={running || !goalsText.trim()}
              className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running ? 'Running…' : 'Run in parallel →'}
            </button>
            {runId && <span className="font-mono text-xs text-slate-500">run: {runId}</span>}
          </div>
        </form>
        {error && (
          <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
            ⚠ {error}
          </p>
        )}
      </div>

      {summary && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5">
          <p className="text-sm font-semibold text-emerald-300">
            ✅ {summary.approvedCount}/{summary.totalGoals} goals approved
          </p>
          <p className="mt-1 text-xs text-slate-500">
            finished in {(summary.wallTimeMs / 1000).toFixed(1)}s wall time
          </p>
        </div>
      )}

      {goalCards.length > 0 && (
        <div className="space-y-3">
          {goalCards.map((card, i) => (
            <div
              key={`${card.goalId}-${i}`}
              className={`rounded-xl border p-4 ${
                card.status === 'done'
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : card.status === 'error'
                    ? 'border-rose-500/30 bg-rose-950/10'
                    : card.status === 'running'
                      ? 'border-violet-500/40 bg-violet-950/20'
                      : 'border-slate-800 bg-slate-950/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-slate-200">{card.description}</p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    card.status === 'done'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : card.status === 'error'
                        ? 'bg-rose-500/15 text-rose-400'
                        : card.status === 'running'
                          ? 'bg-violet-500/15 text-violet-400'
                          : 'bg-slate-500/15 text-slate-400'
                  }`}
                >
                  {card.status === 'done'
                    ? `approved (${card.iterations ?? 1} iter)`
                    : card.status === 'error'
                      ? card.approved === false
                        ? 'rejected'
                        : 'failed'
                      : card.status}
                </span>
              </div>
              {card.error && <p className="mt-2 text-xs text-rose-400">{card.error}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
