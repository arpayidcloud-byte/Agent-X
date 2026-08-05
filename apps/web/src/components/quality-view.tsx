'use client';

import { useState, useEffect } from 'react';
import {
  fetchQualityScores,
  fetchQualityStats,
  postQualityScore,
  type QualityScoreRecord,
  type QualityStats,
} from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { StatCard } from '@/components/ui/stat-card';
import { Card } from '@/components/ui/card';
import { SkeletonStat } from '@/components/ui/skeleton';
import { Medal, Target, ThumbsUp, AlertTriangle, Sparkles } from 'lucide-react';

const GRADE_TONE: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  Excellent: 'success',
  Good: 'info',
  Fair: 'warning',
  Poor: 'danger',
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
    <div className="section space-y-6">
      {/* Score tester */}
      <Card className="rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-500/10">
            <Sparkles className="h-4 w-4 text-accent-300" strokeWidth={2} />
          </div>
          <h2 className="text-base font-semibold text-slate-200">Score an output</h2>
        </div>
        <p className="mb-5 ml-11 text-xs text-slate-500">
          Paste a prompt + response — the deterministic engine scores 6 dimensions (relevance,
          completeness, clarity, correctness, formatting, safety).
        </p>
        <form onSubmit={(e) => void handleScore(e)} className="grid gap-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Prompt…"
            rows={2}
            className="resize-none"
          />
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Response to score…"
            rows={5}
            className="resize-none"
          />
          <div className="flex flex-wrap gap-3">
            <Input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="provider (optional)"
              className="flex-1"
            />
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="model (optional)"
              className="flex-1"
            />
            <Button type="submit" loading={scoring} disabled={!prompt.trim() || !response.trim()}>
              {scoring ? 'Scoring…' : 'Score'}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/5 p-3">
            <p className="text-xs text-rose-300">⚠ {error}</p>
          </div>
        )}

        {score && (
          <div className="mt-5 rounded-xl border border-white/[0.04] bg-surface-2/40 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold tracking-tight text-slate-100">
                  {score.overall}
                </span>
                <Badge tone={GRADE_TONE[score.grade] ?? 'neutral'}>{score.grade}</Badge>
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
                  className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-surface-2/60 px-3 py-2.5"
                >
                  <div>
                    <span className="text-xs font-medium capitalize text-slate-300">{d.name}</span>
                    <span className="ml-2 text-[10px] text-slate-600">w={d.weight.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-3">
                      <div
                        className={`h-full rounded-full ${
                          d.score >= 80
                            ? 'bg-emerald-400'
                            : d.score >= 60
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                        }`}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-bold ${
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
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Stats */}
      {stats ? (
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total scored" value={stats.total} icon={Medal} tone="text-accent-300" />
          <StatCard label="Average overall" value={stats.avgOverall} icon={Target} />
          <StatCard
            label="Excellent / Good"
            value={(stats.byGrade.Excellent ?? 0) + (stats.byGrade.Good ?? 0)}
            icon={ThumbsUp}
            tone="text-emerald-300"
          />
          <StatCard
            label="Poor"
            value={stats.byGrade.Poor ?? 0}
            icon={AlertTriangle}
            tone="text-rose-300"
          />
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
      )}

      {/* History */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-slate-200">Recent scores</h2>
        {scores.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.06] bg-surface-1/30 p-8 text-center">
            <p className="text-sm text-slate-500">
              No scores yet. Score an output above, or run a task — successful task outputs are
              auto-scored.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {scores.map((s) => (
              <Card key={s.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="max-w-md truncate text-sm text-slate-300" title={s.prompt}>
                    {s.prompt}
                  </p>
                  <Badge tone={GRADE_TONE[s.grade] ?? 'neutral'}>
                    {s.grade} · {s.overall}
                  </Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{s.response}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(s.dimensions.dimensions ?? []).map((d) => (
                    <span
                      key={d.name}
                      className="rounded-md bg-surface-3/60 px-2 py-0.5 text-[10px] text-slate-400"
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
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
