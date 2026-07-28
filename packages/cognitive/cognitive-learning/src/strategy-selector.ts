/**
 * @module cognitive-learning/strategy-selector
 * @description Selects optimal symbolic strategy based on history and patterns.
 */

import type { Pattern, StrategyRecord } from './interfaces.js';
import { LearningError } from './errors.js';

export class StrategySelector {
  select(patterns: Pattern[], strategies: StrategyRecord[]): StrategyRecord {
    if (strategies.length === 0) {
      throw new LearningError(
        'No strategies available for selection',
        'STRATEGY_EMPTY',
        'strategy-selector',
      );
    }

    const failurePatterns = patterns.filter((p) => p.type === 'repeated_failure');

    if (failurePatterns.length > 0) {
      const candidate = strategies.find((s) => s.confidence > 70);
      return candidate || (strategies[0] as StrategyRecord);
    }

    const best = [...strategies].sort((a, b) => b.confidence - a.confidence);
    return best[0] as StrategyRecord;
  }
}
