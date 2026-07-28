/**
 * @module reasoning-framework/pipeline
 * @description Core reasoning pipeline orchestration.
 */

import type { PipelineStageName, ReasoningSession } from './interfaces.js';
import { PipelineStateMachine } from './pipeline-state.js';
import { PipelineValidator } from './pipeline-validator.js';
import { PipelineHookManager } from './pipeline-hooks.js';
import { PipelineMetrics } from './pipeline-metrics.js';

export class ReasoningPipeline {
  private stateMachine = new PipelineStateMachine();
  private validator = new PipelineValidator();
  private hooks = new PipelineHookManager();
  private metrics = new PipelineMetrics();

  async execute(session: ReasoningSession, stages: PipelineStageName[]): Promise<void> {
    try {
      await this.hooks.runBeforePipeline(session.id);
      for (const stage of stages) {
        this.validator.validateStage(session, stage);
        this.stateMachine.transition(stage);
        this.metrics.recordStageDuration(stage, 10); // simulated
        await this.hooks.runAfterStage(session.id, stage);
      }
      this.stateMachine.transition('COMPLETED');
      await this.hooks.runAfterPipeline(session.id, 'completed');
    } catch (err: unknown) {
      this.stateMachine.transition('FAILED');
      await this.hooks.runOnFailure(
        session.id,
        err instanceof Error ? err : new Error(String(err)),
      );
      throw err;
    }
  }

  getState(): PipelineStageName {
    return this.stateMachine.getState();
  }
}
