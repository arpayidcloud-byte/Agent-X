/**
 * @module provider-qualification/provider-score
 * @description Scoring matrix calculation.
 */

import type { QualificationScore } from './interfaces.js';

export class ProviderScoreCalculator {
  calculate(components: {
    contract: number;
    compatibility: number;
    performance: number;
    reliability: number;
    security: number;
  }): QualificationScore {
    const overall =
      (components.contract +
        components.compatibility +
        components.performance +
        components.reliability +
        components.security) /
      5;

    return {
      contractScore: components.contract,
      compatibilityScore: components.compatibility,
      performanceScore: components.performance,
      reliabilityScore: components.reliability,
      securityScore: components.security,
      overallScore: overall,
    };
  }
}
