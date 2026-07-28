/**
 * @module coordinator/interfaces
 * @description Interfaces and types for the Production Execution Coordinator.
 */

export interface CoordinatorConfig {
  maxParallelExecutions: number;
  maxQueueSize: number;
  defaultTimeoutMs: number;
  retryBudget: number;
  tokenBudget: number;
  costBudget: number;
}

export interface CoordinatorSession {
  id: string;
  traceId: string;
  correlationId: string;
  goal: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  startedAt: Date;
  metadata: Record<string, unknown>;
}

export type ExecutionCoordinatorState =
  | 'CREATED'
  | 'INITIALIZING'
  | 'READY'
  | 'SCHEDULING'
  | 'DISPATCHING'
  | 'EXECUTING'
  | 'WAITING_APPROVAL'
  | 'RECOVERING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface ExecutionCoordinatorMetrics {
  executionTimeMs: number;
  queueTimeMs: number;
  totalExecutions: number;
  activeExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  cancelledExecutions: number;
  retryCount: number;
  recoveryCount: number;
}

export type ExecutionPhase = 'PLANNING' | 'WORKFLOW' | 'AGENT' | 'APPROVAL' | 'TOOL' | 'COMPLETION';

export interface ExecutionTicket {
  id: string;
  sessionId: string;
  phase: ExecutionPhase;
  priority: number;
  status: 'PENDING' | 'RESERVED' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
}

export interface ExecutionSchedule {
  ticketId: string;
  scheduledAt: Date;
  estimatedDurationMs: number;
  priority: number;
}

export interface ExecutionBatch {
  id: string;
  tickets: ExecutionTicket[];
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
}

export interface ExecutionReservation {
  id: string;
  type: 'worker' | 'token' | 'provider' | 'tool' | 'memory' | 'cost';
  capacity: number;
  used: number;
  expiresAt: Date;
}

export interface CoordinatorAuditRecord {
  id: string;
  timestamp: Date;
  sessionId: string;
  traceId: string;
  action: string;
  phase: ExecutionPhase;
  result: 'success' | 'failure' | 'cancelled';
  metadata: Record<string, unknown>;
}

export interface CoordinatorHook {
  name: string;
  beforeExecution?: (session: CoordinatorSession) => Promise<void>;
  afterExecution?: (session: CoordinatorSession, result: unknown) => Promise<void>;
  onDispatch?: (session: CoordinatorSession, phase: ExecutionPhase) => Promise<void>;
  onRetry?: (session: CoordinatorSession, phase: ExecutionPhase, attempt: number) => Promise<void>;
}

export interface CoordinatorHealthStatus {
  component: string;
  healthy: boolean;
  details: Record<string, unknown>;
}

export interface CoordinatorSnapshot {
  state: ExecutionCoordinatorState;
  metrics: ExecutionCoordinatorMetrics;
  timestamp: Date;
  reservations: ExecutionReservation[];
}

export interface CoordinatorStatistics {
  uptimeMs: number;
  totalSessions: number;
  averageExecutionTimeMs: number;
  currentQueueSize: number;
}
