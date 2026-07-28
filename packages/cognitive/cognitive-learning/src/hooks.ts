/**
 * @module cognitive-learning/hooks
 * @description Learning lifecycle hook support.
 */

export interface LearningHooks {
  beforeLearning?: (sessionId: string) => Promise<void>;
  afterLearning?: (sessionId: string, result: unknown) => Promise<void>;
  beforeReflection?: (sessionId: string) => Promise<void>;
  afterReflection?: (sessionId: string) => Promise<void>;
  beforeAdaptation?: (sessionId: string) => Promise<void>;
  afterAdaptation?: (sessionId: string) => Promise<void>;
}

export class LearningHookManager {
  private hooks: LearningHooks[] = [];

  register(hooks: LearningHooks): void {
    this.hooks.push(hooks);
  }

  async runBeforeLearning(sessionId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeLearning) await h.beforeLearning(sessionId);
    }
  }
  async runAfterLearning(sessionId: string, result: unknown): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterLearning) await h.afterLearning(sessionId, result);
    }
  }
  async runBeforeReflection(sessionId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeReflection) await h.beforeReflection(sessionId);
    }
  }
  async runAfterReflection(sessionId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterReflection) await h.afterReflection(sessionId);
    }
  }
  async runBeforeAdaptation(sessionId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeAdaptation) await h.beforeAdaptation(sessionId);
    }
  }
  async runAfterAdaptation(sessionId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterAdaptation) await h.afterAdaptation(sessionId);
    }
  }
}
