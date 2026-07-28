/**
 * @module workflow-engine/validator
 * @description Workflow validation and graph integrity checks.
 */

import type { WorkflowDefinition, WorkflowNode, WorkflowEdge } from './interfaces.js';
import { detectCycle, topologicalSort } from './graph.js';
import { CycleDetectedError, WorkflowValidationError, NodeNotFoundError } from './errors.js';

/**
 * Validates a workflow definition
 */
export function validateWorkflow(workflow: WorkflowDefinition): void {
  // Check for empty nodes
  if (workflow.nodes.length === 0) {
    throw new WorkflowValidationError('Workflow must have at least one node');
  }

  // Check for duplicate node IDs
  const nodeIds = new Set<string>();
  for (const node of workflow.nodes) {
    if (nodeIds.has(node.id)) {
      throw new WorkflowValidationError(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);
  }

  // Check for cycles
  if (detectCycle(workflow.nodes, workflow.edges)) {
    throw new CycleDetectedError('Workflow contains a cycle');
  }

  // Check edge references
  for (const edge of workflow.edges) {
    if (!nodeIds.has(edge.source)) {
      throw new NodeNotFoundError(edge.source);
    }
    if (!nodeIds.has(edge.target)) {
      throw new NodeNotFoundError(edge.target);
    }
  }

  // Validate topological sort
  try {
    topologicalSort(workflow.nodes, workflow.edges);
  } catch (e) {
    throw new WorkflowValidationError('Failed to compute topological sort');
  }
}

/**
 * Validates node configuration
 */
export function validateNodeConfig(node: WorkflowNode): void {
  if (!node.id || node.id.length === 0) {
    throw new WorkflowValidationError('Node must have a non-empty ID');
  }

  if (!node.name || node.name.length === 0) {
    throw new WorkflowValidationError(`Node ${node.id} must have a non-empty name`);
  }

  // Type-specific validation
  switch (node.config.type) {
    case 'task':
      if (!node.config.goal || node.config.goal.length === 0) {
        throw new WorkflowValidationError(`Task node ${node.id} must have a goal`);
      }
      break;
    case 'conditional':
      if (!node.config.condition || node.config.condition.length === 0) {
        throw new WorkflowValidationError(`Conditional node ${node.id} must have a condition`);
      }
      if (!node.config.trueBranch || !node.config.falseBranch) {
        throw new WorkflowValidationError(
          `Conditional node ${node.id} must have both true and false branches`,
        );
      }
      break;
    case 'loop':
      if (node.config.maxIterations <= 0) {
        throw new WorkflowValidationError(`Loop node ${node.id} must have maxIterations > 0`);
      }
      break;
  }
}

/**
 * Validates edge configuration
 */
export function validateEdges(edges: WorkflowEdge[], nodeIds: Set<string>): void {
  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      throw new WorkflowValidationError(`Edge references non-existent source node: ${edge.source}`);
    }
    if (!nodeIds.has(edge.target)) {
      throw new WorkflowValidationError(`Edge references non-existent target node: ${edge.target}`);
    }
  }
}
