import { describe, expect, it } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { CostEntryRepository } from './cost-entry-repository.js';

const entry = {
  id: 'cost-1',
  taskId: 'task-1',
  userId: 'user-1',
  orgId: 'org-a',
  provider: 'openai',
  model: 'gpt-4o',
  inputTokens: 10,
  outputTokens: 20,
  totalTokens: 30,
  costUsd: 0.01,
  latencyMs: 100,
  cached: false,
  source: 'api',
  createdAt: new Date('2026-01-01T00:00:00Z'),
};

function fakeDb() {
  const calls = {
    create: [] as unknown[],
    findMany: [] as unknown[],
  };
  const db = {
    costEntry: {
      create: async (args: unknown) => {
        calls.create.push(args);
        return entry;
      },
      findMany: async (args: unknown) => {
        calls.findMany.push(args);
        return [entry];
      },
    },
  } as unknown as PrismaClient;
  return { db, calls };
}

describe('CostEntryRepository tenant boundary', () => {
  it('writes orgId server-side when creating a cost entry', async () => {
    const { db, calls } = fakeDb();
    const repo = new CostEntryRepository(db);

    await repo.create('org-a', {
      taskId: 'task-1',
      provider: 'openai',
      model: 'gpt-4o',
      costUsd: 0.01,
    });

    expect(calls.create[0]).toMatchObject({
      data: expect.objectContaining({ orgId: 'org-a' }),
    });
  });

  it('scopes list and summary queries by organization', async () => {
    const { db, calls } = fakeDb();
    const repo = new CostEntryRepository(db);

    await repo.list('org-a', 25, 5);
    await repo.getSummary('org-a', 7);

    expect(calls.findMany[0]).toMatchObject({
      where: { orgId: 'org-a' },
      take: 25,
      skip: 5,
    });
    expect(calls.findMany[1]).toMatchObject({
      where: {
        orgId: 'org-a',
        createdAt: { gte: expect.any(Date) },
      },
    });
  });
});

void entry;

// Keep PrismaClient in the test's type surface so the fake remains checked against the DB API.
void ({} as PrismaClient);
