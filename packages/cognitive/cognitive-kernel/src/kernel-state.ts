/**
 * @module cognitive-kernel/kernel-state
 * @description Manages transitions between cognitive lifecycle states.
 */

import type { KernelState } from './interfaces.js';
import { LifecycleError } from './errors.js';

const validTransitions: Record<KernelState, KernelState[]> = {
  CREATED: ['INITIALIZING'],
  INITIALIZING: ['READY', 'FAILED'],
  READY: ['WAITING', 'THINKING', 'CANCELLED'],
  WAITING: ['THINKING', 'CANCELLED', 'RECOVERING'],
  THINKING: ['REASONING', 'EXECUTING', 'FAILED', 'CANCELLED', 'CHECKPOINTING'],
  REASONING: ['REFLECTING', 'PLANNING', 'DECISION', 'FAILED', 'CANCELLED', 'CHECKPOINTING'],
  REFLECTING: ['THINKING', 'DECISION', 'FAILED', 'CANCELLED', 'CHECKPOINTING'],
  PLANNING: ['WAITING_APPROVAL', 'EXECUTING', 'FAILED', 'CANCELLED', 'CHECKPOINTING'],
  WAITING_APPROVAL: ['DECISION', 'EXECUTING', 'FAILED', 'CANCELLED'],
  DECISION: ['EXECUTING', 'FAILED', 'CANCELLED', 'CHECKPOINTING'],
  EXECUTING: ['COMPLETED', 'FAILED', 'CANCELLED', 'CHECKPOINTING'],
  CHECKPOINTING: [
    'THINKING',
    'REASONING',
    'REFLECTING',
    'PLANNING',
    'DECISION',
    'EXECUTING',
    'FAILED',
    'CANCELLED',
    'COMPLETED',
  ],
  RECOVERING: ['WAITING', 'THINKING', 'FAILED', 'CANCELLED'],
  COMPLETED: ['RECOVERING'],
  FAILED: ['RECOVERING', 'CANCELLED'],
  CANCELLED: [],
};

export class KernelStateMachine {
  private currentState: KernelState = 'CREATED';

  getState(): KernelState {
    return this.currentState;
  }

  canTransition(next: KernelState): boolean {
    return validTransitions[this.currentState]?.includes(next) ?? false;
  }

  transition(next: KernelState): void {
    if (!this.canTransition(next)) {
      throw new LifecycleError(
        `Cannot transition from ${this.currentState} to ${next}`,
        'kernel-state',
      );
    }
    this.currentState = next;
  }
}
