/**
 * @module reasoning-algorithms/confidence-calculator
 * @description Computes reasoning confidence matrix.
 */

import { OutOfRangeConfidenceError } from './errors.js';

export class ConfidenceCalculator {
  calculate(metrics: {
    evidenceCount: number;
    conflictCount: number;
    missingFactsCount: number;
    contradictionsCount: number;
  }): number {
    const raw =
      metrics.evidenceCount * 20 -
      metrics.conflictCount * 15 -
      metrics.missingFactsCount * 10 -
      metrics.contradictionsCount * 25;
    const score = Math.max(0, Math.min(100, raw));

    if (score < 0 || score > 100) {
      throw new OutOfRangeConfidenceError(
        `Calculated confidence ${score} out of bounds`,
        'confidence-calculator',
      );
    }

    return score;
  }
}
