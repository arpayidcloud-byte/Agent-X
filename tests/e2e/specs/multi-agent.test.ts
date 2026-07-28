import { describe, it, expect } from 'vitest';
import { TaskStatus } from '@agentx/core-runtime';
import { createTestTask, createTestRepo, createTestScheduler } from '../fixtures/test-config.js';

describe('Multi-Agent Collaboration E2E', () => {
  it('executes coding -> test -> review flow', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const codingTask = createTestTask('agent-code', 'Write code for feature X');
    const testTask = createTestTask('agent-test', 'Test feature X');
    const reviewTask = createTestTask('agent-review', 'Review feature X');

    testTask.dependsOn = ['agent-code'];
    reviewTask.dependsOn = ['agent-test'];

    await scheduler.enqueue(codingTask);
    await scheduler.enqueue(testTask);
    await scheduler.enqueue(reviewTask);

    expect(repo.tasks.get('agent-code')?.status).toBe(TaskStatus.RUNNING);

    await scheduler.completeTask('agent-code', { files: ['feature.ts'] });
    expect(repo.tasks.get('agent-code')?.status).toBe(TaskStatus.COMPLETED);

    await scheduler.completeTask('agent-test', { passed: true });
    expect(repo.tasks.get('agent-test')?.status).toBe(TaskStatus.COMPLETED);

    await scheduler.completeTask('agent-review', { approved: true });
    expect(repo.tasks.get('agent-review')?.status).toBe(TaskStatus.COMPLETED);
  });

  it('handles parallel independent tasks', async () => {
    const repo = createTestRepo();
    const { scheduler } = createTestScheduler(repo);

    const t1 = createTestTask('par-1', 'Independent task 1');
    const t2 = createTestTask('par-2', 'Independent task 2');
    const t3 = createTestTask('par-3', 'Independent task 3');

    await scheduler.enqueue(t1);
    await scheduler.enqueue(t2);
    await scheduler.enqueue(t3);

    const running = Array.from(repo.tasks.values()).filter((t) => t.status === TaskStatus.RUNNING);
    expect(running.length).toBeGreaterThanOrEqual(2);

    await scheduler.completeTask('par-1', 'done');
    await scheduler.completeTask('par-2', 'done');
    await scheduler.completeTask('par-3', 'done');

    const allCompleted = Array.from(repo.tasks.values()).every(
      (t) => t.status === TaskStatus.COMPLETED,
    );
    expect(allCompleted).toBe(true);
  });
});
