/**
 * @module cognitive-kernel/kernel-budget
 * @description Limits token consumption across all cognitive engines.
 */

import type { BudgetSnapshot } from './interfaces.js';

export class KernelBudgetManager {
  private budget: BudgetSnapshot;

  constructor(maxGlobalTokens: number) {
    this.budget = {
      inputTokens: 0,
      outputTokens: 0,
      thinkingTokens: 0,
      reasoningTokens: 0,
      reflectionTokens: 0,
      planningTokens: 0,
      memoryTokens: 0,
      toolTokens: 0,
      globalTokens: 0,
      maxGlobalTokens,
    };
  }

  consumeTokens(type: keyof Omit<BudgetSnapshot, 'maxGlobalTokens'>, amount: number): void {
    if (this.budget.globalTokens + amount > this.budget.maxGlobalTokens) {
      throw new Error('Global token budget exceeded');
    }
    this.budget[type] += amount;
    this.budget.globalTokens += amount;
  }

  getSnapshot(): BudgetSnapshot {
    return { ...this.budget };
  }
}
