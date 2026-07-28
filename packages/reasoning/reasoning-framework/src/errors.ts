/**
 * @module reasoning-framework/errors
 * @description Error classes for Reasoning Framework operations.
 */

export class ReasoningError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'ReasoningError';
  }
}

export class PipelineError extends ReasoningError {
  constructor(message: string, source: string) {
    super(message, 'PIPELINE_ERROR', source);
    this.name = 'PipelineError';
  }
}

export class StrategyError extends ReasoningError {
  constructor(message: string, source: string) {
    super(message, 'STRATEGY_ERROR', source);
    this.name = 'StrategyError';
  }
}

export class GraphIntegrityError extends ReasoningError {
  constructor(message: string, source: string) {
    super(message, 'GRAPH_INTEGRITY_ERROR', source);
    this.name = 'GraphIntegrityError';
  }
}

export class ValidationError extends ReasoningError {
  constructor(message: string, source: string) {
    super(message, 'VALIDATION_ERROR', source);
    this.name = 'ValidationError';
  }
}

export class CheckpointError extends ReasoningError {
  constructor(message: string, source: string) {
    super(message, 'CHECKPOINT_ERROR', source);
    this.name = 'CheckpointError';
  }
}

export class SchedulerError extends ReasoningError {
  constructor(message: string, source: string) {
    super(message, 'SCHEDULER_ERROR', source);
    this.name = 'SchedulerError';
  }
}
