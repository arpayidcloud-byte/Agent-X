/**
 * @module cognitive-contracts/reasoning-context
 * @description Reasoning context contract base implementation.
 */

import type { ReasoningContext } from './interfaces.js';

export class ReasoningContextBase {
  private context: ReasoningContext;

  constructor(context: ReasoningContext) {
    this.context = context;
  }

  getContext(): ReasoningContext {
    return { ...this.context };
  }
}
