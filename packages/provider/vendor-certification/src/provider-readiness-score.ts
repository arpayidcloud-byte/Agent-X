/**
 * @module vendor-certification/provider-readiness-score
 * @description Calculates overall readiness score.
 */

import type { ReadinessScore } from './interfaces.js';

export class ProviderReadinessScore {
  calculate(scores: {
    performance: number;
    reliability: number;
    availability: number;
    recovery: number;
    security: number;
    resourceEfficiency: number;
    compatibility: number;
    maintainability: number;
    documentation: number;
    observability: number;
  }): ReadinessScore {
    const overall =
      (scores.performance +
        scores.reliability +
        scores.availability +
        scores.recovery +
        scores.security +
        scores.resourceEfficiency +
        scores.compatibility +
        scores.maintainability +
        scores.documentation +
        scores.observability) /
      10;

    return { ...scores, overall };
  }
}
