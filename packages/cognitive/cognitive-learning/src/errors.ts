/**
 * @module cognitive-learning/errors
 * @description Error classes for cognitive learning.
 */

export class LearningError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'LearningError';
  }
}

export class LearningStateError extends LearningError {
  constructor(message: string, source: string) {
    super(message, 'LEARNING_STATE_ERROR', source);
    this.name = 'LearningStateError';
  }
}

export class InvalidExperienceError extends LearningError {
  constructor(message: string, source: string) {
    super(message, 'INVALID_EXPERIENCE', source);
    this.name = 'InvalidExperienceError';
  }
}

export class InvalidPatternError extends LearningError {
  constructor(message: string, source: string) {
    super(message, 'INVALID_PATTERN', source);
    this.name = 'InvalidPatternError';
  }
}

export class AdaptationError extends LearningError {
  constructor(message: string, source: string) {
    super(message, 'ADAPTATION_ERROR', source);
    this.name = 'AdaptationError';
  }
}

export class CheckpointError extends LearningError {
  constructor(message: string, source: string) {
    super(message, 'CHECKPOINT_ERROR', source);
    this.name = 'CheckpointError';
  }
}
