/**
 * @module workflow-orchestration/errors
 * @description Error classes for workflow orchestration.
 */

export class WorkflowError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'WorkflowError';
  }
}

export class WorkflowStateError extends WorkflowError {
  constructor(message: string, source: string) {
    super(message, 'WORKFLOW_STATE_ERROR', source);
    this.name = 'WorkflowStateError';
  }
}

export class WorkflowValidationError extends WorkflowError {
  constructor(message: string, source: string) {
    super(message, 'WORKFLOW_VALIDATION_ERROR', source);
    this.name = 'WorkflowValidationError';
  }
}

export class WorkflowExecutionError extends WorkflowError {
  constructor(message: string, source: string) {
    super(message, 'WORKFLOW_EXECUTION_ERROR', source);
    this.name = 'WorkflowExecutionError';
  }
}

export class ResourceExhaustedError extends WorkflowError {
  constructor(message: string, source: string) {
    super(message, 'RESOURCE_EXHAUSTED', source);
    this.name = 'ResourceExhaustedError';
  }
}

export class ConflictError extends WorkflowError {
  constructor(message: string, source: string) {
    super(message, 'CONFLICT_ERROR', source);
    this.name = 'ConflictError';
  }
}

export class ReplanningError extends WorkflowError {
  constructor(message: string, source: string) {
    super(message, 'REPLANNING_ERROR', source);
    this.name = 'ReplanningError';
  }
}
