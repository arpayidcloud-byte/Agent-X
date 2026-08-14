import { describe, expect, it, vi } from 'vitest';
import { PrismaTaskRepository } from './prisma-task-repository.js';
import { TaskPriority, TaskStatus, type TaskModel } from '@agent-xai/core-runtime';

function task(overrides: Partial<TaskModel> = {}): TaskModel {
  return {
    id: 'task-1',
    orgId: 'org-a',
    goal: 'test task',
    status: TaskStatus.CREATED,
    priority: TaskPriority.NORMAL,
    rootTaskId: 'task-1',
    dependsOn: [],
    traceId: 'trace-1',
    metadata: { retryCount: 0 },
    context: { variables: {}, history: [] },
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('PrismaTaskRepository tenant guard', () => {
  it('rejects persistence without organization context before database access', async () => {
    const upsert = vi.fn();
    const repo = new PrismaTaskRepository({ task: { upsert } } as never);

    await expect(repo.save('   ', task({ orgId: undefined }))).rejects.toThrow(
      'Organization context required for task persistence',
    );
    expect(upsert).not.toHaveBeenCalled();
  });

  it('rejects a task payload claiming a different organization', async () => {
    const findUnique = vi.fn();
    const upsert = vi.fn();
    const repo = new PrismaTaskRepository({ task: { findUnique, upsert } } as never);

    await expect(repo.save('org-a', task({ orgId: 'org-b' }))).rejects.toThrow(
      'Task organization mismatch',
    );
    expect(findUnique).not.toHaveBeenCalled();
    expect(upsert).not.toHaveBeenCalled();
  });

  it('rejects overwriting a task owned by another organization', async () => {
    const findUnique = vi.fn().mockResolvedValue({ orgId: 'org-b' });
    const upsert = vi.fn();
    const repo = new PrismaTaskRepository({ task: { findUnique, upsert } } as never);

    await expect(repo.save('org-a', task({ orgId: 'org-a' }))).rejects.toThrow(
      'Task organization mismatch',
    );
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      select: { orgId: true },
    });
    expect(upsert).not.toHaveBeenCalled();
  });

  it('writes the server-side organization onto persistent tasks', async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const upsert = vi.fn().mockResolvedValue({});
    const repo = new PrismaTaskRepository({ task: { findUnique, upsert } } as never);

    await repo.save('org-a', task({ orgId: undefined }));

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ orgId: 'org-a' }),
        update: expect.objectContaining({ orgId: 'org-a' }),
      }),
    );
  });

  it('scopes reads by organization', async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const findMany = vi.fn().mockResolvedValue([]);
    const repo = new PrismaTaskRepository({ task: { findUnique, findMany } } as never);

    await repo.findById('org-a', 'task-1');
    await repo.findByRootId('org-a', 'root-1');
    await repo.getAll('org-a');

    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'task-1', orgId: 'org-a' },
      include: { events: true },
    });
    expect(findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ where: { rootTaskId: 'root-1', orgId: 'org-a' } }),
    );
    expect(findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ where: { orgId: 'org-a' } }),
    );
  });
});
