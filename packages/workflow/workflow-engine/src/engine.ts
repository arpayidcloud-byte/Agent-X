/**
 * @module workflow-engine/engine
 * @description Core workflow execution engine.
 */

import type {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowState,
  NodeState,
  ExecutionHistoryEntry,
  WorkflowMetrics,
} from './interfaces.js';
import { findReadyNodes } from './graph.js';
import { InMemoryCheckpointManager } from './checkpoint.js';

export class WorkflowStateMachine {
  private static readonly validTransitions: Record<WorkflowState, WorkflowState[]> = {
    CREATED: ['COMPILED'],
    COMPILED: ['RUNNING', 'FAILED'],
    RUNNING: ['PAUSED', 'COMPLETED', 'FAILED', 'SUSPENDED'],
    PAUSED: ['RUNNING', 'CANCELLED'],
    COMPLETED: [],
    FAILED: ['RUNNING', 'CANCELLED'],
    SUSPENDED: ['RUNNING', 'FAILED'],
    CANCELLED: [],
  };
  static canTransition(current: WorkflowState, next: WorkflowState): boolean {
    return this.validTransitions[current]?.includes(next) ?? false;
  }
}

export class WorkflowEngine {
  private checkpointManager = new InMemoryCheckpointManager();
  private nodeStates = new Map<string, NodeState>();
  private results = new Map<string, unknown>();
  private history: ExecutionHistoryEntry[] = [];
  private state: WorkflowState = 'CREATED';

  compile(_workflow: WorkflowDefinition): void {
    this.nodeStates.clear();
    for (const node of _workflow.nodes) {
      this.nodeStates.set(node.id, 'PENDING');
    }
    this.state = 'COMPILED';
  }

  async execute(workflow: WorkflowDefinition): Promise<WorkflowMetrics> {
    if (this.state !== 'COMPILED' && this.state !== 'FAILED') {
      throw new Error(`Cannot execute workflow in state ${this.state}`);
    }
    this.state = 'RUNNING';
    const startTime = Date.now();
    const completedNodes = new Set<string>();
    const activeNodes = new Set<string>();

    try {
      let progress = true;
      while (progress && completedNodes.size < workflow.nodes.length) {
        progress = false;
        const readyNodes = findReadyNodes(
          workflow.nodes,
          workflow.edges,
          completedNodes,
          activeNodes,
        );

        if (readyNodes.length > 0) {
          progress = true;
          const promises = readyNodes.map(async (node) => {
            activeNodes.add(node.id);
            this.nodeStates.set(node.id, 'RUNNING');
            const nodeStart = Date.now();
            try {
              await this.executeNode(node);
              this.nodeStates.set(node.id, 'COMPLETED');
              completedNodes.add(node.id);
              activeNodes.delete(node.id);
              this.history.push({
                workflowId: workflow.id,
                nodeId: node.id,
                state: 'COMPLETED',
                result: this.results.get(node.id),
                durationMs: Date.now() - nodeStart,
                startedAt: new Date(nodeStart),
                completedAt: new Date(),
              });
            } catch (error) {
              this.nodeStates.set(node.id, 'FAILED');
              activeNodes.delete(node.id);
              this.history.push({
                workflowId: workflow.id,
                nodeId: node.id,
                state: 'FAILED',
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - nodeStart,
                startedAt: new Date(nodeStart),
                completedAt: new Date(),
              });
            }
          });
          await Promise.all(promises);
          await this.saveCheckpoint(workflow.id);
        }
      }
      this.state = completedNodes.size === workflow.nodes.length ? 'COMPLETED' : 'FAILED';
    } catch (error) {
      this.state = 'FAILED';
      throw error;
    }
    return this.buildMetrics(workflow.id, Date.now() - startTime);
  }

  pause(): void {
    if (this.state === 'RUNNING') this.state = 'PAUSED';
  }
  resume(): void {
    if (this.state === 'PAUSED') this.state = 'RUNNING';
  }
  cancel(): void {
    if (this.state === 'RUNNING' || this.state === 'PAUSED') this.state = 'CANCELLED';
  }
  getState(): WorkflowState {
    return this.state;
  }
  getNodeState(nodeId: string): NodeState | undefined {
    return this.nodeStates.get(nodeId);
  }
  getHistory(): ExecutionHistoryEntry[] {
    return [...this.history];
  }

  private async saveCheckpoint(workflowId: string): Promise<void> {
    await this.checkpointManager.save({
      workflowId,
      nodeStates: new Map(this.nodeStates),
      results: new Map(this.results),
      timestamp: new Date(),
      version: 1,
    });
  }

  private async executeNode(node: WorkflowNode): Promise<void> {
    switch (node.config.type) {
      case 'task':
        this.results.set(node.id, { status: 'completed', goal: node.config.goal });
        break;
      case 'tool':
        this.results.set(node.id, { status: 'completed', tool: node.config.toolName });
        break;
      case 'agent':
        this.results.set(node.id, { status: 'completed', role: node.config.role });
        break;
      case 'approval':
        this.nodeStates.set(node.id, 'WAITING_APPROVAL');
        break;
      default:
        this.results.set(node.id, { status: 'completed' });
    }
  }

  private buildMetrics(workflowId: string, totalDurationMs: number): WorkflowMetrics {
    let completed = 0;
    let failed = 0;
    let skipped = 0;
    for (const state of this.nodeStates.values()) {
      if (state === 'COMPLETED') completed++;
      else if (state === 'FAILED') failed++;
      else if (state === 'SKIPPED') skipped++;
    }
    return {
      workflowId,
      totalNodes: this.nodeStates.size,
      completedNodes: completed,
      failedNodes: failed,
      skippedNodes: skipped,
      totalDurationMs,
      nodeDurations: new Map(),
      retries: 0,
      errors: failed,
    };
  }
}
