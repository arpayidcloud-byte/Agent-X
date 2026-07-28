/**
 * @module sub-agents/interfaces
 * @description Interfaces for the Multi-Agent Orchestration Foundation.
 */

import type { TaskModel, TaskStatus } from '@agentx-fast/core-runtime';

export type AgentRole =
  'planner' | 'architect' | 'coder' | 'reviewer' | 'tester' | 'security' | 'documentation' | 'qa';

export interface AgentPoolConfig {
  minAgents: number;
  maxAgents: number;
  idleTimeoutMs: number;
  reuseIdleAgents: boolean;
  spawnStrategy: 'lazy' | 'eager';
}

export interface ResourceAllocation {
  estimatedCpuTimeMs: number;
  estimatedMemoryBytes: number;
  tokenBudget: number;
  costCeilingUsd: number;
  maxConcurrentProviders: number;
  maxConcurrentTools: number;
}

export interface ResourceUsage {
  cpuTimeMs: number;
  memoryBytes: number;
  tokensUsed: number;
  costUsd: number;
  activeProviders: number;
  activeTools: number;
}

export interface SubAgentHeartbeat {
  agentId: string;
  parentAgentId?: string;
  taskId: string;
  currentState: TaskStatus;
  timestamp: Date;
  memoryEstimateBytes: number;
  activeProviderId?: string;
  activeToolName?: string;
}

export interface AgentMessage {
  id: string;
  topic:
    | 'TaskAssigned'
    | 'TaskStarted'
    | 'TaskCompleted'
    | 'TaskFailed'
    | 'TaskMerged'
    | 'TaskRetried'
    | 'TaskCancelled'
    | 'AgentSpawned'
    | 'AgentDestroyed';
  senderId: string;
  receiverId?: string;
  taskId: string;
  payload: unknown;
  timestamp: Date;
}

export interface ExecutionTreeNode {
  agentId: string;
  role: AgentRole;
  state: TaskStatus;
  result?: unknown;
  budget: ResourceAllocation;
  usage: ResourceUsage;
  dependencies: string[];
  children: ExecutionTreeNode[];
}

export interface ExecutionHistoryEntry {
  timestamp: Date;
  agentId: string;
  taskId: string;
  providerId?: string;
  toolName?: string;
  approvalRequired: boolean;
  retries: number;
  result: 'success' | 'failure' | 'cancelled';
}

export interface AgentConfig {
  providerId?: string;
  promptTemplate?: string;
}

export interface AgentDefinition {
  id: string;
  role: AgentRole;
  allowedToolCategories: string[];
  systemPromptTemplateId: string;
}

export class ToolPermissionEvaluator {
  private definitions = new Map<string, AgentDefinition>();

  register(definition: AgentDefinition): void {
    this.definitions.set(definition.role, definition);
  }

  hasPermission(role: AgentRole, toolCategory: string): boolean {
    const def = this.definitions.get(role);
    if (!def) return false;
    return def.allowedToolCategories.includes(toolCategory);
  }
}

export interface SubAgent {
  readonly id: string;
  readonly role: AgentRole;
  execute(task: TaskModel, context: unknown): Promise<unknown>;
}

export interface IMultiAgentOrchestrator {
  createWorkflow(goal: string, budget: ResourceAllocation): Promise<string>;
  decomposeTask(workflowId: string): Promise<void>;
  allocateAgents(workflowId: string): Promise<void>;
  execute(workflowId: string): Promise<unknown>;
  merge(workflowId: string): Promise<unknown>;
  supervise(workflowId: string): void;
  recover(workflowId: string, failedAgentId: string): Promise<void>;
  shutdown(workflowId: string): Promise<void>;
}
