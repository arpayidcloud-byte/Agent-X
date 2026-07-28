/**
 * @module runtime-production/errors
 * @description Error classes for Production Infrastructure.
 */

export class ProductionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'ProductionError';
  }
}

export class DistributedLockError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'DISTRIBUTED_LOCK_ERROR', source);
    this.name = 'DistributedLockError';
  }
}

export class IdempotencyError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'IDEMPOTENCY_ERROR', source);
    this.name = 'IdempotencyError';
  }
}

export class QueueError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'QUEUE_ERROR', source);
    this.name = 'QueueError';
  }
}

export class LeaseError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'LEASE_ERROR', source);
    this.name = 'LeaseError';
  }
}

export class WorkerRegistryError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'WORKER_REGISTRY_ERROR', source);
    this.name = 'WorkerRegistryError';
  }
}

export class ClusterError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'CLUSTER_ERROR', source);
    this.name = 'ClusterError';
  }
}

export class BackpressureError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'BACKPRESSURE_ERROR', source);
    this.name = 'BackpressureError';
  }
}

export class CircuitOpenError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'CIRCUIT_OPEN_ERROR', source);
    this.name = 'CircuitOpenError';
  }
}

export class ShutdownError extends ProductionError {
  constructor(message: string, source: string) {
    super(message, 'SHUTDOWN_ERROR', source);
    this.name = 'ShutdownError';
  }
}
