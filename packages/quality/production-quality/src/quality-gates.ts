/**
 * @module production-quality/quality-gates
 * @description Hard limits for validating quality gates.
 */

import type { CoverageReport, ValidationResult } from './interfaces.js';
import { CoverageValidator } from './coverage-validator.js';

export class QualityGates {
  private coverageValidator = new CoverageValidator();

  validate(report: CoverageReport): ValidationResult {
    return this.coverageValidator.validate(report);
  }
}
