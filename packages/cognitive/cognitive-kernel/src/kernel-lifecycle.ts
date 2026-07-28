/**
 * @module cognitive-kernel/kernel-lifecycle
 * @description Central coordinator for the kernel lifecycle transitions.
 */

import { KernelStateMachine } from './kernel-state.js';
import type { KernelState } from './interfaces.js';

export class KernelLifecycle {
  private stateMachine = new KernelStateMachine();

  transition(state: KernelState): void {
    this.stateMachine.transition(state);
  }

  getState(): KernelState {
    return this.stateMachine.getState();
  }
}
