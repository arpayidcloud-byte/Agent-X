/**
 * @module cognitive-contracts/cognitive-lifecycle
 * @description Cognitive lifecycle contract management.
 */

import type { CognitiveState } from './interfaces.js';
import { ValidationError } from './errors.js';

const validTransitions: Record<CognitiveState, CognitiveState[]> = {
  CREATED: ['INITIALIZING'],
  INITIALIZING: ['THINKING', 'FAILED'],
  THINKING: ['REASONING', 'FAILED', 'CANCELLED'],
  REASONING: ['REFLECTING', 'PLANNING', 'DECISION', 'FAILED', 'CANCELLED'],
  REFLECTING: ['THINKING', 'DECISION', 'FAILED', 'CANCELLED'],
  PLANNING: ['WAITING_APPROVAL', 'EXECUTING', 'FAILED', 'CANCELLED'],
  WAITING_APPROVAL: ['DECISION', 'EXECUTING', 'FAILED', 'CANCELLED'],
  DECISION: ['EXECUTING', 'FAILED', 'CANCELLED'],
  EXECUTING: ['COMPLETED', 'FAILED', 'CANCELLED', 'RECOVERING'],
  COMPLETED: [],
  FAILED: ['RECOVERING', 'CANCELLED'],
  CANCELLED: [],
  RECOVERING: ['THINKING', 'EXECUTING', 'FAILED'],
};

export class CognitiveLifecycle {
  private currentState: CognitiveState = 'CREATED';

  transition(nextState: CognitiveState): void {
    const valid = validTransitions[this.currentState]?.includes(nextState);
    if (!valid) {
      throw new ValidationError(
        `Invalid transition from ${this.currentState} to ${nextState}`,
        'lifecycle',
      );
    }
    this.currentState = nextState;
  }

  getState(): CognitiveState {
    return this.currentState;
  }
}
