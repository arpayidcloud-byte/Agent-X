/**
 * @module workflow-engine/critical-path
 * @description CriticalPathAnalyzer for identifying bottlenecks and parallel efficiency.
 */

import type { WorkflowDefinition } from './interfaces.js';
import type { CriticalPathAnalysis } from './interfaces-v2.js';
import { topologicalSort } from './graph.js';

export class CriticalPathAnalyzer {
  public analyze(workflow: WorkflowDefinition): CriticalPathAnalysis {
    const longestChain = this.findLongestChain(workflow);
    const parallelEfficiency = this.calculateParallelEfficiency(workflow);
    const bottlenecks = this.findBottlenecks(workflow);
    const idleTime = this.calculateIdleTime(workflow, longestChain.length);

    return {
      workflowId: workflow.id,
      longestChain,
      longestChainLength: longestChain.length,
      parallelEfficiency,
      estimatedBottlenecks: bottlenecks,
      idleTime,
    };
  }

  private findLongestChain(workflow: WorkflowDefinition): string[] {
    const sorted = topologicalSort(workflow.nodes, workflow.edges);
    return sorted.map((n) => n.id);
  }

  private calculateParallelEfficiency(workflow: WorkflowDefinition): number {
    const sorted = topologicalSort(workflow.nodes, workflow.edges);
    if (sorted.length === 0) return 0;

    const inDegree = new Map<string, number>();
    for (const node of workflow.nodes) {
      inDegree.set(node.id, 0);
    }
    for (const edge of workflow.edges) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    const zeroDegreeCount = Array.from(inDegree.values()).filter((d) => d === 0).length;
    return Math.min(1, zeroDegreeCount / sorted.length);
  }

  private findBottlenecks(workflow: WorkflowDefinition): string[] {
    const bottlenecks: string[] = [];
    const outDegree = new Map<string, number>();
    for (const node of workflow.nodes) {
      outDegree.set(node.id, 0);
    }
    for (const edge of workflow.edges) {
      outDegree.set(edge.source, (outDegree.get(edge.source) || 0) + 1);
    }

    const maxOut = Math.max(...Array.from(outDegree.values()));
    for (const [nodeId, degree] of outDegree.entries() as IterableIterator<[string, number]>) {
      if (degree === maxOut && maxOut > 1) {
        bottlenecks.push(nodeId);
      }
    }
    return bottlenecks;
  }

  private calculateIdleTime(workflow: WorkflowDefinition, chainLength: number): number {
    return Math.max(0, (workflow.nodes.length - chainLength) * 500);
  }
}
