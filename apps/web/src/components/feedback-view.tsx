'use client';

import { useState, useEffect } from 'react';
import { Copy, Wand2, RefreshCw, MessageSquare } from 'lucide-react';
import {
  fetchAgentFeedback,
  fetchAgentFeedbackStats,
  postAgentFeedbackRevision,
  type AgentFeedbackRecord,
  type AgentFeedbackStats,
} from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { StatCard } from '@/components/ui/stat-card';
import { Card } from '@/components/ui/card';
import { SkeletonStat } from '@/components/ui/skeleton';

const GRADE_TONE: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  Excellent: 'success',
  Good: 'info',
  Fair: 'warning',
  Poor: 'danger',
};

export default function FeedbackView() {
  const [feedback, setFeedback] = useState<AgentFeedbackRecord[]>([]);
  const [stats, setStats] = useState<AgentFeedbackStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revisionFor, setRevisionFor] = useState<AgentFeedbackRecord | null>(null);
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [revisionInput, setRevisionInput] = useState('');
  const [building, setBuilding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetchAgentFeedback(20), fetchAgentFeedbackStats()])
      .then(([f, s]) => {
        if (!cancelled) {
          setFeedback(f.feedback);
          setStats(s.stats);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRevision(fb: AgentFeedbackRecord) {
    setRevisionFor(fb);
    setRevisionInput(fb.prompt);
    setRevisionPrompt('');
  }

  async function handleBuild() {
    if (!revisionFor || building) return;
    setBuilding(true);
    setError(null);
    try {
      const { revisionPrompt: built } = await postAgentFeedbackRevision(
        revisionFor.id,
        revisionInput,
      );
      setRevisionPrompt(built);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBuilding(false);
    }
  }

  async function handleCopy() {
    if (!revisionPrompt) return;
    await navigator.clipboard.writeText(revisionPrompt);
  }

  return (
    <div className="section space-y-6">
      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3">
          <p className="text-xs text-rose-300">⚠ {error}</p>
        </div>
      )}

      {/* Stats */}
      {stats ? (
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard
            label="Total feedback"
            value={stats.total}
            icon={RefreshCw}
            tone="text-accent-300"
          />
          <StatCard
            label="Needs improvement"
            value={(stats.byGrade.Poor ?? 0) + (stats.byGrade.Fair ?? 0)}
            icon={RefreshCw}
            tone="text-amber-300"
          />
          <StatCard
            label="Strong outputs"
            value={(stats.byGrade.Good ?? 0) + (stats.byGrade.Excellent ?? 0)}
            icon={RefreshCw}
            tone="text-emerald-300"
          />
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
      )}

      {/* How it works */}
      <Card className="rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-500/10">
            <MessageSquare className="h-4 w-4 text-accent-300" strokeWidth={2} />
          </div>
          <h2 className="text-sm font-semibold text-slate-200">How the feedback loop works</h2>
        </div>
        <p className="ml-11 text-xs leading-relaxed text-slate-500">
          When a task output scores below 70, the system automatically generates actionable
          feedback: the weakest quality dimensions, concrete improvement suggestions, and a ready
          revision prompt. Run the revision prompt on the next attempt to close the loop — score,
          feedback, improve, re-score.
        </p>
      </Card>

      {/* Revision builder */}
      {revisionFor && (
        <Card className="rounded-2xl border-accent-500/15 p-5">
          <h2 className="mb-1 text-sm font-semibold text-slate-200">
            Revision builder —{' '}
            <Badge tone={GRADE_TONE[revisionFor.grade] ?? 'neutral'}>
              {revisionFor.grade} ({revisionFor.overall})
            </Badge>
          </h2>
          <p className="mb-3 mt-1 text-xs text-slate-500">
            Rewrite the prompt for a follow-up run; feedback from the previous attempt is appended
            automatically.
          </p>
          <Textarea
            value={revisionInput}
            onChange={(e) => setRevisionInput(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              onClick={() => void handleBuild()}
              loading={building}
              disabled={!revisionInput.trim()}
            >
              {building ? (
                'Building…'
              ) : (
                <>
                  <Wand2 className="h-4 w-4" strokeWidth={2} aria-hidden /> Build revision prompt
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleCopy()}
              disabled={!revisionPrompt}
            >
              <Copy className="h-4 w-4" strokeWidth={2} aria-hidden /> Copy
            </Button>
            <Button variant="ghost" onClick={() => setRevisionFor(null)}>
              Close
            </Button>
          </div>
          {revisionPrompt && (
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-white/[0.04] bg-surface-0 p-4 font-mono text-xs text-slate-300">
              {revisionPrompt}
            </pre>
          )}
        </Card>
      )}

      {/* History */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-slate-200">Feedback history</h2>
        {feedback.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.06] bg-surface-1/30 p-8 text-center">
            <p className="text-sm text-slate-500">
              No feedback yet. Run a task with a low-scoring output (or score one on the Quality
              page) — feedback is generated automatically for outputs below 70.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {feedback.map((fb) => (
              <Card key={fb.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="max-w-md truncate text-sm text-slate-300" title={fb.prompt}>
                    {fb.prompt}
                  </p>
                  <Badge tone={GRADE_TONE[fb.grade] ?? 'neutral'}>
                    {fb.grade} · {fb.overall}
                  </Badge>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {fb.weakDimensions.map((d) => (
                    <div
                      key={d.name}
                      className="rounded-lg border border-white/[0.04] bg-surface-2/40 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium capitalize text-slate-300">
                          {d.name}
                        </span>
                        <span className="text-xs font-bold text-rose-400">{d.score}</span>
                      </div>
                      {d.suggestions[0] && (
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                          {d.suggestions[0]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 space-y-1">
                  {fb.priorityAdvice.map((a, i) => (
                    <p key={i} className="text-[11px] leading-relaxed text-slate-400">
                      • {a}
                    </p>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] text-slate-600">
                    {new Date(fb.createdAt).toLocaleString()}
                    {fb.taskId ? ` · task ${fb.taskId}` : ''}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => void handleRevision(fb)}>
                    <Wand2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Build revision
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
