/**
 * @module cognitive-contracts/context-strategy
 * @description Context strategy contract base implementation.
 */

import type { IContextStrategy } from './contracts.js';

export class ContextStrategyBase implements IContextStrategy {
  async compress(context: Record<string, unknown>): Promise<Record<string, unknown>> {
    return { ...context };
  }
}
