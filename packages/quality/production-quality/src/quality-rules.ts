/**
 * @module production-quality/quality-rules
 * @description Evaluates combined grades and scores.
 */

import type { ValidationScore, QualityGrade } from './interfaces.js';

export class QualityRules {
  getGrade(score: number): QualityGrade {
    if (score >= 100) return 'Production Elite';
    if (score >= 95) return 'Production Ready';
    if (score >= 90) return 'Enterprise Ready';
    if (score >= 80) return 'Stable';
    if (score >= 70) return 'Beta';
    return 'Rejected';
  }

  calculateScore(results: { [key: string]: number }): ValidationScore {
    const arr = Object.values(results);
    const overall = arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      coverageScore: results.coverage || 0,
      deterministicScore: results.deterministic || 0,
      resourceScore: results.resource || 0,
      dependencyScore: results.dependency || 0,
      timeoutScore: results.timeout || 0,
      retryScore: results.retry || 0,
      observabilityScore: results.observability || 0,
      architectureScore: results.architecture || 0,
      riskScore: 100 - overall,
      overallScore: overall,
    };
  }
}
