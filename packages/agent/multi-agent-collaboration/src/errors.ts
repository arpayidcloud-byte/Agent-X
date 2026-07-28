/**
 * @module multi-agent-collaboration/errors
 * @description Error classes for multi-agent collaboration.
 */

export class CollaborationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'CollaborationError';
  }
}

export class AgentError extends CollaborationError {
  constructor(message: string, source: string) {
    super(message, 'AGENT_ERROR', source);
    this.name = 'AgentError';
  }
}

export class DelegationError extends CollaborationError {
  constructor(message: string, source: string) {
    super(message, 'DELEGATION_ERROR', source);
    this.name = 'DelegationError';
  }
}

export class ConsensusError extends CollaborationError {
  constructor(message: string, source: string) {
    super(message, 'CONSENSUS_ERROR', source);
    this.name = 'ConsensusError';
  }
}

export class ConflictError extends CollaborationError {
  constructor(message: string, source: string) {
    super(message, 'CONFLICT_ERROR', source);
    this.name = 'ConflictError';
  }
}

export class SharedMemoryError extends CollaborationError {
  constructor(message: string, source: string) {
    super(message, 'SHARED_MEMORY_ERROR', source);
    this.name = 'SharedMemoryError';
  }
}

export class CircularDelegationError extends CollaborationError {
  constructor(message: string, source: string) {
    super(message, 'CIRCULAR_DELEGATION', source);
    this.name = 'CircularDelegationError';
  }
}
