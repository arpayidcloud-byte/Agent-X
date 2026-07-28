/**
 * @module production-quality/mutation-validator
 * @description Validates resistance against mutation tests.
 */

import type { ValidationResult } from './interfaces.js';

export class MutationValidator {
  validate(mutantsKilled: number, totalMutants: number): ValidationResult {
    const rate = totalMutants > 0 ? (mutantsKilled / totalMutants) * 100 : 100;
    return {
      passed: rate >= 90,
      score: rate,
      failures: rate < 90 ? [`Mutation kill rate ${rate}% below required 90%`] : [],
    };
  }
}
