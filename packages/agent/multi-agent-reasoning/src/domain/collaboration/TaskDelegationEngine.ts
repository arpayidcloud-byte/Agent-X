/**
 * @module multi-agent-reasoning/domain/collaboration/TaskDelegationEngine
 * @description Manages task delegation with circular dependency detection.
 */

import type { TaskDelegation } from './interfaces.js';
import { CircularDelegationError } from './errors.js';

export class TaskDelegationEngine {
  private delegations = new Map<string, TaskDelegation>();
  private edges: [string, string][] = [];

  delegate(taskId: string, agentId: string, goalId: string, priority: number): TaskDelegation {
    const delegation: TaskDelegation = {
      taskId,
      agentId,
      goalId,
      priority,
      timeout: 30000,
      status: 'ASSIGNED',
      metadata: { delegatedAt: new Date() },
    };
    this.delegations.set(taskId, delegation);
    return delegation;
  }

  addDependency(fromTaskId: string, toTaskId: string): void {
    this.edges.push([fromTaskId, toTaskId]);
    if (this.detectCycle()) {
      this.edges.pop();
      throw new CircularDelegationError(
        `Circular delegation detected: ${fromTaskId} -> ${toTaskId}`,
        'delegation-engine',
      );
    }
  }

  detectCycle(): boolean {
    const adj = new Map<string, string[]>();
    for (const [u, v] of this.edges) {
      if (!adj.has(u)) adj.set(u, []);
      adj.get(u)!.push(v as string);
    }
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (node: string): boolean => {
      visited.add(node);
      stack.add(node);
      for (const neighbor of adj.get(node) || []) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (stack.has(neighbor)) {
          return true;
        }
      }
      stack.delete(node);
      return false;
    };

    for (const node of adj.keys()) {
      if (!visited.has(node) && dfs(node)) return true;
    }
    return false;
  }

  getDelegation(taskId: string): TaskDelegation | undefined {
    return this.delegations.get(taskId);
  }

  getAllDelegations(): TaskDelegation[] {
    return Array.from(this.delegations.values());
  }
}
