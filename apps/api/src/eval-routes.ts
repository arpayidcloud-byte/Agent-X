import type { Express, Request, Response } from 'express';
import type { QualityBackend } from './quality-store.js';
import { getQualityBackend } from './quality-store.js';
import { maybeRequireAdmin, requireAuth, type AuthenticatedRequest } from './auth.js';
import { withOrg } from './middleware/withOrg.js';

/**
 * Evaluation benchmark suite — Phase 8 (#114).
 *
 * POST /v1/eval/benchmark
 *   body: {
 *     name: string,
 *     cases: [{ prompt, expected? }],
 *     providers: [{ name, model }]  // atau kosong = pakai provider aktif
 *   }
 *   → jalankan setiap case terhadap setiap provider/model, skor otomatis,
 *     simpan QualityScore per pasangan, kembalikan ringkasan perbandingan.
 *
 * GET /v1/eval/benchmarks
 *   → daftar benchmark runs (dari QualityScore yang punya benchmarkName)
 *
 * GET /v1/eval/leaderboard?limit=20
 *   → peringkat provider/model berdasarkan rata-rata skor
 */

interface BenchmarkCase {
  prompt: string;
  expected?: string;
}

interface BenchmarkProvider {
  name: string;
  model: string;
}

interface BenchmarkResult {
  provider: string;
  model: string;
  overall: number;
  grade: string;
  dimensions: Record<string, number>;
}

interface BenchmarkSummary {
  provider: string;
  model: string;
  avgOverall: number;
  bestOverall: number;
  worstOverall: number;
  count: number;
}

export function registerEvalRoutes(app: Express): void {
  const experimentsUnavailable = (_req: Request, res: Response): void => {
    res.status(410).json({
      error: 'Eval experiments are unavailable until tenant scoping is migrated',
      migration:
        'Add EvalExperiment.orgId, backfill existing rows, and use the authenticated organization context before re-enabling this endpoint.',
    });
  };
  // ─── Jalankan benchmark ────
  app.post(
    '/v1/eval/benchmark',
    requireAuth,
    withOrg,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { name, cases, providers } = req.body ?? {};
        if (!Array.isArray(cases) || cases.length === 0) {
          res.status(400).json({ error: 'cases (array of {prompt, expected?}) is required' });
          return;
        }
        if (typeof name !== 'string' || !name.trim()) {
          res.status(400).json({ error: 'name (string) is required' });
          return;
        }

        const providerList: BenchmarkProvider[] = Array.isArray(providers)
          ? providers.filter((p) => p && typeof p.name === 'string' && typeof p.model === 'string')
          : [{ name: 'default', model: 'default' }];

        const { QualityScorer } = await import('@agent-xai/quality-scoring');
        const scorer = new QualityScorer();
        const backend: QualityBackend = await getQualityBackend();
        const orgId = (req as AuthenticatedRequest).auth!.orgId!;

        const results: BenchmarkResult[] = [];
        let totalCases = 0;
        let failedCases = 0;

        for (const provider of providerList) {
          for (const tc of cases as BenchmarkCase[]) {
            try {
              const scored = await scorer.score({
                prompt: tc.prompt,
                response: tc.expected ?? `[benchmark:${name}] no expected output for case`,
                provider: provider.name,
                model: provider.model,
                taskId: `benchmark:${name}`,
              });

              const result = await backend.create({
                id: scored.id,
                prompt: scored.prompt,
                response: scored.response,
                provider: scored.provider,
                model: scored.model,
                orgId,
                taskId: scored.taskId,
                dimensions: { dimensions: scored.dimensions, overall: scored.overall },
                overall: scored.overall,
                grade: scored.grade,
                evaluator: scored.evaluator,
                createdAt: scored.createdAt,
              });

              results.push({
                provider: provider.name,
                model: provider.model,
                overall: result.overall,
                grade: result.grade,
                dimensions:
                  (result.dimensions as { dimensions?: Record<string, number> })?.dimensions ?? {},
              });
              totalCases += 1;
            } catch (e) {
              failedCases += 1;
              const err = e instanceof Error ? e.message : String(e);
              results.push({
                provider: provider.name,
                model: provider.model,
                overall: 0,
                grade: 'error',
                dimensions: { error: 0 },
              });
              void err;
            }
          }
        }

        res.status(201).json({
          benchmark: name,
          totalCases,
          failedCases,
          results,
          summary: summarize(results),
        });
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        res.status(500).json({ error: err });
      }
    },
  );

  // ─── Daftar benchmark runs ────
  app.get(
    '/v1/eval/benchmarks',
    requireAuth,
    withOrg,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const backend: QualityBackend = await getQualityBackend();
        const orgId = (req as AuthenticatedRequest).auth!.orgId!;
        const scores = await backend.findAll(orgId, 200);
        const benchmarkRuns = scores.filter(
          (s) => typeof s.taskId === 'string' && s.taskId.startsWith('benchmark:'),
        );
        const runs = new Map<string, { count: number; avgOverall: number; lastRun: string }>();
        for (const s of benchmarkRuns) {
          const bName = (s.taskId as string).replace('benchmark:', '');
          const cur = runs.get(bName) ?? { count: 0, avgOverall: 0, lastRun: '' };
          cur.count += 1;
          cur.avgOverall += s.overall;
          cur.lastRun = new Date(s.createdAt).toISOString();
          runs.set(bName, cur);
        }
        const list = [...runs.entries()].map(([name, v]) => ({
          name,
          count: v.count,
          avgOverall: Number((v.avgOverall / v.count).toFixed(1)),
          lastRun: v.lastRun,
        }));
        res.json({ benchmarks: list });
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        res.status(500).json({ error: err });
      }
    },
  );

  // ─── Leaderboard provider/model ────
  app.get(
    '/v1/eval/leaderboard',
    requireAuth,
    withOrg,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const backend: QualityBackend = await getQualityBackend();
        const orgId = (req as AuthenticatedRequest).auth!.orgId!;
        const limit = Math.min(Number(req.query.limit) || 20, 100);
        const scores = await backend.findAll(orgId, 200);
        const byProvider = new Map<string, { sum: number; count: number; grades: string[] }>();
        for (const s of scores) {
          const key = `${s.provider ?? 'unknown'} / ${s.model ?? 'unknown'}`;
          const cur = byProvider.get(key) ?? { sum: 0, count: 0, grades: [] };
          cur.sum += s.overall;
          cur.count += 1;
          cur.grades.push(s.grade);
          byProvider.set(key, cur);
        }
        const leaderboard: BenchmarkSummary[] = [...byProvider.entries()]
          .map(([key, v]) => {
            const parts = key.split(' / ');
            const provider = parts[0] ?? 'unknown';
            const model = parts[1] ?? 'unknown';
            const values = scores
              .filter((s) => `${s.provider ?? 'unknown'} / ${s.model ?? 'unknown'}` === key)
              .map((s) => s.overall);
            return {
              provider,
              model,
              avgOverall: Number((v.sum / v.count).toFixed(1)),
              bestOverall: Math.max(...values),
              worstOverall: Math.min(...values),
              count: v.count,
            };
          })
          .sort((a, b) => b.avgOverall - a.avgOverall)
          .slice(0, limit);
        res.json({ leaderboard });
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        res.status(500).json({ error: err });
      }
    },
  );

  // ─── A/B experiment: bandingkan 2 provider/model pada 1 prompt ────
  app.post('/v1/eval/experiment', maybeRequireAdmin, experimentsUnavailable);

  // EvalExperiment has no orgId in the current schema. Keep these endpoints
  // fail-closed until the schema and all existing rows can be migrated.
  app.get('/v1/eval/experiments', requireAuth, experimentsUnavailable);

  // Win rates aggregate the same tenantless table and must be disabled too.
  app.get('/v1/eval/winrates', requireAuth, experimentsUnavailable);

  // ─── Quality gates status (#117) ────
  app.get(
    '/v1/eval/gates',
    requireAuth,
    withOrg,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const threshold = Number(process.env.QUALITY_GATE_THRESHOLD ?? 70);
        const orgId = (req as AuthenticatedRequest).auth!.orgId!;
        const backend: QualityBackend = await getQualityBackend();
        const scores = await backend.findAll(orgId, 200);
        const below = scores.filter((s) => s.overall < threshold);
        const above = scores.filter((s) => s.overall >= threshold);
        const avgOverall =
          scores.length > 0
            ? Number((scores.reduce((acc, s) => acc + s.overall, 0) / scores.length).toFixed(1))
            : 0;
        const { getFeedbackBackend } = await import('./feedback-store.js');
        const feedback = await (await getFeedbackBackend()).findMany(orgId, 200);
        res.json({
          gate: {
            threshold,
            configurableVia: 'QUALITY_GATE_THRESHOLD',
            totalScores: scores.length,
            belowThreshold: below.length,
            aboveThreshold: above.length,
            avgOverall,
            autoFeedbackGenerated: feedback.length,
            passingRate:
              scores.length > 0 ? Number(((above.length / scores.length) * 100).toFixed(1)) : 0,
          },
        });
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        res.status(500).json({ error: err });
      }
    },
  );
}

function summarize(results: BenchmarkResult[]): BenchmarkSummary[] {
  const byProvider = new Map<string, { sum: number; count: number; best: number; worst: number }>();
  for (const r of results) {
    const key = `${r.provider} / ${r.model}`;
    const cur = byProvider.get(key) ?? { sum: 0, count: 0, best: -Infinity, worst: Infinity };
    cur.sum += r.overall;
    cur.count += 1;
    cur.best = Math.max(cur.best, r.overall);
    cur.worst = Math.min(cur.worst, r.overall);
    byProvider.set(key, cur);
  }
  return [...byProvider.entries()]
    .map(([key, v]) => {
      const parts = key.split(' / ');
      const provider = parts[0] ?? 'unknown';
      const model = parts[1] ?? 'unknown';
      return {
        provider,
        model,
        avgOverall: Number((v.sum / v.count).toFixed(1)),
        bestOverall: v.best === -Infinity ? 0 : v.best,
        worstOverall: v.worst === Infinity ? 0 : v.worst,
        count: v.count,
      };
    })
    .sort((a, b) => b.avgOverall - a.avgOverall);
}
