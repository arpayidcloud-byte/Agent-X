import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getBetaBackend, resetBetaStores } from '../beta-store.js';
import { dbReady, disconnectDb } from '@agent-xai/persistence';

// Module top-level: decide once whether the DB is reachable for this run.
const dbAvailable = process.env.DATABASE_URL ? await dbReady().catch(() => false) : false;

/**
 * DB-backed persistence tests. These run ONLY when DATABASE_URL is set and
 * reachable (local dev / CI with a postgres service); otherwise they skip.
 * The CI quality-gates run DB-less (in-memory backend) — covered by beta-api.test.ts.
 */
describe('Beta persistence (Prisma/PostgreSQL)', () => {
  beforeAll(async () => {
    resetBetaStores();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  it.runIf(dbAvailable)('persists a waitlist entry and reads it back', async () => {
    const backend = await getBetaBackend();
    const email = `persist-${Date.now()}@example.com`;
    const entry = {
      id: `wl-test-${Date.now()}`,
      email,
      name: 'Persistence Test',
      source: 'test',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    await backend.waitlistCreate(entry);

    const found = await backend.waitlistFindByEmail(email);
    expect(found).toBeDefined();
    expect(found!.id).toBe(entry.id);
    expect(found!.status).toBe('pending');

    const updated = await backend.waitlistUpdateStatus(entry.id, 'invited');
    expect(updated?.status).toBe('invited');
  });

  it.runIf(dbAvailable)('persists feedback and counts it', async () => {
    const backend = await getBetaBackend();
    const before = await backend.feedbackCount();
    await backend.feedbackCreate({
      id: `fb-test-${Date.now()}`,
      email: 'persist@example.com',
      category: 'feature',
      message: 'persistence test feedback',
      rating: 5,
      createdAt: new Date().toISOString(),
    });
    const after = await backend.feedbackCount();
    expect(after).toBe(before + 1);
  });
});
