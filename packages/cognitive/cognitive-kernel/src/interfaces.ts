/**
 * @module cognitive-kernel/interfaces
 * @description Core contracts for Cognitive Intelligence Kernel orchestration.
 */

export interface KernelConfig {
  maxThinkingTimeMs: number;
  maxReasoningDepth: number;
  retryBudget: number;
  checkpointIntervalMs: number;
}

export interface SessionMetadata {
  sessionId: string;
  traceId: string;
  correlationId: string;
  goalId: string;
  startedAt: Date;
  metadata: Record<string, unknown>;
}

export interface CheckpointMetadata {
  id: string;
  sessionId: string;
  timestamp: Date;
  checksum: string;
}

export interface SessionCheckpoint {
  metadata: CheckpointMetadata;
  snapshot: Record<string, unknown>;
}

export interface BudgetSnapshot {
  inputTokens: number;
  outputTokens: number;
  thinkingTokens: number;
  reasoningTokens: number;
  reflectionTokens: number;
  planningTokens: number;
  memoryTokens: number;
  toolTokens: number;
  globalTokens: number;
  maxGlobalTokens: number;
}

export interface AuditRecord {
  id: string;
  traceId: string;
  sessionId: string;
  action: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
  checksum: string;
}

export type KernelState =
  | 'CREATED'
  | 'INITIALIZING'
  | 'READY'
  | 'WAITING'
  | 'THINKING'
  | 'REASONING'
  | 'REFLECTING'
  | 'PLANNING'
  | 'WAITING_APPROVAL'
  | 'DECISION'
  | 'EXECUTING'
  | 'CHECKPOINTING'
  | 'RECOVERING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface KernelHook {
  beforeKernelStart?: () => Promise<void>;
  afterKernelStart?: () => Promise<void>;
  beforeThinking?: (sessionId: string) => Promise<void>;
  afterThinking?: (sessionId: string, result: unknown) => Promise<void>;
  beforeCheckpoint?: (sessionId: string) => Promise<void>;
  afterCheckpoint?: (sessionId: string, checkpoint: SessionCheckpoint) => Promise<void>;
  onRecovery?: (sessionId: string) => Promise<void>;
  onFailure?: (sessionId: string, error: Error) => Promise<void>;
}

export interface EngineContract {
  id: string;
  name: string;
  execute(input: unknown): Promise<unknown>;
}
