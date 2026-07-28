/**
 * @module cognitive-kernel/kernel-hooks
 * @description Hook execution manager.
 */

import type { KernelHook, SessionCheckpoint } from './interfaces.js';

export class KernelHookManager {
  private hooks: KernelHook[] = [];

  register(hook: KernelHook): void {
    this.hooks.push(hook);
  }

  async runBeforeThinking(sessionId: string): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeThinking) await hook.beforeThinking(sessionId);
    }
  }

  async runAfterThinking(sessionId: string, result: unknown): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterThinking) await hook.afterThinking(sessionId, result);
    }
  }

  async runBeforeCheckpoint(sessionId: string): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeCheckpoint) await hook.beforeCheckpoint(sessionId);
    }
  }

  async runAfterCheckpoint(sessionId: string, checkpoint: SessionCheckpoint): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterCheckpoint) await hook.afterCheckpoint(sessionId, checkpoint);
    }
  }

  async runOnFailure(sessionId: string, error: Error): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onFailure) await hook.onFailure(sessionId, error);
    }
  }

  async runOnRecovery(sessionId: string): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onRecovery) await hook.onRecovery(sessionId);
    }
  }
}
