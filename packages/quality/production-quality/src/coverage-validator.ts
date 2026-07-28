/**
 * @module production-quality/coverage-validator
 * @description Validates coverage thresholds against strict M4 requirements.
 */

import type { CoverageReport, ValidationResult } from './interfaces.js';
import { QualityGateError } from './errors.js';

export class CoverageValidator {
  validate(report: CoverageReport): ValidationResult {
    const failures: string[] = [];

    if (report.statements < 99) {
      failures.push(`Statements coverage ${report.statements}% below required 99%`);
    }
    if (report.branches < 95) {
      failures.push(`Branches coverage ${report.branches}% below required 95%`);
    }
    if (report.functions < 100) {
      failures.push(`Functions coverage ${report.functions}% below required 100%`);
    }
    if (report.lines < 99) {
      failures.push(`Lines coverage ${report.lines}% below required 99%`);
    }

    if (failures.length > 0) {
      throw new QualityGateError(
        `Coverage thresholds not satisfied: ${failures.join(', ')}`,
        'coverage-validator',
      );
    }

    return {
      passed: true,
      score: 100,
      failures: [],
    };
  }
}
