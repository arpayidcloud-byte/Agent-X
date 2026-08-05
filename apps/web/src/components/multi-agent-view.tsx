'use client';

import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, Play, Users, Loader2 } from 'lucide-react';
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
import { Card } from '@/components/ui/card';

interface GoalCard {
  goalId: string;
  description: string;
  status: 'queued' | 'running' | 'done' | 'error';
  approved?: boolean;
  iterations?: number;
  error?: string;
}

// Multi-agent parallel execution: submit goals, run through specialist team
// concurrently with bounded pool, streaming live progress.
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
        status: 'queued' as const,
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

  const activeCount = goalCards.filter((c) => c.status === 'running').length;
  const doneCount = goalCards.filter((c) => c.status === 'done').length;
  const errorCount = goalCards.filter((c) => c.status === 'error').length;

  return (
    <div className="section space-y-6">
      {/* Command panel */}
      <Card className="rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-500/10">
            <Users className="h-4 w-4 text-accent-300" strokeWidth={2} />
          </div>
          <h2 className="text-base font-semibold text-slate-200">Parallel Multi-Agent Run</h2>
        </div>
        <p className="mb-5 ml-11 text-xs text-slate-500">
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
                className="rounded-lg border border-white/[0.06] bg-surface-2/60 px-2.5 py-1.5 text-xs text-slate-200 focus:border-accent-500/40 focus:outline-none focus:ring-2 focus:ring-accent-500/15 disabled:opacity-50"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </label>
            <Button type="submit" disabled={running || !goalsText.trim()}>
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                  Running…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" strokeWidth={2} aria-hidden />
                  Run in parallel
                </>
              )}
            </Button>
            {runId && <span className="font-mono text-xs text-slate-500">run: {runId}</span>}
          </div>
        </form>

        {error && (
          <div className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/5 p-3">
            <p className="text-xs text-rose-300">⚠ {error}</p>
          </div>
        )}
      </Card>

      {/* Progress bar */}
      {goalCards.length > 0 && running && (
        <div className="rounded-xl border border-white/[0.04] bg-surface-1/60 p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">Progress</span>
            <span className="text-slate-500">
              {doneCount + errorCount}/{goalCards.length} complete
              {activeCount > 0 && ` · ${activeCount} running`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-500"
              style={{ width: `${((doneCount + errorCount) / goalCards.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary */}
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

      {/* Goal cards */}
      {goalCards.length > 0 && (
        <div className="space-y-3">
          {goalCards.map((card, i) => {
            const isActive = card.status === 'running';
            return (
              <div
                key={`${card.goalId}-${i}`}
                className={`glass-card group relative rounded-xl p-4 transition-all ${
                  isActive ? 'border-accent-500/20 shadow-glow' : ''
                }`}
              >
                {/* Active pulse indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl bg-gradient-to-b from-accent-400 to-secondary-400" />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                        card.status === 'done'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : card.status === 'error'
                            ? 'bg-rose-500/10 text-rose-400'
                            : card.status === 'running'
                              ? 'bg-accent-500/10 text-accent-400'
                              : 'bg-surface-3 text-slate-500'
                      }`}
                    >
                      {card.status === 'done' && (
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {card.status === 'error' && (
                        <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {card.status === 'running' && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                      )}
                      {card.status === 'queued' && (
                        <span className="text-[10px] font-mono">{i + 1}</span>
                      )}
                    </span>
                    <p className="text-sm text-slate-200">{card.description}</p>
                  </div>
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
                  <p className="mt-2 ml-9 flex items-center gap-1.5 text-xs text-rose-400">
                    <XCircle className="h-3.5 w-3.5" aria-hidden /> {card.error}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
