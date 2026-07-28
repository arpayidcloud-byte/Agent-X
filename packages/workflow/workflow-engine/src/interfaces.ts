/**
 * @module workflow-engine/interfaces
 * @description Core interfaces for the Workflow Engine.
 * Implements DAG execution, approval gates, and dependency scheduling.
 */

/** @description Node types in a workflow graph */
export type NodeType =
  'task' | 'approval' | 'conditional' | 'loop' | 'parallel' | 'tool' | 'agent' | 'retry';

/** @description Workflow state */
export type WorkflowState =
  | 'CREATED'
  | 'COMPILED'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'SUSPENDED';

/** @description Node state */
export type NodeState =
  'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'WAITING_APPROVAL' | 'CANCELLED';

/** @description Workflow definition */
export interface WorkflowDefinition {
  id: string;
  name: string;
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: Record<string, unknown>;
  metadata: WorkflowMetadata;
}

/** @description Workflow metadata */
export interface WorkflowMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  traceId: string;
  taskId?: string;
  tags?: string[];
}

/** @description Workflow node */
export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: NodeConfig;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

/** @description Edge type (Vol 5 Ch. 3: retry-with-feedback routes failure back) */
export type EdgeType = 'normal' | 'retry_with_feedback' | 'on_success' | 'on_failure';

/** @description Workflow edge (dependency) */
export interface WorkflowEdge {
  source: string;
  target: string;
  condition?: string;
  edgeType?: EdgeType;
  maxReroutes?: number;
}

/** @description Node configuration (discriminated union) */
export type NodeConfig =
  | TaskNodeConfig
  | ApprovalNodeConfig
  | ConditionalNodeConfig
  | LoopNodeConfig
  | ParallelNodeConfig
  | ToolNodeConfig
  | AgentNodeConfig
  | RetryNodeConfig;

/** @description Task node config */
export interface TaskNodeConfig {
  type: 'task';
  goal: string;
  agentRole?: string;
  priority: number;
  estimatedCost?: number;
}

/** @description Approval node config */
export interface ApprovalNodeConfig {
  type: 'approval';
  riskScore: number;
  approvers?: string[];
  timeoutMs?: number;
}

/** @description Conditional node config */
export interface ConditionalNodeConfig {
  type: 'conditional';
  condition: string;
  trueBranch: string;
  falseBranch: string;
}

/** @description Loop node config */
export interface LoopNodeConfig {
  type: 'loop';
  iterator: string;
  maxIterations: number;
  body: string[];
}

/** @description Parallel node config */
export interface ParallelNodeConfig {
  type: 'parallel';
  branches: string[];
}

/** @description Tool node config */
export interface ToolNodeConfig {
  type: 'tool';
  toolName: string;
  category: string;
  arguments: Record<string, unknown>;
}

/** @description Agent node config */
export interface AgentNodeConfig {
  type: 'agent';
  role: string;
  goal: string;
  context?: Record<string, unknown>;
}

/** @description Retry node config */
export interface RetryNodeConfig {
  type: 'retry';
  targetNode: string;
  policy: RetryPolicy;
}

/** @description Retry policy */
export interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

/** @description Workflow execution snapshot */
export interface ExecutionSnapshot {
  workflowId: string;
  nodeStates: Map<string, NodeState>;
  results: Map<string, unknown>;
  timestamp: Date;
  version: number;
}

/** @description Checkpoint */
export interface Checkpoint {
  id: string;
  workflowId: string;
  snapshot: ExecutionSnapshot;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

/** @description Execution history entry */
export interface ExecutionHistoryEntry {
  workflowId: string;
  nodeId: string;
  state: NodeState;
  result?: unknown;
  error?: string;
  durationMs: number;
  startedAt: Date;
  completedAt: Date;
}

/** @description Workflow serializer */
export interface IWorkflowSerializer {
  serialize(definition: WorkflowDefinition): string;
  deserialize(data: string): WorkflowDefinition;
}

/** @description Checkpoint manager */
export interface ICheckpointManager {
  save(snapshot: ExecutionSnapshot): Promise<Checkpoint>;
  load(workflowId: string): Promise<Checkpoint | undefined>;
  list(workflowId: string): Promise<Checkpoint[]>;
  delete(checkpointId: string): Promise<void>;
}

/** @description Workflow metrics */
export interface WorkflowMetrics {
  workflowId: string;
  totalNodes: number;
  completedNodes: number;
  failedNodes: number;
  skippedNodes: number;
  totalDurationMs: number;
  nodeDurations: Map<string, number>;
  retries: number;
  errors: number;
}

/** @description Graph-level approval policy (Vol 5 Ch. 2) */
export interface WorkflowPolicy {
  requiresApprovalFor(nodeId: string, graph: WorkflowDefinition): boolean;
  getApprovalTimeout(nodeId: string): number;
  getMaxReroutes(nodeId: string): number;
}

export class DefaultWorkflowPolicy implements WorkflowPolicy {
  private approvalNodeIds: Set<string>;
  private approvalTimeoutMs: number;
  private maxReroutes: number;

  constructor(opts?: {
    approvalNodeIds?: string[];
    approvalTimeoutMs?: number;
    maxReroutes?: number;
  }) {
    this.approvalNodeIds = new Set(opts?.approvalNodeIds ?? []);
    this.approvalTimeoutMs = opts?.approvalTimeoutMs ?? 3600_000;
    this.maxReroutes = opts?.maxReroutes ?? 2;
  }

  requiresApprovalFor(nodeId: string, graph: WorkflowDefinition): boolean {
    if (this.approvalNodeIds.has(nodeId)) return true;
    const node = graph.nodes.find((n) => n.id === nodeId);
    return node?.type === 'approval';
  }

  getApprovalTimeout(_nodeId: string): number {
    return this.approvalTimeoutMs;
  }

  getMaxReroutes(_nodeId: string): number {
    return this.maxReroutes;
  }
}
