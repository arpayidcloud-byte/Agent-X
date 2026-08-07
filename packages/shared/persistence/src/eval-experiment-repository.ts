import type { PrismaClient } from '@prisma/client';
import { getPrisma } from './client.js';

export interface EvalExperimentInput {
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
}

export interface EvalExperimentRow extends EvalExperimentInput {
  id: string;
  createdAt: Date;
}

/**
 * Repository for A/B experiments (Phase 8, #115).
 * Persists pairwise model comparisons so win-rates can be computed
 * across experiments.
 */
export class EvalExperimentRepository {
  private prisma: PrismaClient | null;

  constructor() {
    this.prisma = getPrisma();
  }

  private db(): PrismaClient {
    if (!this.prisma) throw new Error('DATABASE_URL not configured');
    return this.prisma;
  }

  async create(input: EvalExperimentInput): Promise<EvalExperimentRow> {
    const row = await this.db().evalExperiment.create({
      data: {
        name: input.name,
        prompt: input.prompt,
        providerA: input.providerA,
        modelA: input.modelA,
        providerB: input.providerB,
        modelB: input.modelB,
        scoreA: input.scoreA,
        scoreB: input.scoreB,
        winner: input.winner,
        gradeA: input.gradeA,
        gradeB: input.gradeB,
      },
    });
    return row as EvalExperimentRow;
  }

  async findAll(limit = 100): Promise<EvalExperimentRow[]> {
    const rows = await this.db().evalExperiment.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows as EvalExperimentRow[];
  }

  /** Win-rate summary: how often each "provider / model" won vs lost. */
  async winRates(): Promise<
    Array<{ provider: string; model: string; wins: number; losses: number; ties: number }>
  > {
    const rows = await this.db().evalExperiment.findMany();
    const tally = new Map<
      string,
      { provider: string; model: string; wins: number; losses: number; ties: number }
    >();
    for (const r of rows) {
      const keyA = `${r.providerA} / ${r.modelA}`;
      const keyB = `${r.providerB} / ${r.modelB}`;
      const ta = tally.get(keyA) ?? {
        provider: r.providerA,
        model: r.modelA,
        wins: 0,
        losses: 0,
        ties: 0,
      };
      const tb = tally.get(keyB) ?? {
        provider: r.providerB,
        model: r.modelB,
        wins: 0,
        losses: 0,
        ties: 0,
      };
      if (r.winner === 'A') {
        ta.wins += 1;
        tb.losses += 1;
      } else if (r.winner === 'B') {
        tb.wins += 1;
        ta.losses += 1;
      } else {
        ta.ties += 1;
        tb.ties += 1;
      }
      tally.set(keyA, ta);
      tally.set(keyB, tb);
    }
    return [...tally.values()];
  }
}
