/**
 * @module goal-intelligence/strategy-selector
 * @description Selects optimal symbolic execution strategy.
 */

import type { SubGoal } from './interfaces.js';

export interface StrategyOption {
  name: string;
  confidence: number;
  cost: number;
}

export class StrategySelector {
  select(_subgoal: SubGoal, strategies: StrategyOption[]): StrategyOption {
    if (strategies.length === 0) {
      throw new Error('No strategies available');
    }

    const sorted = [...strategies].sort((a, b) => {
      if (b.confidence !== a.confidence) return b.confidence - a.confidence;
      return a.cost - b.cost;
    });

    return sorted[0] as StrategyOption;
  }
}
