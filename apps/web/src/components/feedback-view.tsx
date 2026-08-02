'use client';

import { useState, useEffect } from 'react';
import {
  fetchAgentFeedback,
  fetchAgentFeedbackStats,
  postAgentFeedbackRevision,
  type AgentFeedbackRecord,
  type AgentFeedbackStats,
} from '@/lib/api';

const GRADE_COLORS: Record<string, string> = {
  Excellent: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  Good: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  Fair: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  Poor: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
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
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
          ⚠ {error}
        </p>
      )}

      {/* Stats */}
      {stats && (
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[
            { label: 'Total Feedback', value: stats.total, color: 'text-cyan-400' },
            {
              label: 'Poor / Fair',
              value: (stats.byGrade.Poor ?? 0) + (stats.byGrade.Fair ?? 0),
              color: 'text-amber-400',
            },
            {
              label: 'Good / Excellent',
              value: (stats.byGrade.Good ?? 0) + (stats.byGrade.Excellent ?? 0),
              color: 'text-emerald-400',
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className={`text-sm font-medium ${s.color}`}>{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-slate-100">{s.value}</div>
            </div>
          ))}
        </section>
      )}

      {/* How it works */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="mb-2 text-base font-semibold text-slate-200">How the feedback loop works</h2>
        <p className="text-xs leading-relaxed text-slate-400">
          When a task output scores below 70, the system automatically generates actionable
          feedback: the weakest quality dimensions, concrete improvement suggestions, and a ready
          revision prompt. Run the revision prompt on the next attempt to close the loop — score,
          feedback, improve, re-score.
        </p>
      </section>

      {/* Revision builder */}
      {revisionFor && (
        <section className="rounded-2xl border border-violet-500/30 bg-slate-900/60 p-5">
          <h2 className="mb-1 text-base font-semibold text-slate-200">
            Revision builder — {revisionFor.grade} ({revisionFor.overall})
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            Rewrite the prompt for a follow-up run; feedback from the previous attempt is appended
            automatically.
          </p>
          <textarea
            value={revisionInput}
            onChange={(e) => setRevisionInput(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => void handleBuild()}
              disabled={building || !revisionInput.trim()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {building ? 'Building…' : 'Build revision prompt'}
            </button>
            <button
              onClick={() => void handleCopy()}
              disabled={!revisionPrompt}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy
            </button>
            <button
              onClick={() => setRevisionFor(null)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800"
            >
              Close
            </button>
          </div>
          {revisionPrompt && (
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
              {revisionPrompt}
            </pre>
          )}
        </section>
      )}

      {/* History */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-200">Feedback history</h2>
        {feedback.length === 0 ? (
          <p className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-500">
            No feedback yet. Run a task with a low-scoring output (or score one on the Quality page)
            — feedback is generated automatically for outputs below 70.
          </p>
        ) : (
          <div className="space-y-2">
            {feedback.map((fb) => (
              <div key={fb.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="max-w-md truncate text-sm text-slate-300" title={fb.prompt}>
                    {fb.prompt}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        GRADE_COLORS[fb.grade] ??
                        'bg-slate-500/15 text-slate-300 border-slate-500/40'
                      }`}
                    >
                      {fb.grade} · {fb.overall}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {fb.weakDimensions.map((d) => (
                    <div
                      key={d.name}
                      className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium capitalize text-slate-300">
                          {d.name}
                        </span>
                        <span className="text-xs font-semibold text-rose-400">{d.score}</span>
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
                  <button
                    onClick={() => void handleRevision(fb)}
                    className="rounded-lg border border-violet-500/40 px-3 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-500/10"
                  >
                    Build revision →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
