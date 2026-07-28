/**
 * @module goal-intelligence/goal-state
 * @description State machine for goal decomposition lifecycle.
 */

import type { GoalState } from './interfaces.js';
import { GoalError } from './errors.js';

const validTransitions: Record<GoalState, GoalState[]> = {
  CREATED: ['VALIDATING'],
  VALIDATING: ['DECOMPOSING', 'FAILED'],
  DECOMPOSING: ['GRAPH_BUILDING', 'FAILED'],
  GRAPH_BUILDING: ['PLANNING', 'FAILED'],
  PLANNING: ['DECISION', 'FAILED'],
  DECISION: ['VALIDATION', 'FAILED'],
  VALIDATION: ['CHECKPOINTING', 'FAILED'],
  CHECKPOINTING: ['READY', 'COMPLETED', 'FAILED'],
  READY: ['COMPLETED', 'FAILED'],
  COMPLETED: [],
  FAILED: [],
};

export class GoalStateMachine {
  private state: GoalState = 'CREATED';

  getState(): GoalState {
    return this.state;
  }

  transition(next: GoalState): void {
    if (!validTransitions[this.state]?.includes(next)) {
      throw new GoalError(
        `Invalid transition from ${this.state} to ${next}`,
        'GOAL_STATE_ERROR',
        'goal-state',
      );
    }
    this.state = next;
  }

  canTransition(next: GoalState): boolean {
    return validTransitions[this.state]?.includes(next) ?? false;
  }
}
