import {
  PrismaWaitlistRepository,
  PrismaFeedbackRepository,
  dbReady,
  getPrisma,
} from '@agent-xai/persistence';
import type {
  WaitlistEntryRecord,
  WaitlistStats,
  FeedbackEntryRecord,
} from '@agent-xai/persistence';

export interface WaitlistEntry extends WaitlistEntryRecord {
  status: 'pending' | 'invited' | 'active';
}

export interface FeedbackEntry extends FeedbackEntryRecord {}

export const waitlistStore = new Map<string, WaitlistEntry>();
export const feedbackStore = new Map<string, FeedbackEntry>();

const WAITLIST_CAP = 2000;
const FEEDBACK_CAP = 2000;

function capStore<K, V>(store: Map<K, V>, cap: number): void {
  if (store.size > cap) {
    const oldest = [...store.keys()].shift();
    if (oldest) store.delete(oldest);
  }
}

export interface BetaBackend {
  waitlistCreate(entry: WaitlistEntry): Promise<WaitlistEntry>;
  waitlistFindByEmail(email: string): Promise<WaitlistEntry | undefined>;
  waitlistFindAll(limit: number): Promise<WaitlistEntry[]>;
  waitlistUpdateStatus(id: string, status: string): Promise<WaitlistEntry | undefined>;
  waitlistStats(): Promise<WaitlistStats>;
  feedbackCreate(entry: FeedbackEntry): Promise<FeedbackEntry>;
  feedbackFindAll(limit: number): Promise<FeedbackEntry[]>;
  feedbackCount(): Promise<number>;
}

const memoryBackend: BetaBackend = {
  async waitlistCreate(entry) {
    waitlistStore.set(entry.id, entry);
    capStore(waitlistStore, WAITLIST_CAP);
    return entry;
  },
  async waitlistFindByEmail(email) {
    return [...waitlistStore.values()].find((e) => e.email === email);
  },
  async waitlistFindAll(limit) {
    return [...waitlistStore.values()]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
  },
  async waitlistUpdateStatus(id, status) {
    const entry = waitlistStore.get(id);
    if (!entry) return undefined;
    entry.status = status as WaitlistEntry['status'];
    return entry;
  },
  async waitlistStats() {
    const entries = [...waitlistStore.values()];
    const byStatus: Record<string, number> = {};
    for (const e of entries) byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
    const bySource: Record<string, number> = {};
    for (const e of entries) {
      const s = e.source ?? 'direct';
      bySource[s] = (bySource[s] ?? 0) + 1;
    }
    return { total: entries.length, byStatus, bySource };
  },
  async feedbackCreate(entry) {
    feedbackStore.set(entry.id, entry);
    capStore(feedbackStore, FEEDBACK_CAP);
    return entry;
  },
  async feedbackFindAll(limit) {
    return [...feedbackStore.values()]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
  },
  async feedbackCount() {
    return feedbackStore.size;
  },
};

function prismaBackend(prisma: NonNullable<ReturnType<typeof getPrisma>>): BetaBackend {
  const waitlistRepo = new PrismaWaitlistRepository(prisma);
  const feedbackRepo = new PrismaFeedbackRepository(prisma);
  return {
    async waitlistCreate(entry) {
      return (await waitlistRepo.create(entry)) as WaitlistEntry;
    },
    async waitlistFindByEmail(email) {
      return (await waitlistRepo.findByEmail(email)) as WaitlistEntry | undefined;
    },
    async waitlistFindAll(limit) {
      return (await waitlistRepo.findAll(limit)) as WaitlistEntry[];
    },
    async waitlistUpdateStatus(id, status) {
      return (await waitlistRepo.updateStatus(id, status)) as WaitlistEntry | undefined;
    },
    async waitlistStats() {
      return waitlistRepo.stats();
    },
    async feedbackCreate(entry) {
      return feedbackRepo.create(entry);
    },
    async feedbackFindAll(limit) {
      return feedbackRepo.findAll(limit);
    },
    async feedbackCount() {
      return feedbackRepo.count();
    },
  };
}

let backendPromise: Promise<BetaBackend> | null = null;

/**
 * Resolve the beta storage backend once: Prisma when the DB is reachable,
 * otherwise the in-memory Maps (graceful degradation, tests stay DB-less).
 */
export function getBetaBackend(): Promise<BetaBackend> {
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
export function resetBetaStores(): void {
  waitlistStore.clear();
  feedbackStore.clear();
  backendPromise = null;
}
