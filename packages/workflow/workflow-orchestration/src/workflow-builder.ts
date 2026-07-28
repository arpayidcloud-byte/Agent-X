/**
 * @module workflow-orchestration/workflow-builder
 * @description Builds executable workflow graphs from planning plans.
 */

import type { WorkflowGraph, WorkflowNode, WorkflowEdge } from './interfaces.js';
import { createHash } from 'crypto';

export class WorkflowBuilder {
  build(goalId: string, subgoalCount: number): WorkflowGraph {
    const nodes: WorkflowNode[] = [];
    const edges: WorkflowEdge[] = [];

    for (let i = 0; i < subgoalCount; i++) {
      nodes.push({
        id: `node-${i}`,
        type: i === 0 ? 'sequential' : i % 2 === 0 ? 'parallel' : 'sequential',
        taskId: `task-${goalId}-${i}`,
        metadata: { index: i, goalId },
      });
      if (i > 0) {
        edges.push({ source: `node-${i - 1}`, target: `node-${i}`, weight: 1 });
      }
    }

    return {
      id: `wf-${goalId}-${Date.now()}`,
      nodes,
      edges,
      checksum: createHash('sha256').update(JSON.stringify({ goalId, nodes, edges })).digest('hex'),
      timestamp: new Date(),
    };
  }
}
