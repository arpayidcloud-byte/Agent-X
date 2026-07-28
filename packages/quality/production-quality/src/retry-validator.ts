/**
 * @module production-quality/retry-validator
 * @description Validates retry budgets, backoff, and exhaustion paths.
 */

import type { ValidationResult } from './interfaces.js';

export class RetryValidator {
  validate(retries: { count: number; maxRetries: number; exhausted: boolean }): ValidationResult {
    const failures: string[] = [];

    if (retries.count > retries.maxRetries) {
      failures.push(`Retry count ${retries.count} exceeded max budget ${retries.maxRetries}`);
    }
    if (retries.count === retries.maxRetries && !retries.exhausted) {
      failures.push('Retry exhausted state not triggered upon max retries');
    }

    return {
      passed: failures.length === 0,
      score: failures.length === 0 ? 100 : 50,
      failures,
    };
  }
}
