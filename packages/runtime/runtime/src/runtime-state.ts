/**
 * @module runtime/runtime-state
 * @description Runtime lifecycle state machine.
 */

import type { RuntimeState } from './interfaces.js';

export class RuntimeStateMachine {
  private static readonly validTransitions: Record<RuntimeState, RuntimeState[]> = {
    CREATED: ['INITIALIZING'],
    INITIALIZING: ['PLANNING', 'FAILED'],
    PLANNING: ['RUNNING', 'FAILED', 'CANCELLED'],
    RUNNING: [
      'EXECUTING',
      'WAITING_APPROVAL',
      'COMPLETED',
      'FAILED',
      'CANCELLED',
      'RECOVERING',
      'CHECKPOINTING',
      'RUNNING',
    ],
    WAITING_APPROVAL: ['RUNNING', 'EXECUTING', 'FAILED', 'CANCELLED'],
    EXECUTING: ['CHECKPOINTING', 'COMPLETED', 'FAILED', 'RECOVERING'],
    CHECKPOINTING: ['EXECUTING', 'COMPLETED'],
    COMPLETED: [],
    FAILED: ['RECOVERING', 'CANCELLED'],
    CANCELLED: [],
    RECOVERING: ['RUNNING', 'FAILED'],
  };

  static canTransition(current: RuntimeState, next: RuntimeState): boolean {
    return this.validTransitions[current]?.includes(next) ?? false;
  }

  static getValidTransitions(state: RuntimeState): RuntimeState[] {
    return this.validTransitions[state] || [];
  }
}
