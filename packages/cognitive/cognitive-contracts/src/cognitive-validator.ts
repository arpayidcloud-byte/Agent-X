/**
 * @module cognitive-contracts/cognitive-validator
 * @description Cognitive operation constraint validator.
 */

import type { ThinkingSession } from './interfaces.js';
import { ValidationError } from './errors.js';

export class CognitiveValidator {
  validateSession(session: ThinkingSession): void {
    if (!session.id || !session.traceId) {
      throw new ValidationError('Session missing mandatory identifiers', 'validator');
    }
  }
}
