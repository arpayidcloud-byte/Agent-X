/**
 * @module workflow-engine/serializer
 * @description Workflow serialization/deserialization for persistence.
 */

import type { WorkflowDefinition, IWorkflowSerializer } from './interfaces.js';

/**
 * JSON serializer for workflow definitions
 */
export class JsonWorkflowSerializer implements IWorkflowSerializer {
  /** @inheritdoc */
  serialize(definition: WorkflowDefinition): string {
    return JSON.stringify(definition, null, 2);
  }

  /** @inheritdoc */
  deserialize(data: string): WorkflowDefinition {
    try {
      const parsed = JSON.parse(data) as Record<string, unknown>;
      if (!parsed.id || !parsed.name || !parsed.nodes || !parsed.edges) {
        throw new Error('Invalid workflow definition');
      }
      return parsed as unknown as WorkflowDefinition;
    } catch (e) {
      throw new Error(
        `Failed to deserialize workflow: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
}
