/**
 * @module cognitive-kernel/errors
 * @description Error classes for Cognitive Kernel operations.
 */

export class KernelError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'KernelError';
  }
}

export class SessionError extends KernelError {
  constructor(message: string, source: string) {
    super(message, 'SESSION_ERROR', source);
    this.name = 'SessionError';
  }
}

export class CheckpointError extends KernelError {
  constructor(message: string, source: string) {
    super(message, 'CHECKPOINT_ERROR', source);
    this.name = 'CheckpointError';
  }
}

export class LifecycleError extends KernelError {
  constructor(message: string, source: string) {
    super(message, 'LIFECYCLE_ERROR', source);
    this.name = 'LifecycleError';
  }
}

export class SchedulerError extends KernelError {
  constructor(message: string, source: string) {
    super(message, 'SCHEDULER_ERROR', source);
    this.name = 'SchedulerError';
  }
}

export class DispatcherError extends KernelError {
  constructor(message: string, source: string) {
    super(message, 'DISPATCHER_ERROR', source);
    this.name = 'DispatcherError';
  }
}
