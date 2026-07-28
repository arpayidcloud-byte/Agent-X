/**
 * @module reasoning-framework/reasoning-context
 * @description Context management for reasoning operations.
 */

import type { ReasoningContext } from './interfaces.js';

export class ReasoningContextManager {
  private context: ReasoningContext;

  constructor(context: ReasoningContext) {
    this.context = context;
  }

  getContext(): ReasoningContext {
    return { ...this.context };
  }
}
