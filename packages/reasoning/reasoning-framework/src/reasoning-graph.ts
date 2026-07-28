/**
 * @module reasoning-framework/reasoning-graph
 * @description Reasoning graph contracts.
 */

import type { ReasoningGraph, ReasoningNode, ReasoningEdge } from './interfaces.js';

export class ReasoningGraphManager {
  private graph: ReasoningGraph = { nodes: [], edges: [], checksum: '' };

  addNode(node: ReasoningNode): void {
    this.graph.nodes.push(node);
  }

  addEdge(edge: ReasoningEdge): void {
    this.graph.edges.push(edge);
  }

  getGraph(): ReasoningGraph {
    return { ...this.graph };
  }
}
