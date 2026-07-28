/**
 * @module goal-intelligence/decision-validator
 * @description Validates decisions before execution.
 */

import type { DecisionChoice } from './interfaces.js';
import { DecisionError } from './errors.js';

export class DecisionValidator {
  validate(choice: DecisionChoice): void {
    if (!choice.id || !choice.strategy) {
      throw new DecisionError('Decision choice missing required fields', 'decision-validator');
    }
    if (choice.safety === 'UNSAFE') {
      throw new DecisionError('UNSAFE decisions are not allowed', 'decision-validator');
    }
  }
}
