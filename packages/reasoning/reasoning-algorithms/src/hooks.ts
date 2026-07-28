/**
 * @module reasoning-algorithms/hooks
 * @description Execution hooks for reasoning phases.
 */

export interface ReasoningHooks {
  beforeReasoning?: (sessionId: string) => Promise<void>;
  afterReasoning?: (sessionId: string, result: unknown) => Promise<void>;
  onConflict?: (rule1: string, rule2: string) => Promise<void>;
  onRollback?: (sessionId: string) => Promise<void>;
  onRecover?: (sessionId: string) => Promise<void>;
}

export class ReasoningHookManager {
  private hooks: ReasoningHooks[] = [];

  register(hooks: ReasoningHooks): void {
    this.hooks.push(hooks);
  }

  async runBeforeReasoning(sessionId: string): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeReasoning) await hook.beforeReasoning(sessionId);
    }
  }

  async runAfterReasoning(sessionId: string, result: unknown): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterReasoning) await hook.afterReasoning(sessionId, result);
    }
  }

  async runOnConflict(rule1: string, rule2: string): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onConflict) await hook.onConflict(rule1, rule2);
    }
  }

  async runOnRollback(sessionId: string): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onRollback) await hook.onRollback(sessionId);
    }
  }

  async runOnRecover(sessionId: string): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onRecover) await hook.onRecover(sessionId);
    }
  }
}
