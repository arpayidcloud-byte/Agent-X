/**
 * @module cognitive-learning/learning-state
 * @description State machine for learning lifecycle.
 */

import type { LearningState } from './interfaces.js';
import { LearningStateError } from './errors.js';

const transitions: Record<LearningState, LearningState[]> = {
  CREATED: ['COLLECTING'],
  COLLECTING: ['EXTRACTING', 'COMPLETED'],
  EXTRACTING: ['PATTERN_ANALYSIS', 'COMPLETED'],
  PATTERN_ANALYSIS: ['REFLECTION', 'COMPLETED'],
  REFLECTION: ['ADAPTATION', 'COMPLETED'],
  ADAPTATION: ['VALIDATION', 'COMPLETED'],
  VALIDATION: ['CHECKPOINTING', 'COMPLETED'],
  CHECKPOINTING: ['COMPLETED'],
  COMPLETED: [],
};

export class LearningStateMachine {
  private state: LearningState = 'CREATED';

  getState(): LearningState {
    return this.state;
  }

  transition(next: LearningState): void {
    if (!transitions[this.state]?.includes(next)) {
      throw new LearningStateError(
        `Invalid transition from ${this.state} to ${next}`,
        'learning-state',
      );
    }
    this.state = next;
  }

  canTransition(next: LearningState): boolean {
    return transitions[this.state]?.includes(next) ?? false;
  }
}
