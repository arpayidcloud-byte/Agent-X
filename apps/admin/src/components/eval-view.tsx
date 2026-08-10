'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  Trophy,
  GitCompareArrows,
  RefreshCw,
  Loader2,
  CheckCircle2,
  MinusCircle,
} from 'lucide-react';
import { API_URL } from '@/lib/api';

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('agentx_admin_token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

interface LeaderboardEntry {
  provider: string;
  model: string;
  avgOverall: number;
  bestOverall: number;
  worstOverall: number;
  count: number;
}

interface ExperimentRow {
  id: string;
  name: string;
  prompt: string;
  providerA: string;
  modelA: string;
  providerB: string;
  modelB: string;
  scoreA: number;
  scoreB: number;
  winner: string;
  gradeA: string;
  gradeB: string;
  createdAt: string;
}

interface WinRateRow {
  provider: string;
  model: string;
  wins: number;
  losses: number;
  ties: number;
}

interface GateStatus {
  threshold: number;
  configurableVia: string;
  totalScores: number;
  belowThreshold: number;
  aboveThreshold: number;
  avgOverall: number;
  autoFeedbackGenerated: number;
  passingRate: number;
}

function gradeBadge(grade: string): string {
  const g = grade.toLowerCase();
  if (g === 'excellent' || g === 'good') return 'bg-emerald-500/15 text-emerald-400';
  if (g === 'fair') return 'bg-amber-500/15 text-amber-400';
  return 'bg-rose-500/15 text-rose-400';
}

function winnerIcon(winner: string) {
  if (winner === 'A') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  if (winner === 'B') return <CheckCircle2 className="h-4 w-4 text-sky-400" />;
  return <MinusCircle className="h-4 w-4 text-slate-400" />;
}

export default function EvalView() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [experiments, setExperiments] = useState<ExperimentRow[]>([]);
  const [winRates, setWinRates] = useState<WinRateRow[]>([]);
  const [gate, setGate] = useState<GateStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(() => true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const [lb, ex, wr, gt] = await Promise.all([
          apiFetch('/v1/eval/leaderboard'),
          apiFetch('/v1/eval/experiments'),
          apiFetch('/v1/eval/winrates'),
          apiFetch('/v1/eval/gates'),
        ]);
        setLeaderboard((lb as { leaderboard: LeaderboardEntry[] }).leaderboard ?? []);
        setExperiments((ex as { experiments: ExperimentRow[] }).experiments ?? []);
        setWinRates((wr as { winRates: WinRateRow[] }).winRates ?? []);
        setGate((gt as { gate: GateStatus }).gate ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [lb, ex, wr, gt] = await Promise.all([
          apiFetch('/v1/eval/leaderboard'),
          apiFetch('/v1/eval/experiments'),
          apiFetch('/v1/eval/winrates'),
          apiFetch('/v1/eval/gates'),
        ]);
        if (!cancelled) {
          setLeaderboard((lb as { leaderboard: LeaderboardEntry[] }).leaderboard ?? []);
          setExperiments((ex as { experiments: ExperimentRow[] }).experiments ?? []);
          setWinRates((wr as { winRates: WinRateRow[] }).winRates ?? []);
          setGate((gt as { gate: GateStatus }).gate ?? null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const top = leaderboard[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Evaluation</h1>
          <p className="mt-1 text-sm text-slate-400">
            Benchmark &amp; A/B model comparison — Phase 8
          </p>
        </div>
        <button
          onClick={() => void load()}
          className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-200 transition hover:bg-surface-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading && !error ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat data evaluasi…
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass-card rounded-xl border border-white/[0.06] bg-surface-2/60 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Trophy className="h-4 w-4 text-accent-400" />
                Best Model
              </div>
              {top ? (
                <div className="mt-2">
                  <div className="text-lg font-semibold text-slate-100">
                    {top.provider} / {top.model}
                  </div>
                  <div className="mt-1 text-sm text-accent-400">
                    avg {top.avgOverall} · {top.count} sample{top.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-500">Belum ada data</div>
              )}
            </div>
            <div className="glass-card rounded-xl border border-white/[0.06] bg-surface-2/60 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <GitCompareArrows className="h-4 w-4 text-accent-400" />
                A/B Experiments
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-100">{experiments.length}</div>
              <div className="mt-1 text-xs text-slate-500">perbandingan tersimpan</div>
            </div>
            <div className="glass-card rounded-xl border border-white/[0.06] bg-surface-2/60 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <BarChart3 className="h-4 w-4 text-accent-400" />
                Model Dinilai
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-100">{winRates.length}</div>
              <div className="mt-1 text-xs text-slate-500">provider/model unik</div>
            </div>
          </div>

          {/* Quality gate */}
          {gate && (
            <div className="glass-card rounded-xl border border-white/[0.06] bg-surface-2/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-medium text-slate-300">Quality Gate</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Threshold {gate.threshold} ({gate.configurableVia}) — auto-feedback untuk skor
                    di bawah ambang
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-semibold ${
                        gate.passingRate >= 70 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {gate.passingRate}%
                    </div>
                    <div className="text-xs text-slate-500">passing rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-slate-100">{gate.avgOverall}</div>
                    <div className="text-xs text-slate-500">avg score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-slate-100">
                      {gate.belowThreshold}
                    </div>
                    <div className="text-xs text-slate-500">below threshold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-slate-100">
                      {gate.autoFeedbackGenerated}
                    </div>
                    <div className="text-xs text-slate-500">auto-feedback</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="glass-card rounded-xl border border-white/[0.06] bg-surface-2/60 p-5">
            <h2 className="mb-4 text-sm font-medium text-slate-300">Leaderboard Provider/Model</h2>
            {leaderboard.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Jalankan benchmark lewat{' '}
                <code className="text-accent-400">POST /v1/eval/benchmark</code> untuk mengisi
                leaderboard.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-2 pr-4">Rank</th>
                      <th className="pb-2 pr-4">Provider / Model</th>
                      <th className="pb-2 pr-4">Avg Score</th>
                      <th className="pb-2 pr-4">Best</th>
                      <th className="pb-2 pr-4">Worst</th>
                      <th className="pb-2">Samples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((e, i) => (
                      <tr
                        key={`${e.provider}-${e.model}`}
                        className="border-b border-white/[0.03] last:border-0"
                      >
                        <td className="py-2.5 pr-4 text-slate-400">
                          {i === 0 ? <Trophy className="h-4 w-4 text-amber-400" /> : `#${i + 1}`}
                        </td>
                        <td className="py-2.5 pr-4 text-slate-200">
                          {e.provider} <span className="text-slate-500">/</span> {e.model}
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className="rounded-md bg-accent-400/10 px-2 py-0.5 text-xs font-medium text-accent-400">
                            {e.avgOverall}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-emerald-400">{e.bestOverall}</td>
                        <td className="py-2.5 pr-4 text-rose-400">{e.worstOverall}</td>
                        <td className="py-2.5 text-slate-400">{e.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Win rates */}
          <div className="glass-card rounded-xl border border-white/[0.06] bg-surface-2/60 p-5">
            <h2 className="mb-4 text-sm font-medium text-slate-300">Win Rates (A/B)</h2>
            {winRates.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Belum ada A/B experiment. Gunakan{' '}
                <code className="text-accent-400">POST /v1/eval/experiment</code>.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {winRates.map((w) => {
                  const total = w.wins + w.losses + w.ties;
                  const pct = total > 0 ? Math.round((w.wins / total) * 100) : 0;
                  return (
                    <div
                      key={`${w.provider}-${w.model}`}
                      className="rounded-lg border border-white/[0.06] bg-surface-2/40 p-3"
                    >
                      <div className="text-sm text-slate-200">
                        {w.provider} <span className="text-slate-500">/</span> {w.model}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-accent-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-accent-400">{pct}%</span>
                      </div>
                      <div className="mt-1.5 text-xs text-slate-500">
                        {w.wins}W · {w.losses}L · {w.ties}T
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Experiments */}
          <div className="glass-card rounded-xl border border-white/[0.06] bg-surface-2/60 p-5">
            <h2 className="mb-4 text-sm font-medium text-slate-300">Riwayat A/B Experiments</h2>
            {experiments.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">Belum ada experiment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-2 pr-4">Name</th>
                      <th className="pb-2 pr-4">A</th>
                      <th className="pb-2 pr-4">Score</th>
                      <th className="pb-2 pr-4">B</th>
                      <th className="pb-2 pr-4">Score</th>
                      <th className="pb-2 pr-4">Winner</th>
                      <th className="pb-2">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiments.map((x) => (
                      <tr key={x.id} className="border-b border-white/[0.03] last:border-0">
                        <td
                          className="max-w-[180px] truncate py-2.5 pr-4 text-slate-300"
                          title={x.name}
                        >
                          {x.name}
                        </td>
                        <td className="py-2.5 pr-4 text-slate-200">
                          {x.providerA}/{x.modelA}
                          <span
                            className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-medium ${gradeBadge(x.gradeA)}`}
                          >
                            {x.gradeA}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-slate-300">{x.scoreA}</td>
                        <td className="py-2.5 pr-4 text-slate-200">
                          {x.providerB}/{x.modelB}
                          <span
                            className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-medium ${gradeBadge(x.gradeB)}`}
                          >
                            {x.gradeB}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-slate-300">{x.scoreB}</td>
                        <td className="py-2.5 pr-4">
                          <span className="flex items-center gap-1.5">
                            {winnerIcon(x.winner)}
                            <span className="text-xs text-slate-400">
                              {x.winner === 'A' ? 'A' : x.winner === 'B' ? 'B' : 'Seri'}
                            </span>
                          </span>
                        </td>
                        <td className="py-2.5 text-xs text-slate-500">
                          {new Date(x.createdAt).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
