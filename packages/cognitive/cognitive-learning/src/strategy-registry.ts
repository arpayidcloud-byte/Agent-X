/**
 * @module cognitive-learning/strategy-registry
 * @description Immutable registry of reasoning strategies.
 */

import type { StrategyRecord } from './interfaces.js';

export class StrategyRegistry {
  private strategies = new Map<string, StrategyRecord>();

  register(strategy: StrategyRecord): void {
    this.strategies.set(strategy.id, strategy);
  }

  get(id: string): StrategyRecord | undefined {
    return this.strategies.get(id);
  }

  getAll(): StrategyRecord[] {
    return Array.from(this.strategies.values());
  }
}
