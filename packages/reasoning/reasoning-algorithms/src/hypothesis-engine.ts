/**
 * @module reasoning-algorithms/hypothesis-engine
 * @description Hypothesis candidate management and pruning.
 */

import type { Hypothesis } from './interfaces.js';

export class HypothesisEngine {
  rank(candidates: Hypothesis[]): Hypothesis[] {
    return [...candidates].sort((a, b) => b.confidence - a.confidence);
  }

  prune(candidates: Hypothesis[], threshold: number): Hypothesis[] {
    return candidates.filter((h) => h.confidence >= threshold);
  }
}
