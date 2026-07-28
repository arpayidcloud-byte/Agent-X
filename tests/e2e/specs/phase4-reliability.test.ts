/**
 * Phase 4 Reliability E2E Tests
 * Tests for error handling, dead letter queue, and graceful shutdown
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TaskStatus,
  InMemoryTaskRepository,
  InMemoryEventBus,
  Scheduler,
} from '@agentx/core-runtime';
import {
  DeadLetterQueue,
  GracefulShutdownManager,
  InFlightTracker,
} from '../../../packages/runtime/runtime-production/src/index.js';
import { createTestTask } from '../fixtures/test-config.js';

describe('Phase 4 - Reliability E2E', () => {
  describe('Dead Letter Queue', () => {
    let dlq: DeadLetterQueue;

    beforeEach(() => {
      dlq = new DeadLetterQueue();
    });

    it('1. DLQ accepts and stores failed messages', () => {
      const mockMessage = {
        id: 'failed-1',
        traceId: 'trace-1',
        workflowId: 'workflow-1',
        payload: { error: 'test error' },
        priority: 1,
        retryCount: 3,
        status: 'FAILED' as const,
        createdAt: new Date(),
      };

      dlq.send(mockMessage);
      expect(dlq.size()).toBe(1);
    });

    it('2. DLQ lists all messages', () => {
      const msg1 = {
        id: 'failed-1',
        traceId: 't1',
        workflowId: 'w1',
        payload: {},
        priority: 1,
        retryCount: 0,
        status: 'FAILED' as const,
        createdAt: new Date(),
      };
      const msg2 = { ...msg1, id: 'failed-2' };

      dlq.send(msg1);
      dlq.send(msg2);

      const messages = dlq.list();
      expect(messages).toHaveLength(2);
      expect(messages.map((m) => m.id)).toContain('failed-1');
      expect(messages.map((m) => m.id)).toContain('failed-2');
    });

    it('3. DLQ can be cleared', () => {
      dlq.send({
        id: 'failed-1',
        traceId: 't1',
        workflowId: 'w1',
        payload: {},
        priority: 1,
        retryCount: 0,
        status: 'FAILED' as const,
        createdAt: new Date(),
      });

      expect(dlq.size()).toBe(1);
      dlq.clear();
      expect(dlq.size()).toBe(0);
    });
  });

  describe('Graceful Shutdown Manager', () => {
    let manager: GracefulShutdownManager;

    beforeEach(() => {
      manager = new GracefulShutdownManager();
    });

    it('4. Shutdown manager initializes correctly', () => {
      expect(manager.isShutdown()).toBe(false);
      expect(manager.getInFlightCount()).toBe(0);
    });

    it('5. Shutdown hooks are executed', async () => {
      let hookExecuted = false;
      manager.registerHook(async () => {
        hookExecuted = true;
      });

      await manager.initiateShutdown({ reason: 'test', timeoutMs: 5000 });
      expect(hookExecuted).toBe(true);
      expect(manager.isShutdown()).toBe(true);
    });

    it('6. Multiple shutdown hooks execute sequentially', async () => {
      const executionOrder: number[] = [];

      manager.registerHook(async () => {
        executionOrder.push(1);
      });
      manager.registerHook(async () => {
        executionOrder.push(2);
      });
      manager.registerHook(async () => {
        executionOrder.push(3);
      });

      await manager.initiateShutdown({ reason: 'test', timeoutMs: 5000 });
      expect(executionOrder).toEqual([1, 2, 3]);
    });

    it('7. Shutdown continues even if hook fails', async () => {
      let secondHookExecuted = false;

      manager.registerHook(async () => {
        throw new Error('First hook fails');
      });
      manager.registerHook(async () => {
        secondHookExecuted = true;
      });

      await manager.initiateShutdown({ reason: 'test', timeoutMs: 5000 });
      expect(secondHookExecuted).toBe(true);
      expect(manager.isShutdown()).toBe(true);
    });

    it('8. In-flight operations are tracked', async () => {
      const operation = new Promise((resolve) => setTimeout(resolve, 100));
      manager.trackOperation(operation, 'test-op');

      expect(manager.getInFlightCount()).toBe(1);
      await operation;
      // Give it time to be removed
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(manager.getInFlightCount()).toBe(0);
    });

    it('9. Shutdown waits for in-flight operations', async () => {
      let operationCompleted = false;

      const operation = new Promise<void>((resolve) => {
        setTimeout(() => {
          operationCompleted = true;
          resolve();
        }, 200);
      });

      manager.trackOperation(operation, 'long-op');

      await manager.initiateShutdown({ reason: 'test', timeoutMs: 5000 });
      expect(operationCompleted).toBe(true);
    });

    it('10. Shutdown times out if operations take too long', async () => {
      const longOperation = new Promise((resolve) => setTimeout(resolve, 10000));
      manager.trackOperation(longOperation, 'very-long-op');

      await expect(manager.initiateShutdown({ reason: 'test', timeoutMs: 500 })).rejects.toThrow(
        'Shutdown timeout',
      );
    });

    it('11. Signal handlers can be installed', () => {
      // This test just verifies the method doesn't throw
      // Actual signal testing requires process control
      expect(() => manager.installSignalHandlers()).not.toThrow();
    });

    it('12. Shutdown manager can be reset', () => {
      manager.registerHook(async () => {});
      manager.clear();

      expect(manager.isShutdown()).toBe(false);
      expect(manager.getInFlightCount()).toBe(0);
    });
  });

  describe('In-Flight Tracker', () => {
    let tracker: InFlightTracker;

    beforeEach(() => {
      tracker = new InFlightTracker();
    });

    it('13. Tracks operation count', async () => {
      const op1 = Promise.resolve();
      const op2 = Promise.resolve();

      tracker.register(op1, 'op1');
      tracker.register(op2, 'op2');

      expect(tracker.getCount()).toBe(2);
      await Promise.all([op1, op2]);
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(tracker.getCount()).toBe(0);
    });

    // Await resolved promises to avoid floating promise warning
    void op1;
    void op2;

    it('14. Waits for all operations with timeout', async () => {
      const op1 = new Promise((resolve) => setTimeout(resolve, 50));
      const op2 = new Promise((resolve) => setTimeout(resolve, 100));

      tracker.register(op1, 'fast');
      tracker.register(op2, 'slow');

      await tracker.waitForAll(2000);
      expect(tracker.getCount()).toBe(0);
    });

    it('15. Throws on timeout', async () => {
      const neverResolves = new Promise(() => {
        // Never resolves
      });

      tracker.register(neverResolves, 'never');

      await expect(tracker.waitForAll(100)).rejects.toThrow('Timeout waiting');
    });
  });

  describe('Integration: Error Handling + DLQ', () => {
    it('16. Failed tasks can be sent to DLQ', async () => {
      const dlq = new DeadLetterQueue();
      const repo = new InMemoryTaskRepository();
      const bus = new InMemoryEventBus();
      const scheduler = new Scheduler(bus, repo);

      const task = createTestTask('dlq-test', 'Task that will fail');
      await scheduler.enqueue(task);

      // Simulate task failure
      await scheduler.failTask(task.id, new Error('Test failure'));

      const failedTask = await repo.findById(task.id);
      expect(failedTask?.status).toBe(TaskStatus.FAILED);

      // In production, ErrorHandler would automatically send to DLQ
      // Here we manually verify the task can be added to DLQ
      dlq.send({
        id: task.id,
        traceId: task.traceId || '',
        workflowId: task.rootTaskId,
        payload: failedTask,
        priority: task.priority,
        retryCount: 0,
        status: 'FAILED',
        createdAt: task.createdAt,
      });

      expect(dlq.size()).toBe(1);
    });
  });
});
