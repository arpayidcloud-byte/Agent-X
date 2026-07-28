import { describe, it, expect } from 'vitest';
import { TaskStatus } from '@agentx/core-runtime';
import { createTestTask, createTestRepo, createTestScheduler } from '../fixtures/test-config.js';

describe('Agent Workflow E2E', () => {
  it('completes a single agent task lifecycle', async () => {
    const repo = createTestRepo();
    const { bus, scheduler } = createTestScheduler(repo);

    const events: string[] = [];
    await bus.subscribe('task.queued', () => events.push('queued'));
    await bus.subscribe('task.started', () => events.push('started'));
    await bus.subscribe('task.completed', () => events.push('completed'));

    const task = createTestTask('e2e-1', 'Write a hello world function');
    await scheduler.enqueue(task);

    const saved = await repo.findById('e2e-1');
    expect(saved?.status).toBe(TaskStatus.RUNNING);

    await scheduler.completeTask('e2e-1', { output: 'function hello() { return "world"; }' });

    const completed = await repo.findById('e2e-1');
    expect(completed?.status).toBe(TaskStatus.COMPLETED);
    expect(completed?.result).toEqual({ output: 'function hello() { return "world"; }' });
    expect(events).toContain('queued');
    expect(events).toContain('started');
    expect(events).toContain('completed');
  });

  it('handles task failure gracefully', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const task = createTestTask('e2e-fail', 'Task that will fail');
    await scheduler.enqueue(task);

    await scheduler.failTask('e2e-fail', new Error('Compilation failed'));

    const failed = await repo.findById('e2e-fail');
    expect(failed?.status).toBe(TaskStatus.FAILED);
    expect((failed?.error as Error).message).toBe('Compilation failed');
  });

  it('manages task concurrency correctly', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const tasks = Array.from({ length: 5 }, (_, i) => createTestTask(`conc-${i}`, `Task ${i}`));

    for (const task of tasks) {
      await scheduler.enqueue(task);
    }

    const running = Array.from(repo.tasks.values()).filter((t) => t.status === TaskStatus.RUNNING);
    const queued = Array.from(repo.tasks.values()).filter((t) => t.status === TaskStatus.QUEUED);

    expect(running.length).toBeLessThanOrEqual(3);
    expect(queued.length + running.length).toBe(5);
  });

  it('pause and resume a running task', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const task = createTestTask('e2e-pause', 'Long running task');
    await scheduler.enqueue(task);

    await scheduler.pause('e2e-pause');
    const paused = await repo.findById('e2e-pause');
    expect(paused?.status).toBe(TaskStatus.WAITING_APPROVAL);

    await scheduler.resume('e2e-pause');
    const resumed = await repo.findById('e2e-pause');
    expect(resumed?.status).toBe(TaskStatus.RUNNING);
  });

  it('cancels a task', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const task = createTestTask('e2e-cancel', 'Task to cancel');
    await scheduler.enqueue(task);

    await scheduler.cancel('e2e-cancel', 'User requested cancellation');
    const cancelled = await repo.findById('e2e-cancel');
    expect(cancelled?.status).toBe(TaskStatus.CANCELLED);
    expect(cancelled?.cancellation?.reason).toBe('User requested cancellation');
  });
});
