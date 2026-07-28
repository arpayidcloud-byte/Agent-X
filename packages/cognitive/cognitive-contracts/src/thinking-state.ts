/**
 * @module cognitive-contracts/thinking-state
 * @description Thinking state contract base implementation.
 */

import type { ThinkingState } from './interfaces.js';

export class ThinkingStateBase {
  private state: ThinkingState;

  constructor(state: ThinkingState) {
    this.state = state;
  }

  getState(): ThinkingState {
    return { ...this.state };
  }
}
