/**
 * @module reasoning-framework/interfaces
 * @description Type mappings for Reasoning Framework (RFW) M5.1 contracts.
 */

export type PipelineStageName =
  | 'INPUT'
  | 'NORMALIZATION'
  | 'CONTEXT_BUILD'
  | 'GRAPH_BUILD'
  | 'VALIDATION'
  | 'READY'
  | 'EXECUTION'
  | 'CHECKPOINT'
  | 'RECOVERY'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface ReasoningSession {
  id: string;
  traceId: string;
  correlationId: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  startedAt: Date;
  metadata: Record<string, unknown>;
}

export interface ReasoningContext {
  sessionId: string;
  traceId: string;
  goalId: string;
  depth: number;
  maxDepth: number;
  metadata: Record<string, unknown>;
}

export interface ReasoningNode {
  id: string;
  label: string;
  type: 'hypothesis' | 'evidence' | 'fact' | 'conclusion';
  metadata: Record<string, unknown>;
}

export interface ReasoningEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'supports' | 'contradicts' | 'neutral';
  weight: number;
}

export interface ReasoningGraph {
  nodes: ReasoningNode[];
  edges: ReasoningEdge[];
  checksum: string;
}

export interface TreeNode {
  id: string;
  label: string;
  level: number;
  parentId?: string;
  metadata: Record<string, unknown>;
}

export interface TreeEdge {
  sourceId: string;
  targetId: string;
}

export interface TreeLevel {
  levelNumber: number;
  nodes: TreeNode[];
}

export interface TreeMetadata {
  depth: number;
  branchingFactor: number;
}

export interface ReasoningTree {
  nodes: TreeNode[];
  edges: TreeEdge[];
  metadata: TreeMetadata;
}

export interface IReasoningStrategy {
  initialize(context: ReasoningContext): Promise<void>;
  prepare(graph: ReasoningGraph): Promise<void>;
  execute(graph: ReasoningGraph): Promise<ReasoningGraph>;
  validate(graph: ReasoningGraph): Promise<boolean>;
  checkpoint(sessionId: string, snapshot: Record<string, unknown>): Promise<void>;
  recover(sessionId: string): Promise<Record<string, unknown>>;
  cleanup(): Promise<void>;
}

export interface PipelineHook {
  beforePipeline?: (sessionId: string) => Promise<void>;
  afterPipeline?: (sessionId: string, result: unknown) => Promise<void>;
  beforeStage?: (sessionId: string, stage: PipelineStageName) => Promise<void>;
  afterStage?: (sessionId: string, stage: PipelineStageName) => Promise<void>;
  onFailure?: (sessionId: string, error: Error) => Promise<void>;
  onRecovery?: (sessionId: string) => Promise<void>;
}

export interface ReasoningSnapshot {
  id: string;
  sessionId: string;
  timestamp: Date;
  snapshot: Record<string, unknown>;
  checksum: string;
}

export interface PipelineBudget {
  tokensUsed: number;
  maxTokens: number;
  durationMs: number;
  maxDurationMs: number;
}

export interface ReasoningAuditRecord {
  id: string;
  traceId: string;
  sessionId: string;
  action: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
  checksum: string;
}
