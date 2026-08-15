import { describe, expect, it } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { PrismaApprovalRepository } from './prisma-approval-repository.js';

const approval = {
  id: 'approval-1',
  taskId: 'task-1',
  status: 'PENDING' as const,
  createdAt: new Date('2026-01-01T00:00:00Z'),
};

function fakeDb(options: { taskOrgId?: string | null } = {}) {
  const calls = {
    taskFindUnique: [] as unknown[],
    approvalUpsert: [] as unknown[],
    approvalFindUnique: [] as unknown[],
    approvalUpdate: [] as unknown[],
  };
  const db = {
    task: {
      findUnique: async (args: unknown) => {
        calls.taskFindUnique.push(args);
        return options.taskOrgId !== undefined ? { id: 'task-1', orgId: options.taskOrgId } : null;
      },
    },
    approval: {
      upsert: async (args: unknown) => {
        calls.approvalUpsert.push(args);
        return {
          ...approval,
          status: (args as { create?: { status?: string } })?.create?.status ?? approval.status,
        };
      },
      findUnique: async (args: unknown) => {
        calls.approvalFindUnique.push(args);
        return {
          ...approval,
          status: 'PENDING',
          id: 'approval-1',
          taskId: 'task-1',
          createdAt: new Date('2026-01-01T00:00:00Z'),
        };
      },
      update: async (args: unknown) => {
        calls.approvalUpdate.push(args);
        return { ...approval, status: 'APPROVED', decidedAt: new Date() };
      },
    },
  } as unknown as PrismaClient;
  return { db, calls };
}

describe('PrismaApprovalRepository tenant isolation', () => {
  it('rejects empty orgId before any database access', async () => {
    const { db, calls } = fakeDb();
    const repo = new PrismaApprovalRepository(db);
    await expect(repo.findByTaskId('', 'task-1')).rejects.toThrow('Organization context required');
    expect(calls.taskFindUnique).toHaveLength(0);
  });

  it('rejects blank orgId before any database access', async () => {
    const { db, calls } = fakeDb();
    const repo = new PrismaApprovalRepository(db);
    await expect(repo.save('   ', approval)).rejects.toThrow('Organization context required');
    expect(calls.taskFindUnique).toHaveLength(0);
  });

  it('verifies task ownership before returning approval', async () => {
    const { db, calls } = fakeDb({ taskOrgId: 'org-a' });
    const repo = new PrismaApprovalRepository(db);
    const result = await repo.findByTaskId('org-a', 'task-1');
    expect(result).toBeDefined();
    expect(calls.taskFindUnique[0]).toMatchObject({
      where: { id: 'task-1' },
      select: { orgId: true },
    });
    expect(calls.approvalFindUnique[0]).toMatchObject({ where: { taskId: 'task-1' } });
  });

  it('rejects approval read when task belongs to another org', async () => {
    const { db } = fakeDb({ taskOrgId: 'org-b' });
    const repo = new PrismaApprovalRepository(db);
    await expect(repo.findByTaskId('org-a', 'task-1')).rejects.toThrow(
      'Task organization mismatch',
    );
  });

  it('rejects approval read when task ownership is missing', async () => {
    const { db } = fakeDb({ taskOrgId: null });
    const repo = new PrismaApprovalRepository(db);
    await expect(repo.findByTaskId('org-a', 'task-1')).rejects.toThrow(
      'Task ownership could not be verified',
    );
  });

  it('verifies task ownership before approve/reject', async () => {
    const { db, calls } = fakeDb({ taskOrgId: 'org-a' });
    const repo = new PrismaApprovalRepository(db);
    await repo.approve('org-a', 'task-1', 'user-1');
    expect(calls.taskFindUnique).toHaveLength(1);
    expect(calls.approvalUpdate).toHaveLength(1);
  });

  it('fail-closed: rejects approve/reject with empty orgId', async () => {
    const { db, calls } = fakeDb({ taskOrgId: 'org-a' });
    const repo = new PrismaApprovalRepository(db);
    await expect(repo.approve('', 'task-1', 'user-1')).rejects.toThrow(
      'Organization context required',
    );
    expect(calls.taskFindUnique).toHaveLength(0);
  });
});
