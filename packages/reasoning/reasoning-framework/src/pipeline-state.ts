/**
 * @module reasoning-framework/pipeline-state
 * @description State transitions for the reasoning pipeline.
 */

import type { PipelineStageName } from './interfaces.js';
import { PipelineError } from './errors.js';

const validTransitions: Record<PipelineStageName, PipelineStageName[]> = {
  INPUT: ['NORMALIZATION', 'FAILED'],
  NORMALIZATION: ['CONTEXT_BUILD', 'FAILED'],
  CONTEXT_BUILD: ['GRAPH_BUILD', 'FAILED'],
  GRAPH_BUILD: ['VALIDATION', 'FAILED'],
  VALIDATION: ['READY', 'FAILED'],
  READY: ['EXECUTION', 'FAILED', 'CANCELLED'],
  EXECUTION: ['COMPLETED', 'CHECKPOINT', 'FAILED'],
  CHECKPOINT: ['RECOVERY', 'EXECUTION', 'COMPLETED', 'FAILED'],
  RECOVERY: ['EXECUTION', 'FAILED'],
  COMPLETED: [],
  FAILED: ['RECOVERY', 'CANCELLED'],
  CANCELLED: [],
};

export class PipelineStateMachine {
  private currentState: PipelineStageName = 'INPUT';

  getState(): PipelineStageName {
    return this.currentState;
  }

  transition(next: PipelineStageName): void {
    if (!validTransitions[this.currentState]?.includes(next)) {
      throw new PipelineError(
        `Invalid pipeline transition: ${this.currentState} -> ${next}`,
        'pipeline-state',
      );
    }
    this.currentState = next;
  }

  canTransition(next: PipelineStageName): boolean {
    return validTransitions[this.currentState]?.includes(next) ?? false;
  }
}
