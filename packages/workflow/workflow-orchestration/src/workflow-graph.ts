/**
 * @module workflow-orchestration/workflow-graph
 * @description Immutable DAG operations for workflow graphs.
 */

import type { WorkflowNode, WorkflowEdge } from './interfaces.js';

export class WorkflowGraphManager {
  detectCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
    const adj = new Map<string, string[]>();
    for (const node of nodes) adj.set(node.id, []);
    for (const edge of edges) adj.get(edge.source)?.push(edge.target);

    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (n: string): boolean => {
      visited.add(n);
      stack.add(n);
      for (const nb of adj.get(n) || []) {
        if (!visited.has(nb)) {
          if (dfs(nb)) return true;
        } else if (stack.has(nb)) return true;
      }
      stack.delete(n);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id) && dfs(node.id)) return true;
    }
    return false;
  }
}
