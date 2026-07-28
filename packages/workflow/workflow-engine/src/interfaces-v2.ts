/**
 * @module workflow-engine/interfaces-v2
 * @description Extended interfaces for Workflow Engine hardening.
 * These interfaces extend M3.1 without breaking existing API.
 */

import type {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowState,
  NodeState,
  WorkflowMetrics,
  ExecutionSnapshot,
  Checkpoint,
} from './interfaces.js';

/** @description Execution planner output */
export interface ExecutionPlan {
  workflowId: string;
  batches: ExecutionBatch[];
  criticalPath: string[];
  estimatedTotalDurationMs: number;
  parallelismLevel: number;
  resourceAllocation: ResourceAllocationPlan;
}

/** @description Execution batch */
export interface ExecutionBatch {
  batchIndex: number;
  nodeIds: string[];
  estimatedDurationMs: number;
  canRunInParallel: boolean;
}

/** @description Resource allocation plan */
export interface ResourceAllocationPlan {
  maxConcurrent: number;
  estimatedTokens: number;
  estimatedCostUsd: number;
  criticalPathLength: number;
}

/** @description Retry budget */
export interface RetryBudget {
  maxRetries: number;
  usedRetries: number;
  remainingRetries: number;
}

/** @description Retry decision */
export interface RetryDecision {
  shouldRetry: boolean;
  attempt: number;
  delayMs: number;
  reason: string;
}

/** @description Backoff policy */
export interface BackoffPolicy {
  type: 'exponential' | 'linear' | 'constant';
  baseDelayMs: number;
  multiplier: number;
  maxDelayMs: number;
}

/** @description Execution timeline entry */
export interface ExecutionTimelineEntry {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  startedAt: Date;
  finishedAt: Date | null;
  durationMs: number;
  retries: number;
  agent?: string;
  tool?: string;
  approval?: string;
  status: NodeState;
}

/** @description Workflow hook */
export interface WorkflowHook {
  name: string;
  beforeWorkflow?: (workflow: WorkflowDefinition) => Promise<void>;
  afterWorkflow?: (workflow: WorkflowDefinition, metrics: WorkflowMetrics) => Promise<void>;
  beforeNode?: (node: WorkflowNode) => Promise<void>;
  afterNode?: (node: WorkflowNode, result: unknown) => Promise<void>;
  onRetry?: (node: WorkflowNode, attempt: number) => Promise<void>;
  onFailure?: (node: WorkflowNode, error: Error) => Promise<void>;
  onCheckpoint?: (checkpoint: Checkpoint) => Promise<void>;
  onMetrics?: (metrics: WorkflowMetrics) => Promise<void>;
}

/** @description Replay mode */
export type ReplayMode = 'debug' | 'step' | 'node' | 'workflow';

/** @description Replay snapshot */
export interface ReplaySnapshot {
  step: number;
  timestamp: Date;
  state: WorkflowState;
  nodeStates: Map<string, NodeState>;
  results: Map<string, unknown>;
}

/** @description Replay history */
export interface ReplayHistory {
  workflowId: string;
  snapshots: ReplaySnapshot[];
  totalSteps: number;
}

/** @description Critical path analysis result */
export interface CriticalPathAnalysis {
  workflowId: string;
  longestChain: string[];
  longestChainLength: number;
  parallelEfficiency: number;
  estimatedBottlenecks: string[];
  idleTime: number;
}

/** @description Extended execution snapshot with versioning */
export interface VersionedExecutionSnapshot extends ExecutionSnapshot {
  schemaVersion: string;
  workflowVersion: number;
  engineVersion: string;
  snapshotVersion: number;
  createdBy: string;
  checksum: string;
}

/** @description Extended workflow metrics */
export interface ExtendedWorkflowMetrics extends WorkflowMetrics {
  executionTimeMs: number;
  queueTimeMs: number;
  parallelismLevel: number;
  criticalPathLength: number;
  approvalCount: number;
  toolCalls: number;
  agentCalls: number;
  cancelledNodes: number;
  checkpointCount: number;
  averageNodeTime: number;
  resourceUsage: {
    tokens: number;
    costUsd: number;
    providers: number;
  };
}

/** @description Node executor interface */
export interface INodeExecutor {
  executeToolNode(node: WorkflowNode, context: Record<string, unknown>): Promise<unknown>;
  executeAgentNode(node: WorkflowNode, context: Record<string, unknown>): Promise<unknown>;
  executeApprovalNode(node: WorkflowNode, context: Record<string, unknown>): Promise<unknown>;
  executeParallelNode(node: WorkflowNode, context: Record<string, unknown>): Promise<unknown>;
  executeLoopNode(node: WorkflowNode, context: Record<string, unknown>): Promise<unknown>;
  executeConditionalNode(node: WorkflowNode, context: Record<string, unknown>): Promise<unknown>;
}

/** @description Execution planner interface */
export interface IExecutionPlanner {
  plan(workflow: WorkflowDefinition): ExecutionPlan;
  calculateCriticalPath(workflow: WorkflowDefinition): string[];
  estimateParallelism(workflow: WorkflowDefinition): number;
}

/** @description Retry coordinator interface */
export interface IRetryCoordinator {
  shouldRetry(nodeId: string, error: Error, attempt: number): RetryDecision;
  getRetryBudget(nodeId: string): RetryBudget;
  recordAttempt(nodeId: string): void;
  resetBudgets(): void;
}

/** @description Execution replay interface */
export interface IExecutionReplay {
  startReplay(workflowId: string, mode: ReplayMode): Promise<ReplayHistory>;
  getSnapshot(workflowId: string, step: number): Promise<ReplaySnapshot | undefined>;
  stepForward(workflowId: string): Promise<ReplaySnapshot>;
}

/** @description Critical path analyzer interface */
export interface ICriticalPathAnalyzer {
  analyze(workflow: WorkflowDefinition): CriticalPathAnalysis;
}
