/**
 * @module coordinator/coordinator-state
 * @description State machine for the Production Execution Coordinator.
 */

import type { ExecutionCoordinatorState } from './interfaces.js';
import { CoordinatorStateError } from './errors.js';

const validTransitions: Record<ExecutionCoordinatorState, ExecutionCoordinatorState[]> = {
  CREATED: ['INITIALIZING'],
  INITIALIZING: ['READY', 'FAILED'],
  READY: ['SCHEDULING', 'CANCELLED'],
  SCHEDULING: ['DISPATCHING', 'PAUSED', 'FAILED', 'CANCELLED'],
  DISPATCHING: ['EXECUTING', 'FAILED', 'CANCELLED'],
  EXECUTING: ['COMPLETED', 'WAITING_APPROVAL', 'RECOVERING', 'FAILED', 'PAUSED', 'CANCELLED'],
  WAITING_APPROVAL: ['EXECUTING', 'FAILED', 'CANCELLED'],
  RECOVERING: ['EXECUTING', 'FAILED', 'CANCELLED'],
  PAUSED: ['SCHEDULING', 'CANCELLED'],
  COMPLETED: [],
  FAILED: ['RECOVERING', 'CANCELLED'],
  CANCELLED: [],
};

export class CoordinatorStateMachine {
  private currentState: ExecutionCoordinatorState = 'CREATED';
  private history: Array<{
    from: ExecutionCoordinatorState;
    to: ExecutionCoordinatorState;
    timestamp: Date;
  }> = [];

  getState(): ExecutionCoordinatorState {
    return this.currentState;
  }

  transition(next: ExecutionCoordinatorState): void {
    if (!this.canTransition(next)) {
      throw new CoordinatorStateError(
        `Invalid transition from ${this.currentState} to ${next}`,
        'state-machine',
      );
    }
    const from = this.currentState;
    this.currentState = next;
    this.history.push({ from, to: next, timestamp: new Date() });
  }

  canTransition(next: ExecutionCoordinatorState): boolean {
    return validTransitions[this.currentState]?.includes(next) ?? false;
  }

  getValidTransitions(): ExecutionCoordinatorState[] {
    return validTransitions[this.currentState] || [];
  }

  isTerminal(): boolean {
    return (
      this.currentState === 'COMPLETED' ||
      this.currentState === 'FAILED' ||
      this.currentState === 'CANCELLED'
    );
  }

  getHistory(): Array<{
    from: ExecutionCoordinatorState;
    to: ExecutionCoordinatorState;
    timestamp: Date;
  }> {
    return [...this.history];
  }

  reset(): void {
    this.currentState = 'CREATED';
    this.history = [];
  }
}
