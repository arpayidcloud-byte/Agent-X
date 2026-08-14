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

function fakeDb(options: { taskOrgId?: string | null; userOrgId?: string | null } = {}) {
  const calls = {
    create: [] as unknown[],
    findMany: [] as unknown[],
    taskFindUnique: [] as unknown[],
    userFindUnique: [] as unknown[],
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
    task: {
      findUnique: async (args: unknown) => {
        calls.taskFindUnique.push(args);
        return options.taskOrgId !== undefined ? { id: 'task-1', orgId: options.taskOrgId } : null;
      },
    },
    user: {
      findUnique: async (args: unknown) => {
        calls.userFindUnique.push(args);
        return options.userOrgId !== undefined ? { id: 'user-1', orgId: options.userOrgId } : null;
      },
    },
  } as unknown as PrismaClient;
  return { db, calls };
}

describe('CostEntryRepository tenant boundary', () => {
  it('writes orgId server-side when creating a cost entry', async () => {
    const { db, calls } = fakeDb({ taskOrgId: 'org-a' });
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

  it('rejects empty organization identifiers before touching the database', async () => {
    const { db, calls } = fakeDb();
    const repo = new CostEntryRepository(db);

    await expect(
      repo.create('', {
        provider: 'openai',
        model: 'gpt-4o',
        costUsd: 0.01,
      }),
    ).rejects.toThrow('Organization context required');
    expect(calls.create).toHaveLength(0);
  });

  it('rejects a task owned by another organization before creating the cost entry', async () => {
    const { db, calls } = fakeDb({ taskOrgId: 'org-b' });
    const repo = new CostEntryRepository(db);

    await expect(
      repo.create('org-a', {
        taskId: 'task-1',
        provider: 'openai',
        model: 'gpt-4o',
        costUsd: 0.01,
      }),
    ).rejects.toThrow('Task organization mismatch');
    expect(calls.create).toHaveLength(0);
    expect(calls.taskFindUnique[0]).toMatchObject({
      where: { id: 'task-1' },
      select: { orgId: true },
    });
  });

  it('rejects a user owned by another organization before creating the cost entry', async () => {
    const { db, calls } = fakeDb({ userOrgId: 'org-b' });
    const repo = new CostEntryRepository(db);

    await expect(
      repo.create('org-a', {
        userId: 'user-1',
        provider: 'openai',
        model: 'gpt-4o',
        costUsd: 0.01,
      }),
    ).rejects.toThrow('User organization mismatch');
    expect(calls.create).toHaveLength(0);
    expect(calls.userFindUnique[0]).toMatchObject({
      where: { id: 'user-1' },
      select: { orgId: true },
    });
  });

  it('rejects missing task ownership evidence instead of creating an orphaned cost entry', async () => {
    const { db, calls } = fakeDb();
    const repo = new CostEntryRepository(db);

    await expect(
      repo.create('org-a', {
        taskId: 'task-1',
        provider: 'openai',
        model: 'gpt-4o',
        costUsd: 0.01,
      }),
    ).rejects.toThrow('Task ownership could not be verified');
    expect(calls.create).toHaveLength(0);
  });

  it('rejects a task with null organization ownership evidence', async () => {
    const { db, calls } = fakeDb({ taskOrgId: null });
    const repo = new CostEntryRepository(db);

    await expect(
      repo.create('org-a', {
        taskId: 'task-1',
        provider: 'openai',
        model: 'gpt-4o',
        costUsd: 0.01,
      }),
    ).rejects.toThrow('Task ownership could not be verified');
    expect(calls.create).toHaveLength(0);
  });

  it('rejects a task with empty organization ownership evidence', async () => {
    const { db, calls } = fakeDb({ taskOrgId: '   ' });
    const repo = new CostEntryRepository(db);

    await expect(
      repo.create('org-a', {
        taskId: 'task-1',
        provider: 'openai',
        model: 'gpt-4o',
        costUsd: 0.01,
      }),
    ).rejects.toThrow('Task ownership could not be verified');
    expect(calls.create).toHaveLength(0);
  });

  it('rejects a user with null organization ownership evidence', async () => {
    const { db, calls } = fakeDb({ userOrgId: null });
    const repo = new CostEntryRepository(db);

    await expect(
      repo.create('org-a', {
        userId: 'user-1',
        provider: 'openai',
        model: 'gpt-4o',
        costUsd: 0.01,
      }),
    ).rejects.toThrow('User ownership could not be verified');
    expect(calls.create).toHaveLength(0);
  });

  it('rejects a user with empty organization ownership evidence', async () => {
    const { db, calls } = fakeDb({ userOrgId: '   ' });
    const repo = new CostEntryRepository(db);

    await expect(
      repo.create('org-a', {
        userId: 'user-1',
        provider: 'openai',
        model: 'gpt-4o',
        costUsd: 0.01,
      }),
    ).rejects.toThrow('User ownership could not be verified');
    expect(calls.create).toHaveLength(0);
  });

  it('verifies both optional parents before creating the cost entry', async () => {
    const { db, calls } = fakeDb({ taskOrgId: 'org-a', userOrgId: 'org-a' });
    const repo = new CostEntryRepository(db);

    await repo.create('org-a', {
      taskId: 'task-1',
      userId: 'user-1',
      provider: 'openai',
      model: 'gpt-4o',
      costUsd: 0.01,
    });

    expect(calls.taskFindUnique[0]).toMatchObject({
      where: { id: 'task-1' },
      select: { orgId: true },
    });
    expect(calls.userFindUnique[0]).toMatchObject({
      where: { id: 'user-1' },
      select: { orgId: true },
    });
    expect(calls.create).toHaveLength(1);
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

  it('rejects blank organization identifiers for reads before touching the database', async () => {
    const { db, calls } = fakeDb();
    const repo = new CostEntryRepository(db);

    await expect(repo.list('   ')).rejects.toThrow('Organization context required');
    await expect(repo.getSummary('')).rejects.toThrow('Organization context required');
    expect(calls.findMany).toHaveLength(0);
  });
});

void entry;

// Keep PrismaClient in the test's type surface so the fake remains checked against the DB API.
void ({} as PrismaClient);
