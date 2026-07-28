/**
 * @module reasoning-algorithms/reasoning-graph-engine
 * @description Directed Acyclic Graph (DAG) traversal and cycle detection.
 */

import { CyclicDependencyError } from './errors.js';

export class ReasoningGraphEngine {
  topologicalSort(nodes: string[], edges: [string, string][]): string[] {
    const adj: Map<string, string[]> = new Map();
    const inDegree: Map<string, number> = new Map();

    for (const node of nodes) {
      adj.set(node, []);
      inDegree.set(node, 0);
    }

    for (const [u, v] of edges) {
      adj.get(u)?.push(v);
      inDegree.set(v, (inDegree.get(v) || 0) + 1);
    }

    const queue: string[] = [];
    for (const node of nodes) {
      if ((inDegree.get(node) || 0) === 0) {
        queue.push(node);
      }
    }

    const sorted: string[] = [];

    while (queue.length > 0) {
      const u = queue.shift() as string;
      sorted.push(u);

      for (const v of adj.get(u) || []) {
        const deg = (inDegree.get(v) || 0) - 1;
        inDegree.set(v, deg);
        if (deg === 0) {
          queue.push(v);
        }
      }
    }

    if (sorted.length !== nodes.length) {
      throw new CyclicDependencyError('Cycle detected in reasoning graph', 'reasoning-graph');
    }

    return sorted;
  }
}
