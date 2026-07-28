/**
 * @module cognitive-contracts/memory-strategy
 * @description Memory策略 contract base implementation.
 */

import type { IMemoryStrategy } from './contracts.js';
import type { MemoryRetrievalStrategy, MemoryUpdateStrategy } from './interfaces.js';

export class MemoryStrategyBase implements IMemoryStrategy {
  async retrieve(_query: string, _strategy: MemoryRetrievalStrategy): Promise<unknown[]> {
    return [];
  }

  async update(_key: string, _value: unknown, _strategy: MemoryUpdateStrategy): Promise<void> {}
}
