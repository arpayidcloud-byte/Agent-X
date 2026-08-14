// Quality scoring storage (Web Pro) — mirrors the beta-store pattern:
// Prisma backend when the DB is reachable, in-memory Maps otherwise
// (graceful degradation, tests stay DB-less).

import { PrismaQualityScoreRepository, dbReady, getPrisma } from '@agent-xai/persistence';
import type { QualityScoreRecord, QualityScoreStats } from '@agent-xai/persistence';

export interface StoredQualityScore extends QualityScoreRecord {}

export const qualityStore = new Map<string, StoredQualityScore>();

const QUALITY_CAP = 500;

function capStore(): void {
  if (qualityStore.size <= QUALITY_CAP) return;
  const oldest = [...qualityStore.keys()].shift();
  if (oldest) qualityStore.delete(oldest);
}

export interface QualityBackend {
  create(record: QualityScoreRecord): Promise<QualityScoreRecord>;
  findAll(orgId: string, limit: number): Promise<QualityScoreRecord[]>;
  stats(orgId: string): Promise<QualityScoreStats>;
}

const memoryBackend: QualityBackend = {
  async create(record) {
    qualityStore.set(record.id, record);
    capStore();
    return record;
  },
  async findAll(orgId, limit) {
    return [...qualityStore.values()]
      .filter((entry) => entry.orgId === orgId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
  },
  async stats(orgId) {
    const entries = [...qualityStore.values()].filter((entry) => entry.orgId === orgId);
    const byGrade: Record<string, number> = {};
    const byProvider: Record<string, number> = {};
    const byEvaluator: Record<string, number> = {};
    let sum = 0;
    for (const e of entries) {
      sum += e.overall;
      byGrade[e.grade] = (byGrade[e.grade] ?? 0) + 1;
      byProvider[e.provider ?? 'unknown'] = (byProvider[e.provider ?? 'unknown'] ?? 0) + 1;
      byEvaluator[e.evaluator] = (byEvaluator[e.evaluator] ?? 0) + 1;
    }
    return {
      total: entries.length,
      avgOverall: entries.length > 0 ? Math.round(sum / entries.length) : 0,
      byGrade,
      byProvider,
      byEvaluator,
    };
  },
};

function prismaBackend(prisma: NonNullable<ReturnType<typeof getPrisma>>): QualityBackend {
  const repo = new PrismaQualityScoreRepository(prisma);
  return {
    async create(record) {
      return repo.create(record);
    },
    async findAll(orgId, limit) {
      return repo.findAll(orgId, limit);
    },
    async stats(orgId) {
      return repo.stats(orgId);
    },
  };
}

let backendPromise: Promise<QualityBackend> | null = null;

/** Resolve the quality backend once: Prisma when reachable, else in-memory. */
export function getQualityBackend(): Promise<QualityBackend> {
  if (backendPromise === null) {
    backendPromise = (async () => {
      if (await dbReady()) {
        const prisma = getPrisma();
        if (prisma) return prismaBackend(prisma);
      }
      return memoryBackend;
    })();
  }
  return backendPromise;
}

/** Test helper: force the in-memory backend and clear state. */
export function resetQualityStore(): void {
  qualityStore.clear();
  backendPromise = null;
}
