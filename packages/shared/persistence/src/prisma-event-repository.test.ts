import { describe, expect, it, vi } from 'vitest';
import { PrismaEventRepository, type EventModel } from './prisma-event-repository.js';

const event: EventModel = {
  id: 'event-1',
  topic: 'task.completed',
  payload: { ok: true },
  taskId: 'task-1',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('PrismaEventRepository tenant boundary', () => {
  it('rejects events without a task or organization before creating a row', async () => {
    const create = vi.fn();
    const findFirst = vi.fn();
    const repo = new PrismaEventRepository({ event: { create }, task: { findFirst } } as never);

    await expect(repo.save('', event)).rejects.toThrow(
      'Organization context required for event persistence',
    );
    await expect(repo.save('org-a', { ...event, taskId: undefined })).rejects.toThrow(
      'Task context required for event persistence',
    );
    expect(findFirst).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects an event whose task is not owned by the organization', async () => {
    const create = vi.fn();
    const findFirst = vi.fn().mockResolvedValue(null);
    const repo = new PrismaEventRepository({ event: { create }, task: { findFirst } } as never);

    await expect(repo.save('org-a', event)).rejects.toThrow('Task does not belong to organization');
    expect(findFirst).toHaveBeenCalledWith({
      where: { id: 'task-1', orgId: 'org-a' },
      select: { id: true },
    });
    expect(create).not.toHaveBeenCalled();
  });
});
