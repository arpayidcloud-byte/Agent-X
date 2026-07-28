/**
 * @module workflow-orchestration/workflow-splitter
 * @description Splits parallel workflow branches.
 */

import type { WorkflowNode, WorkflowEdge } from './interfaces.js';

export class WorkflowSplitter {
  split(
    nodes: WorkflowNode[],
    _sourceNode: string,
    _targetCount: number,
  ): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
    return { nodes, edges: [] };
  }
}
