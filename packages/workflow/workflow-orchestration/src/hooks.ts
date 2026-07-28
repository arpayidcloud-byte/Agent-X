/**
 * @module workflow-orchestration/hooks
 * @description Workflow lifecycle hooks.
 */

import type { WorkflowHook } from './interfaces.js';

export class WorkflowHookManager {
  private hooks: WorkflowHook[] = [];

  register(hook: WorkflowHook): void {
    this.hooks.push(hook);
  }

  async runBeforeWorkflow(workflowId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeWorkflow) await h.beforeWorkflow(workflowId);
    }
  }

  async runAfterWorkflow(workflowId: string, result: unknown): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterWorkflow) await h.afterWorkflow(workflowId, result);
    }
  }

  async runBeforeExecution(taskId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeExecution) await h.beforeExecution(taskId);
    }
  }

  async runAfterExecution(taskId: string, result: unknown): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterExecution) await h.afterExecution(taskId, result);
    }
  }

  async runBeforeDispatch(taskId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeDispatch) await h.beforeDispatch(taskId);
    }
  }

  async runAfterDispatch(taskId: string, result: unknown): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterDispatch) await h.afterDispatch(taskId, result);
    }
  }

  async runBeforeReplanning(workflowId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeReplanning) await h.beforeReplanning(workflowId);
    }
  }

  async runAfterReplanning(workflowId: string, plan: unknown): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterReplanning) await h.afterReplanning(workflowId, plan);
    }
  }

  async runBeforeConflictResolution(conflictId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeConflictResolution) await h.beforeConflictResolution(conflictId);
    }
  }

  async runAfterConflictResolution(conflictId: string, resolution: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterConflictResolution) await h.afterConflictResolution(conflictId, resolution);
    }
  }
}
