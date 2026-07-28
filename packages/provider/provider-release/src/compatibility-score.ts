/**
 * @module provider-release/compatibility-score
 * @description Evaluates provider overall operational capability score.
 */

import type { CompatibilityScore } from './interfaces.js';

export class CompatibilityScoreCalculator {
  calculate(metrics: {
    api: number;
    runtime: number;
    feature: number;
    performance: number;
    security: number;
  }): CompatibilityScore {
    const overall =
      (metrics.api + metrics.runtime + metrics.feature + metrics.performance + metrics.security) /
      5;

    return {
      api: metrics.api,
      runtime: metrics.runtime,
      feature: metrics.feature,
      performance: metrics.performance,
      security: metrics.security,
      overall,
    };
  }
}
