/**
 * @module runtime/runtime-hooks
 * @description Runtime lifecycle hooks.
 */

import type { RuntimeState, RuntimeSession, RuntimeMetrics } from './interfaces.js';

export interface RuntimeHook {
  name: string;
  beforeStart?: (session: RuntimeSession) => Promise<void>;
  afterStart?: (session: RuntimeSession) => Promise<void>;
  beforeComplete?: (session: RuntimeSession, result: unknown) => Promise<void>;
  afterComplete?: (session: RuntimeSession, metrics: RuntimeMetrics) => Promise<void>;
  onError?: (session: RuntimeSession, error: Error) => Promise<void>;
  onStateChange?: (session: RuntimeSession, from: RuntimeState, to: RuntimeState) => Promise<void>;
}

export class RuntimeHookManager {
  private hooks: RuntimeHook[] = [];

  register(hook: RuntimeHook): void {
    this.hooks.push(hook);
  }

  unregister(hookName: string): void {
    this.hooks = this.hooks.filter((h) => h.name !== hookName);
  }

  async executeBeforeStart(session: RuntimeSession): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeStart) await hook.beforeStart(session);
    }
  }

  async executeAfterStart(session: RuntimeSession): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterStart) await hook.afterStart(session);
    }
  }

  async executeBeforeComplete(session: RuntimeSession, result: unknown): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeComplete) await hook.beforeComplete(session, result);
    }
  }

  async executeAfterComplete(session: RuntimeSession, metrics: RuntimeMetrics): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterComplete) await hook.afterComplete(session, metrics);
    }
  }

  async executeOnStateChange(
    session: RuntimeSession,
    from: RuntimeState,
    to: RuntimeState,
  ): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onStateChange) await hook.onStateChange(session, from, to);
    }
  }

  async executeOnError(session: RuntimeSession, error: Error): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onError) await hook.onError(session, error);
    }
  }
}
