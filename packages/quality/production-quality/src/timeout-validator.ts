/**
 * @module production-quality/timeout-validator
 * @description Validates strict timeout enforcement across components.
 */

import type { ValidationResult } from './interfaces.js';

export class TimeoutValidator {
  validate(
    testRuns: { component: string; durationMs: number; timeoutMs: number }[],
  ): ValidationResult {
    const failures: string[] = [];

    for (const run of testRuns) {
      if (run.durationMs > run.timeoutMs) {
        failures.push(
          `${run.component} execution time ${run.durationMs}ms exceeded timeout ${run.timeoutMs}ms`,
        );
      }
    }

    return {
      passed: failures.length === 0,
      score: failures.length === 0 ? 100 : Math.max(0, 100 - failures.length * 10),
      failures,
    };
  }
}
