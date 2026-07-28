/**
 * @module workflow-engine/compiler
 * @description Workflow compiler for converting definitions to executable form.
 */

import type { WorkflowDefinition } from './interfaces.js';
import { validateWorkflow, validateNodeConfig, validateEdges } from './validator.js';
import { topologicalSort } from './graph.js';

/**
 * Compiles a workflow definition into an executable form
 */
export function compileWorkflow(workflow: WorkflowDefinition): WorkflowDefinition {
  // Validate the workflow structure
  validateWorkflow(workflow);

  // Validate node configurations
  for (const node of workflow.nodes) {
    validateNodeConfig(node);
  }

  // Validate edge references
  const nodeIds = new Set(workflow.nodes.map((n) => n.id));
  validateEdges(workflow.edges, nodeIds);

  // Compute topological order for dependency scheduling
  const sortedNodes = topologicalSort(workflow.nodes, workflow.edges);

  // Return compiled workflow with sorted nodes
  return {
    ...workflow,
    nodes: sortedNodes,
    version: workflow.version + 1,
    metadata: {
      ...workflow.metadata,
      updatedAt: new Date(),
    },
  };
}
