/**
 * @module production-quality/race-condition-validator
 * @description Analyzes execution for potential race conditions.
 */

import type { ValidationResult } from './interfaces.js';

export class RaceConditionValidator {
  validate(parallelRunResults: boolean[]): ValidationResult {
    const failed = parallelRunResults.filter((r) => !r).length;
    return {
      passed: failed === 0,
      score: failed === 0 ? 100 : Math.max(0, 100 - failed * 20),
      failures: failed > 0 ? [`Race conditions detected: ${failed} parallel runs failed`] : [],
    };
  }
}
