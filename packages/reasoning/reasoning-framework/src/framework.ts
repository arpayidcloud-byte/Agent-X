/**
 * @module reasoning-framework/framework
 * @description High-level reasoning framework controller.
 */

import type { ReasoningSession, ReasoningGraph, PipelineStageName } from './interfaces.js';
import { ReasoningPipeline } from './pipeline.js';

export class ReasoningFramework {
  private pipeline = new ReasoningPipeline();

  async executeReasoning(session: ReasoningSession, _graph: ReasoningGraph): Promise<void> {
    const stages: PipelineStageName[] = [
      'NORMALIZATION',
      'CONTEXT_BUILD',
      'GRAPH_BUILD',
      'VALIDATION',
      'READY',
      'EXECUTION',
      'CHECKPOINT',
    ];
    await this.pipeline.execute(session, stages);
  }
}
