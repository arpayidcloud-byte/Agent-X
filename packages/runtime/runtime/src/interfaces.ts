/**
 * @module runtime/interfaces
 * @description Core interfaces for the Production Runtime Integration.
 */

/** @description Runtime lifecycle states */
export type RuntimeState =
  | 'CREATED'
  | 'INITIALIZING'
  | 'PLANNING'
  | 'RUNNING'
  | 'WAITING_APPROVAL'
  | 'EXECUTING'
  | 'CHECKPOINTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'RECOVERING';

/** @description Session status */
export type SessionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

/** @description Runtime session */
export interface RuntimeSession {
  id: string;
  traceId: string;
  correlationId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  status: SessionStatus;
  metrics: RuntimeMetrics;
}

/** @description Execution session */
export interface ExecutionSession {
  id: string;
  traceId: string;
  goal: string;
  planId?: string;
  workflowId?: string;
  status: SessionStatus;
  startedAt: Date;
  completedAt?: Date;
  result?: unknown;
}

/** @description Runtime configuration */
export interface RuntimeConfig {
  tokenBudget: number;
  costBudget: number;
  maxParallelAgents: number;
  maxWorkflows: number;
  maxTools: number;
  maxMemory: number;
  maxContextTokens: number;
  defaultTimeoutMs: number;
  checkpointIntervalMs: number;
}

/** @description Runtime metrics */
export interface RuntimeMetrics {
  executionTimeMs: number;
  workflowTimeMs: number;
  planningTimeMs: number;
  approvalDelayMs: number;
  agentUtilization: number;
  parallelism: number;
  memoryUsageMb: number;
  tokenUsage: number;
  providerUsage: number;
  toolUsage: number;
  successRate: number;
  retryCount: number;
  checkpointCount: number;
  queueWaitMs: number;
  criticalPathLength: number;
  estimatedCostUsd: number;
}

/** @description Audit record */
export interface AuditRecord {
  id: string;
  traceId: string;
  correlationId: string;
  sessionId: string;
  workflowId: string;
  agentId?: string;
  toolId?: string;
  approvalId?: string;
  timestamp: Date;
  durationMs: number;
  result: 'success' | 'failure' | 'cancelled';
  metadata: Record<string, unknown>;
}

/** @description Health status */
export interface HealthStatus {
  component: string;
  healthy: boolean;
  latencyMs: number;
  details?: Record<string, unknown>;
}

/** @description Resource limits */
export interface ResourceLimits {
  tokenBudget: number;
  costBudget: number;
  providerQuota: number;
  parallelLimit: number;
  agentLimit: number;
  workflowLimit: number;
  toolLimit: number;
  memoryLimit: number;
  contextLimit: number;
}

/** @description Error types */
export type ErrorSeverity =
  'recoverable' | 'non-recoverable' | 'timeout' | 'cancellation' | 'resource-limit';

export interface RuntimeError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  source: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
