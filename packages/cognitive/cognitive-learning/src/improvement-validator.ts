/**
 * @module cognitive-learning/improvement-validator
 * @description Validates that improvements are safe and deterministic.
 */

import type { Improvement } from './interfaces.js';
import { InvalidExperienceError } from './errors.js';

export class ImprovementValidator {
  validate(improvement: Improvement): void {
    if (!improvement.id || !improvement.recommendation) {
      throw new InvalidExperienceError(
        'Improvement missing mandatory fields',
        'improvement-validator',
      );
    }
    if (improvement.priority < 0) {
      throw new InvalidExperienceError('Priority must be non-negative', 'improvement-validator');
    }
  }
}
