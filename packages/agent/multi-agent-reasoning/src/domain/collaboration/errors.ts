/**
 * @module multi-agent-reasoning/domain/collaboration/errors
 * @description Collaboration domain errors.
 */

export class CollaborationError extends Error {
  public readonly code: string;
  public readonly src: string;

  constructor(message: string, code: string, src: string) {
    super(message);
    this.name = 'CollaborationError';
    this.code = code;
    this.src = src;
  }
}

export class AgentError extends CollaborationError {
  constructor(message: string, src: string) {
    super(message, 'AGENT_ERROR', src);
    this.name = 'AgentError';
  }
}

export class DelegationError extends CollaborationError {
  constructor(message: string, src: string) {
    super(message, 'DELEGATION_ERROR', src);
    this.name = 'DelegationError';
  }
}

export class ConsensusError extends CollaborationError {
  constructor(message: string, src: string) {
    super(message, 'CONSENSUS_ERROR', src);
    this.name = 'ConsensusError';
  }
}

export class ConflictError extends CollaborationError {
  constructor(message: string, src: string) {
    super(message, 'CONFLICT_ERROR', src);
    this.name = 'ConflictError';
  }
}

export class SharedMemoryError extends CollaborationError {
  constructor(message: string, src: string) {
    super(message, 'SHARED_MEMORY_ERROR', src);
    this.name = 'SharedMemoryError';
  }
}

export class CircularDelegationError extends CollaborationError {
  constructor(message: string, src: string) {
    super(message, 'CIRCULAR_DELEGATION', src);
    this.name = 'CircularDelegationError';
  }
}
