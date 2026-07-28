/**
 * @module reasoning-framework/pipeline-budget
 * @description Manages token and time budgets.
 */

import type { PipelineBudget } from './interfaces.js';

export class PipelineBudgetManager {
  private budget: PipelineBudget;

  constructor(maxTokens: number, maxDurationMs: number) {
    this.budget = {
      tokensUsed: 0,
      maxTokens,
      durationMs: 0,
      maxDurationMs,
    };
  }

  consume(tokens: number, durationMs: number): void {
    if (this.budget.tokensUsed + tokens > this.budget.maxTokens) {
      throw new Error('Token budget exceeded');
    }
    if (this.budget.durationMs + durationMs > this.budget.maxDurationMs) {
      throw new Error('Time budget exceeded');
    }
    this.budget.tokensUsed += tokens;
    this.budget.durationMs += durationMs;
  }

  getBudgetSnapshot(): PipelineBudget {
    return { ...this.budget };
  }
}
