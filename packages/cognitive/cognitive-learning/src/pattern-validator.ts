/**
 * @module cognitive-learning/pattern-validator
 * @description Rejects invalid patterns.
 */

import type { Pattern } from './interfaces.js';
import { InvalidPatternError } from './errors.js';

export class PatternValidator {
  validate(pattern: Pattern): void {
    if (!pattern.id || !pattern.type) {
      throw new InvalidPatternError('Pattern missing mandatory fields', 'pattern-validator');
    }
    if (pattern.occurrenceCount < 1) {
      throw new InvalidPatternError(
        'Pattern must have positive occurrence count',
        'pattern-validator',
      );
    }
  }
}
