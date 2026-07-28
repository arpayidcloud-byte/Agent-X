import type { ResourceAllocation } from './interfaces.js';
import { DependencyGraphError } from './errors.js';
import type { TaskModel } from '@agentx-fast/core-runtime';
import { TaskStatus, TaskPriority } from '@agentx-fast/core-runtime';

export interface TaskGraphNode {
  task: TaskModel;
  estimatedBudget: ResourceAllocation;
}

export class TaskSplitter {
  public decomposeTask(
    _goal: string,
    _context: unknown,
    _globalBudget: ResourceAllocation,
  ): TaskGraphNode[] {
    // Deterministic stub implementation.
    // In production, this uses an LLM call with a low temperature or specific prompt format.
    const nodes: TaskGraphNode[] = [];

    // Always returns same graph structure for tests
    const plannerNode = this.createStubNode('t1', 'plan', 'planner', []);
    const architectNode = this.createStubNode('t2', 'architect', 'architect', ['t1']);
    const coderNode = this.createStubNode('t3', 'code', 'coder', ['t2']);
    const reviewerNode = this.createStubNode('t4', 'review', 'reviewer', ['t3']);

    nodes.push(plannerNode, architectNode, coderNode, reviewerNode);

    return nodes;
  }

  private createStubNode(
    id: string,
    goal: string,
    role: string,
    dependsOn: string[],
  ): TaskGraphNode {
    return {
      task: {
        id,
        goal,
        status: TaskStatus.QUEUED,
        priority: TaskPriority.NORMAL,
        rootTaskId: 'root-1',
        assignedAgentRole: role,
        dependsOn,
        traceId: 'trace-1',
        metadata: { retryCount: 0 },
        context: { variables: {}, history: [] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      estimatedBudget: {
        estimatedCpuTimeMs: 1000,
        estimatedMemoryBytes: 1024 * 1024,
        tokenBudget: 1000,
        costCeilingUsd: 0.1,
        maxConcurrentProviders: 1,
        maxConcurrentTools: 1,
      },
    };
  }
}

export class DependencyAnalyzer {
  public validateGraph(nodes: TaskGraphNode[]): void {
    const nodeIds = new Set(nodes.map((n) => n.task.id));

    // Check duplicates
    if (nodeIds.size !== nodes.length) {
      throw new DependencyGraphError('Duplicate tasks found in graph');
    }

    // Check missing dependencies
    for (const node of nodes) {
      for (const dep of node.task.dependsOn) {
        if (!nodeIds.has(dep)) {
          throw new DependencyGraphError(`Missing dependency: ${dep} required by ${node.task.id}`);
        }
      }
    }

    // Cycle detection
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const checkCycle = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      const node = nodes.find((n) => n.task.id === nodeId);
      if (node) {
        for (const dep of node.task.dependsOn) {
          if (checkCycle(dep)) return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (checkCycle(node.task.id)) {
        throw new DependencyGraphError('Cycle detected in dependency graph');
      }
    }
  }
}
