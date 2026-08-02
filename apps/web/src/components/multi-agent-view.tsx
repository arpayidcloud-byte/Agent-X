'use client';

import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, Play } from 'lucide-react';
import {
  startMultiAgentRun,
  fetchMultiAgentRun,
  type MultiAgentStreamEvent,
  type MultiAgentRunDetail,
} from '@/lib/api';
import { openEventStream, type StreamHandle } from '@/lib/stream';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/input';

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
      <div className="rounded-xl border border-secondary-500/20 bg-surface-1 p-6">
        <h2 className="mb-1 text-base font-semibold text-slate-200">Parallel Multi-Agent Run</h2>
        <p className="mb-4 text-xs text-slate-500">
          One goal per line. Goals run through the specialist team (architect → coder → reviewer →
          tester) concurrently with a bounded pool, streaming live progress.
        </p>
        <form onSubmit={(e) => void handleRun(e)} className="space-y-3">
          <Textarea
            value={goalsText}
            onChange={(e) => setGoalsText(e.target.value)}
            rows={4}
            placeholder="One goal per line…"
            className="font-mono text-sm"
          />
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              Concurrency
              <select
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                disabled={running}
                className="rounded-lg border border-surface-3 bg-surface-0 px-2 py-1 text-xs text-slate-200 focus:border-secondary-500/60 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 disabled:opacity-50"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </label>
            <Button type="submit" disabled={running || !goalsText.trim()}>
              {running ? (
                'Running…'
              ) : (
                <>
                  <Play className="h-4 w-4" strokeWidth={2} aria-hidden /> Run in parallel
                </>
              )}
            </Button>
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
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              {summary.approvedCount}/{summary.totalGoals} goals approved
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              finished in {(summary.wallTimeMs / 1000).toFixed(1)}s wall time
            </p>
          </div>
        </div>
      )}

      {goalCards.length > 0 && (
        <div className="space-y-3">
          {goalCards.map((card, i) => (
            <div
              key={`${card.goalId}-${i}`}
              className={`rounded-xl border p-4 ${
                card.status === 'done'
                  ? 'border-emerald-500/25 bg-emerald-500/5'
                  : card.status === 'error'
                    ? 'border-rose-500/25 bg-rose-500/5'
                    : card.status === 'running'
                      ? 'border-secondary-500/30 bg-secondary-500/5'
                      : 'border-surface-3 bg-surface-1'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-slate-200">{card.description}</p>
                <Badge
                  tone={
                    card.status === 'done'
                      ? 'success'
                      : card.status === 'error'
                        ? 'danger'
                        : card.status === 'running'
                          ? 'accent'
                          : 'neutral'
                  }
                >
                  {card.status === 'done'
                    ? `approved (${card.iterations ?? 1} iter)`
                    : card.status === 'error'
                      ? card.approved === false
                        ? 'rejected'
                        : 'failed'
                      : card.status}
                </Badge>
              </div>
              {card.status === 'error' && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
                  <XCircle className="h-3.5 w-3.5" aria-hidden /> {card.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
