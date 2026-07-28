/**
 * @module production-quality/failure-validator
 * @description Validates testing of all fail-closed paths.
 */

import type { ValidationResult } from './interfaces.js';

export class FailurePathValidator {
  validate(testedFailures: string[]): ValidationResult {
    const requiredFailures = [
      'ProviderFailure',
      'WorkflowFailure',
      'AgentCrash',
      'ToolFailure',
      'QueueFailure',
      'StorageFailure',
      'LockFailure',
    ];

    const missing = requiredFailures.filter((c) => !testedFailures.includes(c));

    return {
      passed: missing.length === 0,
      score: missing.length === 0 ? 100 : Math.max(0, 100 - missing.length * 15),
      failures: missing.length > 0 ? [`Missing failure path tests: ${missing.join(', ')}`] : [],
    };
  }
}
