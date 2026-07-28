/**
 * @module goal-intelligence/dependency-graph
 * @description DAG-based dependency management with cycle detection.
 */

import type { DependencyEdge } from './interfaces.js';

export class DependencyGraph {
  private edges: DependencyEdge[] = [];

  addEdge(source: string, target: string, weight: number = 1): void {
    this.edges.push({ source, target, weight });
  }

  getEdges(): DependencyEdge[] {
    return [...this.edges];
  }

  detectCycle(): boolean {
    const adj = new Map<string, string[]>();
    const visited = new Set<string>();
    const stack = new Set<string>();

    for (const edge of this.edges) {
      if (!adj.has(edge.source as string)) adj.set(edge.source as string, []);
      (adj.get(edge.source as string) as string[]).push(edge.target as string);
    }

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
}
