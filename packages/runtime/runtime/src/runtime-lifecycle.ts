/**
 * @module runtime/runtime-lifecycle
 * @description Runtime lifecycle management.
 */

import type { RuntimeState } from './interfaces.js';
import { RuntimeStateMachine } from './runtime-state.js';

export class RuntimeLifecycle {
  private state: RuntimeState = 'CREATED';
  private history: Array<{ state: RuntimeState; timestamp: Date }> = [];

  getState(): RuntimeState {
    return this.state;
  }

  transition(next: RuntimeState): void {
    if (!RuntimeStateMachine.canTransition(this.state, next)) {
      throw new Error(`Invalid state transition: ${this.state} -> ${next}`);
    }
    this.state = next;
    this.history.push({ state: next, timestamp: new Date() });
  }

  getHistory(): Array<{ state: RuntimeState; timestamp: Date }> {
    return [...this.history];
  }

  isTerminal(): boolean {
    return this.state === 'COMPLETED' || this.state === 'CANCELLED' || this.state === 'FAILED';
  }
}
