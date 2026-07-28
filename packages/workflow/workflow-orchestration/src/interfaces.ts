/**
 * @module workflow-orchestration/interfaces
 * @description Types for Autonomous Workflow Execution & Multi-Goal Orchestration.
 */

export type WorkflowState =
  | 'CREATED'
  | 'BUILDING'
  | 'VALIDATING'
  | 'READY'
  | 'SCHEDULING'
  | 'DISPATCHING'
  | 'EXECUTING'
  | 'MONITORING'
  | 'CHECKPOINTING'
  | 'REPLANNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED'
  | 'CANCELLED';

export interface WorkflowGraph {
  id: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  checksum: string;
  timestamp: Date;
}

export interface WorkflowNode {
  id: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'barrier' | 'split' | 'merge' | 'checkpoint';
  taskId: string;
  metadata: Record<string, unknown>;
}

export interface WorkflowEdge {
  source: string;
  target: string;
  condition?: string;
  weight: number;
}

export interface WorkflowTask {
  id: string;
  goalId: string;
  workflowId: string;
  type: string;
  payload: Record<string, unknown>;
  priority: number;
  timeout: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'CANCELLED' | 'RECOVERED';
  retries: number;
  maxRetries: number;
  timestamp: Date;
}

export interface WorkflowCheckpoint {
  id: string;
  workflowId: string;
  taskStates: Record<string, string>;
  timestamp: Date;
  checksum: string;
}

export interface WorkflowBudget {
  maxTokens: number;
  maxTimeMs: number;
  maxCost: number;
  maxConcurrentTasks: number;
}

export interface ResourceAllocation {
  id: string;
  type: 'cpu' | 'memory' | 'worker' | 'token' | 'budget' | 'execution';
  capacity: number;
  used: number;
  expiresAt: Date;
}

export interface GoalConflict {
  id: string;
  type: 'resource' | 'dependency' | 'budget' | 'priority' | 'execution';
  goalIds: string[];
  description: string;
  resolution: string;
}

export interface WorkflowHook {
  beforeWorkflow?: (workflowId: string) => Promise<void>;
  afterWorkflow?: (workflowId: string, result: unknown) => Promise<void>;
  beforeExecution?: (taskId: string) => Promise<void>;
  afterExecution?: (taskId: string, result: unknown) => Promise<void>;
  beforeDispatch?: (taskId: string) => Promise<void>;
  afterDispatch?: (taskId: string, result: unknown) => Promise<void>;
  beforeReplanning?: (workflowId: string) => Promise<void>;
  afterReplanning?: (workflowId: string, plan: unknown) => Promise<void>;
  beforeConflictResolution?: (conflictId: string) => Promise<void>;
  afterConflictResolution?: (conflictId: string, resolution: string) => Promise<void>;
}
