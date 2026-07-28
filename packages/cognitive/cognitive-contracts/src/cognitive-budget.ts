/**
 * @module cognitive-contracts/cognitive-budget
 * @description Token and resource budget management contracts.
 */

import type { CognitiveBudget } from './interfaces.js';
import { BudgetExceededError } from './errors.js';

export class CognitiveBudgetManager {
  private budget: CognitiveBudget;
  private consumption: Record<string, number> = {};

  constructor(budget: CognitiveBudget) {
    this.budget = budget;
  }

  consume(type: string, amount: number): void {
    const limit = (this.budget as unknown as Record<string, number>)[type] || Infinity;
    const current = this.consumption[type] || 0;

    if (current + amount > limit) {
      throw new BudgetExceededError(
        `Budget exceeded for ${type}: ${current + amount} > ${limit}`,
        'budget-manager',
      );
    }
    this.consumption[type] = current + amount;
  }

  getConsumption(): Record<string, number> {
    return { ...this.consumption };
  }
}
