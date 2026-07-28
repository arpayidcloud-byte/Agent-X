/**
 * @module cognitive-learning/feedback-validator
 * @description Validates feedback records.
 */

import type { Feedback } from './interfaces.js';
import { InvalidExperienceError } from './errors.js';

export class FeedbackValidator {
  validate(feedback: Feedback): void {
    if (!feedback.id || !feedback.sessionId) {
      throw new InvalidExperienceError(
        'Feedback missing mandatory identifiers',
        'feedback-validator',
      );
    }
  }
}
