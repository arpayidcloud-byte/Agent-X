export class AgentPlatformError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResourceLimitExceededError extends AgentPlatformError {
  constructor(message: string) {
    super(message, 'RESOURCE_LIMIT_EXCEEDED');
  }
}

export class AgentHeartbeatLostError extends AgentPlatformError {
  constructor(agentId: string) {
    super(`Heartbeat lost for agent ${agentId}`, 'AGENT_HEARTBEAT_LOST');
  }
}

export class AgentFailureError extends AgentPlatformError {
  constructor(agentId: string, reason: string) {
    super(`Agent ${agentId} failed: ${reason}`, 'AGENT_FAILURE');
  }
}

export class DependencyGraphError extends AgentPlatformError {
  constructor(message: string) {
    super(message, 'DEPENDENCY_GRAPH_ERROR');
  }
}

export class MergeConflictError extends AgentPlatformError {
  constructor(message: string) {
    super(message, 'MERGE_CONFLICT_ERROR');
  }
}

export class AgentTimeoutError extends AgentPlatformError {
  constructor(agentId: string) {
    super(`Agent ${agentId} execution timed out`, 'AGENT_TIMEOUT');
  }
}
