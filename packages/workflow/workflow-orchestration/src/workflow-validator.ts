/**
 * @module workflow-orchestration/workflow-validator
 * @description Validates workflow graphs before execution.
 */

import type { WorkflowGraph } from './interfaces.js';
import { WorkflowValidationError } from './errors.js';

export class WorkflowValidator {
  validateGraph(graph: WorkflowGraph): void {
    if (graph.nodes.length === 0) {
      throw new WorkflowValidationError('Graph must have at least one node', 'validator');
    }
    const nodeIds = new Set(graph.nodes.map((n) => n.id));
    for (const edge of graph.edges) {
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
        throw new WorkflowValidationError(
          `Edge references missing node: ${edge.source} -> ${edge.target}`,
          'validator',
        );
      }
    }
  }
}
