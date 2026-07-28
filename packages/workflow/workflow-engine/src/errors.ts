/**
 * @module workflow-engine/errors
 * @description Error types for Workflow Engine.
 */

export class WorkflowError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WorkflowCompilationError extends WorkflowError {
  constructor(message: string) {
    super(message, 'WORKFLOW_COMPILATION_ERROR');
  }
}

export class WorkflowValidationError extends WorkflowError {
  constructor(message: string) {
    super(message, 'WORKFLOW_VALIDATION_ERROR');
  }
}

export class CycleDetectedError extends WorkflowError {
  constructor(message: string = 'Cycle detected in workflow graph') {
    super(message, 'CYCLE_DETECTED');
  }
}

export class DeadlockDetectedError extends WorkflowError {
  constructor(message: string = 'Deadlock detected in workflow execution') {
    super(message, 'DEADLOCK_DETECTED');
  }
}

export class NodeNotFoundError extends WorkflowError {
  constructor(nodeId: string) {
    super(`Node not found: ${nodeId}`, 'NODE_NOT_FOUND');
  }
}

export class WorkflowExecutionError extends WorkflowError {
  constructor(nodeId: string, reason: string) {
    super(`Execution failed at node ${nodeId}: ${reason}`, 'WORKFLOW_EXECUTION_ERROR');
  }
}

export class WorkflowTimeoutError extends WorkflowError {
  constructor(workflowId: string, timeoutMs: number) {
    super(`Workflow ${workflowId} timed out after ${timeoutMs}ms`, 'WORKFLOW_TIMEOUT');
  }
}

export class SnapshotError extends WorkflowError {
  constructor(message: string) {
    super(message, 'SNAPSHOT_ERROR');
  }
}

export class ResumeError extends WorkflowError {
  constructor(message: string) {
    super(message, 'RESUME_ERROR');
  }
}
