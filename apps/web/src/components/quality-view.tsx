'use client';

import { useState, useEffect } from 'react';
import {
  fetchQualityScores,
  fetchQualityStats,
  postQualityScore,
  type QualityScoreRecord,
  type QualityStats,
} from '@/lib/api';

const GRADE_COLORS: Record<string, string> = {
  Excellent: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  Good: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  Fair: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  Poor: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
};

const SAMPLE_PROMPT = 'Explain how an API gateway rate limiter works and list the main algorithms';
const SAMPLE_RESPONSE =
  'An API gateway rate limiter controls how many requests a client can make within a window. ' +
  'The main algorithms are token bucket, leaky bucket, fixed window, and sliding window log. ' +
  'Token bucket is the most common choice because it allows bursts while bounding the average rate.';

export default function QualityView() {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPT);
  const [response, setResponse] = useState(SAMPLE_RESPONSE);
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState<QualityScoreRecord | null>(null);
  const [scores, setScores] = useState<QualityScoreRecord[]>([]);
  const [stats, setStats] = useState<QualityStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetchQualityScores(20), fetchQualityStats()])
      .then(([s, st]) => {
        if (!cancelled) {
          setScores(s.scores);
          setStats(st.stats);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleScore(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || !response.trim() || scoring) return;
    setScoring(true);
    setError(null);
    try {
      const { score: scored } = await postQualityScore({
        prompt: prompt.trim(),
        response: response.trim(),
        provider: provider.trim() || undefined,
        model: model.trim() || undefined,
      });
      setScore(scored);
      const [s, st] = await Promise.all([fetchQualityScores(20), fetchQualityStats()]);
      setScores(s.scores);
      setStats(st.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setScoring(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Score tester */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="mb-1 text-base font-semibold text-slate-200">Score an output</h2>
        <p className="mb-4 text-xs text-slate-500">
          Paste a prompt + response — the deterministic engine scores 6 dimensions (relevance,
          completeness, clarity, correctness, formatting, safety).
        </p>
        <form onSubmit={(e) => void handleScore(e)} className="grid gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Prompt…"
            rows={2}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none"
          />
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Response to score…"
            rows={5}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-3">
            <input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="provider (optional)"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none"
            />
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="model (optional)"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={scoring || !prompt.trim() || !response.trim()}
              className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {scoring ? 'Scoring…' : 'Score'}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
            ⚠ {error}
          </p>
        )}

        {score && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-100">{score.overall}</span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    GRADE_COLORS[score.grade] ??
                    'bg-slate-500/15 text-slate-300 border-slate-500/40'
                  }`}
                >
                  {score.grade}
                </span>
                <span className="text-[11px] text-slate-500">
                  evaluator: {score.evaluator}
                  {score.provider ? ` · ${score.provider}/${score.model ?? ''}` : ''}
                </span>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(score.dimensions.dimensions ?? []).map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
                >
                  <div>
                    <span className="text-xs font-medium capitalize text-slate-300">{d.name}</span>
                    <span className="ml-2 text-[10px] text-slate-600">w={d.weight.toFixed(2)}</span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      d.score >= 80
                        ? 'text-emerald-400'
                        : d.score >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                    }`}
                  >
                    {d.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Stats */}
      {stats && (
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total Scored', value: stats.total, color: 'text-cyan-400' },
            { label: 'Avg Overall', value: stats.avgOverall, color: 'text-blue-400' },
            {
              label: 'Excellent/Good',
              value: (stats.byGrade.Excellent ?? 0) + (stats.byGrade.Good ?? 0),
              color: 'text-emerald-400',
            },
            {
              label: 'Poor',
              value: stats.byGrade.Poor ?? 0,
              color: 'text-rose-400',
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className={`text-sm font-medium ${s.color}`}>{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-slate-100">{s.value}</div>
            </div>
          ))}
        </section>
      )}

      {/* History */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-200">Recent scores</h2>
        {scores.length === 0 ? (
          <p className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-500">
            No scores yet. Score an output above, or run a task — successful task outputs are
            auto-scored.
          </p>
        ) : (
          <div className="space-y-2">
            {scores.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="max-w-md truncate text-sm text-slate-300" title={s.prompt}>
                    {s.prompt}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        GRADE_COLORS[s.grade] ??
                        'bg-slate-500/15 text-slate-300 border-slate-500/40'
                      }`}
                    >
                      {s.grade} · {s.overall}
                    </span>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{s.response}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(s.dimensions.dimensions ?? []).map((d) => (
                    <span
                      key={d.name}
                      className="rounded-full bg-slate-800/60 px-2 py-0.5 text-[10px] text-slate-400"
                    >
                      {d.name}: {d.score}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-slate-600">
                  {s.evaluator}
                  {s.provider ? ` · ${s.provider}/${s.model ?? ''}` : ''} ·{' '}
                  {new Date(s.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
