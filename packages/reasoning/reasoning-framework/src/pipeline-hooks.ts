/**
 * @module reasoning-framework/pipeline-hooks
 * @description Hook execution manager.
 */

import type { PipelineHook, PipelineStageName } from './interfaces.js';

export class PipelineHookManager {
  private hooks: PipelineHook[] = [];

  register(hook: PipelineHook): void {
    this.hooks.push(hook);
  }

  async runBeforePipeline(sessionId: string): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforePipeline) await hook.beforePipeline(sessionId);
    }
  }

  async runAfterPipeline(sessionId: string, result: unknown): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterPipeline) await hook.afterPipeline(sessionId, result);
    }
  }

  async runBeforeStage(sessionId: string, stage: PipelineStageName): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeStage) await hook.beforeStage(sessionId, stage);
    }
  }

  async runAfterStage(sessionId: string, stage: PipelineStageName): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterStage) await hook.afterStage(sessionId, stage);
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
