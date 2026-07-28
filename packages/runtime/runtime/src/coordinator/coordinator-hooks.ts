/**
 * @module coordinator/coordinator-hooks
 * @description Hook manager for execution lifecycle integration.
 */

import type { CoordinatorHook, CoordinatorSession, ExecutionPhase } from './interfaces.js';

export class CoordinatorHookManager {
  private hooks: CoordinatorHook[] = [];

  register(hook: CoordinatorHook): void {
    this.hooks.push(hook);
  }

  unregister(name: string): void {
    this.hooks = this.hooks.filter((h) => h.name !== name);
  }

  async executeBeforeExecution(session: CoordinatorSession): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeExecution) await hook.beforeExecution(session);
    }
  }

  async executeAfterExecution(session: CoordinatorSession, result: unknown): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterExecution) await hook.afterExecution(session, result);
    }
  }

  async executeOnDispatch(session: CoordinatorSession, phase: ExecutionPhase): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onDispatch) await hook.onDispatch(session, phase);
    }
  }

  async executeOnRetry(
    session: CoordinatorSession,
    phase: ExecutionPhase,
    attempt: number,
  ): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onRetry) await hook.onRetry(session, phase, attempt);
    }
  }

  clear(): void {
    this.hooks = [];
  }
}
