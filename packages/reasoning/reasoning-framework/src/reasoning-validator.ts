/**
 * @module reasoning-framework/reasoning-validator
 * @description Validates reasoning context integrity.
 */

import type { ReasoningContext, ReasoningGraph } from './interfaces.js';
import { ValidationError, GraphIntegrityError } from './errors.js';

export class ReasoningValidator {
  validateContext(context: ReasoningContext): void {
    if (!context.sessionId || !context.traceId) {
      throw new ValidationError('Context missing session identifiers', 'validator');
    }
  }

  validateGraph(graph: ReasoningGraph): void {
    // Check that all edges refer to existing nodes
    const nodeIds = graph.nodes.map((n) => n.id);
    for (const edge of graph.edges) {
      if (!nodeIds.includes(edge.sourceId) || !nodeIds.includes(edge.targetId)) {
        throw new GraphIntegrityError(
          `Edge refers to missing nodes: ${edge.sourceId} -> ${edge.targetId}`,
          'validator',
        );
      }
    }
  }
}
