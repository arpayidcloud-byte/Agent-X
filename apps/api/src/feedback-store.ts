// Agent feedback storage (Web Pro) — mirrors the quality-store pattern:
// Prisma backend when the DB is reachable, in-memory Maps otherwise.

import { PrismaAgentFeedbackRepository, dbReady, getPrisma } from '@agent-xai/persistence';
import type { AgentFeedbackRecord } from '@agent-xai/persistence';

export type StoredAgentFeedback = AgentFeedbackRecord;

export const agentFeedbackStore = new Map<string, StoredAgentFeedback>();

const FEEDBACK_CAP = 500;

function capStore(): void {
  if (agentFeedbackStore.size <= FEEDBACK_CAP) return;
  const oldest = [...agentFeedbackStore.keys()].shift();
  if (oldest) agentFeedbackStore.delete(oldest);
}

export interface FeedbackBackend {
  create(record: AgentFeedbackRecord): Promise<AgentFeedbackRecord>;
  findAll(limit: number): Promise<AgentFeedbackRecord[]>;
  findByScoreId(scoreId: string): Promise<AgentFeedbackRecord | null>;
  stats(): Promise<{ total: number; byGrade: Record<string, number> }>;
}

const memoryBackend: FeedbackBackend = {
  async create(record) {
    agentFeedbackStore.set(record.id, record);
    capStore();
    return record;
  },
  async findAll(limit) {
    return [...agentFeedbackStore.values()]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
  },
  async findByScoreId(scoreId) {
    for (const entry of agentFeedbackStore.values()) {
      if (entry.scoreId === scoreId) return entry;
    }
    return null;
  },
  async stats() {
    const entries = [...agentFeedbackStore.values()];
    const byGrade: Record<string, number> = {};
    for (const e of entries) byGrade[e.grade] = (byGrade[e.grade] ?? 0) + 1;
    return { total: entries.length, byGrade };
  },
};

function prismaBackend(prisma: NonNullable<ReturnType<typeof getPrisma>>): FeedbackBackend {
  const repo = new PrismaAgentFeedbackRepository(prisma);
  return {
    async create(record) {
      return repo.create(record);
    },
    async findAll(limit) {
      return repo.findMany(limit);
    },
    async findByScoreId(scoreId) {
      return repo.findByScoreId(scoreId);
    },
    async stats() {
      return repo.stats();
    },
  };
}

let backendPromise: Promise<FeedbackBackend> | null = null;

/** Resolve the feedback backend once: Prisma when reachable, else in-memory. */
export function getFeedbackBackend(): Promise<FeedbackBackend> {
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
export function resetAgentFeedbackStore(): void {
  agentFeedbackStore.clear();
  backendPromise = null;
}
