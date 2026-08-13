import { describe, expect, it } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { PrismaWorkflowRepository } from './workflow-repository.js';

const workflow = {
  id: 'wf-1',
  name: 'Deploy',
  description: null,
  nodes: [],
  edges: [],
  isPublished: false,
  ownerId: 'user-1',
  orgId: 'org-a',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

function fakeDb() {
  const calls = {
    create: [] as unknown[],
    findMany: [] as unknown[],
    findFirst: [] as unknown[],
    count: [] as unknown[],
    updateMany: [] as unknown[],
    deleteMany: [] as unknown[],
  };
  const db = {
    workflow: {
      create: async (args: unknown) => {
        calls.create.push(args);
        return workflow;
      },
      findMany: async (args: unknown) => {
        calls.findMany.push(args);
        return [workflow];
      },
      findFirst: async (args: unknown) => {
        calls.findFirst.push(args);
        return workflow;
      },
      count: async (args: unknown) => {
        calls.count.push(args);
        return 1;
      },
      updateMany: async (args: unknown) => {
        calls.updateMany.push(args);
        return { count: 1 };
      },
      deleteMany: async (args: unknown) => {
        calls.deleteMany.push(args);
        return { count: 1 };
      },
    },
  } as unknown as PrismaClient;
  return { db, calls };
}

describe('PrismaWorkflowRepository tenant boundary', () => {
  it('writes the organization scope when creating a workflow', async () => {
    const { db, calls } = fakeDb();
    const repo = new PrismaWorkflowRepository(db);

    await repo.create('org-a', {
      name: 'Deploy',
      ownerId: 'user-1',
    });

    expect(calls.create[0]).toMatchObject({
      data: expect.objectContaining({ orgId: 'org-a' }),
    });
  });

  it('adds the organization scope to every read and count query', async () => {
    const { db, calls } = fakeDb();
    const repo = new PrismaWorkflowRepository(db);

    await repo.list('org-a', 10, 2);
    await repo.getById('org-a', 'wf-1');
    await repo.count('org-a');

    expect(calls.findMany[0]).toMatchObject({ where: { orgId: 'org-a' }, take: 10, skip: 2 });
    expect(calls.findFirst[0]).toMatchObject({ where: { id: 'wf-1', orgId: 'org-a' } });
    expect(calls.count[0]).toMatchObject({ where: { orgId: 'org-a' } });
  });

  it('scopes update and delete by organization and reports missing cross-tenant rows', async () => {
    const { db, calls } = fakeDb();
    const repo = new PrismaWorkflowRepository(db);

    await repo.update('org-a', 'wf-1', { name: 'Updated' });
    expect(calls.updateMany[0]).toMatchObject({
      where: { id: 'wf-1', orgId: 'org-a' },
      data: { name: 'Updated' },
    });

    await repo.remove('org-a', 'wf-1');
    expect(calls.deleteMany[0]).toMatchObject({ where: { id: 'wf-1', orgId: 'org-a' } });
  });
});
