import { describe, it, expect } from 'vitest';
import { TaskStatus, TaskNotFoundError } from '@agentx/core-runtime';
import {
  createTestTask,
  createTestRepo,
  createTestScheduler,
  TEST_ORG_ID as ORG,
} from '../fixtures/test-config.js';

describe('Error Handling E2E', () => {
  it('handles task not found errors', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    await expect(scheduler.pause(ORG, 'nonexistent')).rejects.toThrow(TaskNotFoundError);
    await expect(scheduler.cancel(ORG, 'nonexistent', 'reason')).rejects.toThrow(TaskNotFoundError);
  });

  it('resumes gracefully when task not in paused set', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const task = createTestTask('err-resume', 'Test task');
    await scheduler.enqueue(ORG, task);
    await scheduler.completeTask(ORG, 'err-resume', 'done');

    await expect(scheduler.resume(ORG, 'err-resume')).resolves.toBeUndefined();
  });

  it('handles task failure with error propagation', async () => {
    const repo = createTestRepo();
    const { bus, scheduler } = createTestScheduler(repo);

    const failedEvents: string[] = [];
    await bus.subscribe('task.failed', () => failedEvents.push('failed'));

    const task = createTestTask('err-prop', 'Task that fails');
    await scheduler.enqueue(ORG, task);
    await scheduler.failTask(ORG, 'err-prop', new Error('Timeout exceeded'));

    const failed = await repo.findById(ORG, 'err-prop');
    expect(failed?.status).toBe(TaskStatus.FAILED);
    expect(failedEvents).toContain('failed');
  });

  it('handles cancel during active task', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const task = createTestTask('err-cancel', 'Active task');
    await scheduler.enqueue(ORG, task);

    await scheduler.cancel(ORG, 'err-cancel', 'Emergency stop');
    const cancelled = await repo.findById(ORG, 'err-cancel');
    expect(cancelled?.status).toBe(TaskStatus.CANCELLED);
  });

  it('handles enqueue with task already in correct status', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const task = createTestTask('err-status', 'Task');
    await scheduler.enqueue(ORG, task);

    const running = await repo.findById(ORG, 'err-status');
    expect(running?.status).toBe(TaskStatus.RUNNING);

    await scheduler.completeTask(ORG, 'err-status', 'done');
    const completed = await repo.findById(ORG, 'err-status');
    expect(completed?.status).toBe(TaskStatus.COMPLETED);
  });
});
