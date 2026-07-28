/**
 * @module workflow-engine/hooks-coverage.test
 * @description Additional test coverage for hooks module.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkflowHookManager, createNode, createWorkflow } from '../src/index.js';
import type { WorkflowHook, WorkflowMetrics } from '../src/index.js';

describe('WorkflowHookManager', () => {
  let hookManager: WorkflowHookManager;

  beforeEach(() => {
    hookManager = new WorkflowHookManager();
  });

  describe('executeBeforeNodeHook', () => {
    it('executes beforeNode hooks', async () => {
      const mockBeforeNode = vi.fn().mockResolvedValue(undefined);
      const hook: WorkflowHook = {
        name: 'test-hook',
        beforeNode: mockBeforeNode,
      };

      hookManager.register(hook);

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });

      await hookManager.executeBeforeNodeHook(node);

      expect(mockBeforeNode).toHaveBeenCalledTimes(1);
      expect(mockBeforeNode).toHaveBeenCalledWith(node);
    });

    it('executes multiple beforeNode hooks', async () => {
      const mockHook1 = vi.fn().mockResolvedValue(undefined);
      const mockHook2 = vi.fn().mockResolvedValue(undefined);

      hookManager.register({ name: 'hook-1', beforeNode: mockHook1 });
      hookManager.register({ name: 'hook-2', beforeNode: mockHook2 });

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });

      await hookManager.executeBeforeNodeHook(node);

      expect(mockHook1).toHaveBeenCalledTimes(1);
      expect(mockHook2).toHaveBeenCalledTimes(1);
    });

    it('skips hooks without beforeNode', async () => {
      const hook: WorkflowHook = {
        name: 'test-hook',
      };

      hookManager.register(hook);

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });

      await expect(hookManager.executeBeforeNodeHook(node)).resolves.not.toThrow();
    });
  });

  describe('executeAfterNodeHook', () => {
    it('executes afterNode hooks', async () => {
      const mockAfterNode = vi.fn().mockResolvedValue(undefined);
      const hook: WorkflowHook = {
        name: 'test-hook',
        afterNode: mockAfterNode,
      };

      hookManager.register(hook);

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });
      const result = { status: 'success', data: 'test-data' };

      await hookManager.executeAfterNodeHook(node, result);

      expect(mockAfterNode).toHaveBeenCalledTimes(1);
      expect(mockAfterNode).toHaveBeenCalledWith(node, result);
    });

    it('executes multiple afterNode hooks with result', async () => {
      const mockHook1 = vi.fn().mockResolvedValue(undefined);
      const mockHook2 = vi.fn().mockResolvedValue(undefined);

      hookManager.register({ name: 'hook-1', afterNode: mockHook1 });
      hookManager.register({ name: 'hook-2', afterNode: mockHook2 });

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });
      const result = { value: 42 };

      await hookManager.executeAfterNodeHook(node, result);

      expect(mockHook1).toHaveBeenCalledWith(node, result);
      expect(mockHook2).toHaveBeenCalledWith(node, result);
    });

    it('skips hooks without afterNode', async () => {
      const hook: WorkflowHook = {
        name: 'test-hook',
      };

      hookManager.register(hook);

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });

      await expect(hookManager.executeAfterNodeHook(node, { status: 'ok' })).resolves.not.toThrow();
    });
  });

  describe('executeRetryHook', () => {
    it('executes onRetry hooks', async () => {
      const mockOnRetry = vi.fn().mockResolvedValue(undefined);
      const hook: WorkflowHook = {
        name: 'test-hook',
        onRetry: mockOnRetry,
      };

      hookManager.register(hook);

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });
      const attempt = 3;

      await hookManager.executeRetryHook(node, attempt);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
      expect(mockOnRetry).toHaveBeenCalledWith(node, attempt);
    });

    it('executes multiple onRetry hooks', async () => {
      const mockHook1 = vi.fn().mockResolvedValue(undefined);
      const mockHook2 = vi.fn().mockResolvedValue(undefined);

      hookManager.register({ name: 'hook-1', onRetry: mockHook1 });
      hookManager.register({ name: 'hook-2', onRetry: mockHook2 });

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });

      await hookManager.executeRetryHook(node, 2);

      expect(mockHook1).toHaveBeenCalledWith(node, 2);
      expect(mockHook2).toHaveBeenCalledWith(node, 2);
    });

    it('skips hooks without onRetry', async () => {
      const hook: WorkflowHook = {
        name: 'test-hook',
      };

      hookManager.register(hook);

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });

      await expect(hookManager.executeRetryHook(node, 1)).resolves.not.toThrow();
    });
  });

  describe('executeFailureHook', () => {
    it('executes onFailure hooks', async () => {
      const mockOnFailure = vi.fn().mockResolvedValue(undefined);
      const hook: WorkflowHook = {
        name: 'test-hook',
        onFailure: mockOnFailure,
      };

      hookManager.register(hook);

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });
      const error = new Error('Test failure');

      await hookManager.executeFailureHook(node, error);

      expect(mockOnFailure).toHaveBeenCalledTimes(1);
      expect(mockOnFailure).toHaveBeenCalledWith(node, error);
    });

    it('executes multiple onFailure hooks', async () => {
      const mockHook1 = vi.fn().mockResolvedValue(undefined);
      const mockHook2 = vi.fn().mockResolvedValue(undefined);

      hookManager.register({ name: 'hook-1', onFailure: mockHook1 });
      hookManager.register({ name: 'hook-2', onFailure: mockHook2 });

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });
      const error = new Error('Multiple failure test');

      await hookManager.executeFailureHook(node, error);

      expect(mockHook1).toHaveBeenCalledWith(node, error);
      expect(mockHook2).toHaveBeenCalledWith(node, error);
    });

    it('skips hooks without onFailure', async () => {
      const hook: WorkflowHook = {
        name: 'test-hook',
      };

      hookManager.register(hook);

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });
      const error = new Error('Test error');

      await expect(hookManager.executeFailureHook(node, error)).resolves.not.toThrow();
    });

    it('handles custom error types', async () => {
      const mockOnFailure = vi.fn().mockResolvedValue(undefined);
      hookManager.register({ name: 'test-hook', onFailure: mockOnFailure });

      const node = createNode('n1', 'task', 'Task 1', {
        type: 'task',
        goal: 'test',
        priority: 1,
      });
      const customError = new TypeError('Custom type error');

      await hookManager.executeFailureHook(node, customError);

      expect(mockOnFailure).toHaveBeenCalledWith(node, customError);
    });
  });

  describe('register and unregister', () => {
    it('registers and unregisters hooks', () => {
      const hook: WorkflowHook = {
        name: 'test-hook',
      };

      hookManager.register(hook);
      hookManager.unregister('test-hook');

      expect((hookManager as unknown as { hooks: WorkflowHook[] }).hooks.length).toBe(0);
    });

    it('unregister only removes matching hook', () => {
      const hook1: WorkflowHook = { name: 'hook-1' };
      const hook2: WorkflowHook = { name: 'hook-2' };

      hookManager.register(hook1);
      hookManager.register(hook2);
      hookManager.unregister('hook-1');

      expect((hookManager as unknown as { hooks: WorkflowHook[] }).hooks.length).toBe(1);
      expect((hookManager as unknown as { hooks: WorkflowHook[] }).hooks[0].name).toBe('hook-2');
    });
  });

  describe('executeBeforeHooks', () => {
    it('executes beforeWorkflow hooks', async () => {
      const mockBeforeWorkflow = vi.fn().mockResolvedValue(undefined);
      hookManager.register({ name: 'test-hook', beforeWorkflow: mockBeforeWorkflow });

      const workflow = createWorkflow('wf-1', 'Test Workflow', 'admin');

      await hookManager.executeBeforeHooks(workflow);

      expect(mockBeforeWorkflow).toHaveBeenCalledTimes(1);
      expect(mockBeforeWorkflow).toHaveBeenCalledWith(workflow);
    });
  });

  describe('executeAfterHooks', () => {
    it('executes afterWorkflow hooks', async () => {
      const mockAfterWorkflow = vi.fn().mockResolvedValue(undefined);
      hookManager.register({ name: 'test-hook', afterWorkflow: mockAfterWorkflow });

      const workflow = createWorkflow('wf-1', 'Test Workflow', 'admin');
      const metrics: WorkflowMetrics = {
        workflowId: 'wf-1',
        totalNodes: 1,
        completedNodes: 1,
        failedNodes: 0,
        skippedNodes: 0,
        totalDurationMs: 100,
        nodeDurations: new Map(),
        retries: 0,
        errors: 0,
      };

      await hookManager.executeAfterHooks(workflow, metrics);

      expect(mockAfterWorkflow).toHaveBeenCalledTimes(1);
      expect(mockAfterWorkflow).toHaveBeenCalledWith(workflow, metrics);
    });
  });
});
