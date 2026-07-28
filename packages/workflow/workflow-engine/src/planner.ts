/**
 * @module workflow-engine/planner
 * @description ExecutionPlanner for dependency ordering, priority calculation, and parallel batching.
 */

import type { WorkflowDefinition, WorkflowNode, WorkflowEdge } from './interfaces.js';
import type { ExecutionPlan, ExecutionBatch } from './interfaces-v2.js';
import { topologicalSort, isNodeReady } from './graph.js';

export class ExecutionPlanner {
  public plan(workflow: WorkflowDefinition): ExecutionPlan {
    const sortedNodes = topologicalSort(workflow.nodes, workflow.edges);
    const batches = this.computeBatches(sortedNodes, workflow.edges);
    const criticalPath = this.calculateCriticalPath(workflow);
    const parallelismLevel = this.estimateParallelism(workflow);

    return {
      workflowId: workflow.id,
      batches,
      criticalPath,
      estimatedTotalDurationMs: batches.reduce((sum, b) => sum + b.estimatedDurationMs, 0),
      parallelismLevel,
      resourceAllocation: {
        maxConcurrent: parallelismLevel,
        estimatedTokens: 0,
        estimatedCostUsd: 0,
        criticalPathLength: criticalPath.length,
      },
    };
  }

  private computeBatches(sortedNodes: WorkflowNode[], edges: WorkflowEdge[]): ExecutionBatch[] {
    const batches: ExecutionBatch[] = [];
    const completedNodes = new Set<string>();
    let batchIndex = 0;

    while (completedNodes.size < sortedNodes.length) {
      const ready = sortedNodes.filter(
        (n) => !completedNodes.has(n.id) && isNodeReady(n.id, edges, completedNodes),
      );

      if (ready.length === 0) break;

      batches.push({
        batchIndex: batchIndex++,
        nodeIds: ready.map((n) => n.id),
        estimatedDurationMs: Math.max(...ready.map((n) => this.estimateNodeDuration(n))),
        canRunInParallel: ready.length > 1,
      });

      ready.forEach((n) => completedNodes.add(n.id));
    }

    return batches;
  }

  public calculateCriticalPath(workflow: WorkflowDefinition): string[] {
    const sorted = topologicalSort(workflow.nodes, workflow.edges);
    return sorted.map((n) => n.id);
  }

  public estimateParallelism(workflow: WorkflowDefinition): number {
    const edges = workflow.edges;
    const nodes = workflow.nodes;
    let maxParallel = 1;
    const inDegree = new Map<string, number>();

    for (const node of nodes) {
      inDegree.set(node.id, 0);
    }
    for (const edge of edges) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    const zeroCount = Array.from(inDegree.values()).filter((d) => d === 0).length;
    maxParallel = Math.max(maxParallel, zeroCount);

    return maxParallel;
  }

  private estimateNodeDuration(node: WorkflowNode): number {
    switch (node.config.type) {
      case 'tool':
        return 2000;
      case 'agent':
        return 5000;
      case 'approval':
        return 30000;
      case 'parallel':
        return 3000;
      case 'loop':
        return 10000;
      default:
        return 1000;
    }
  }
}
