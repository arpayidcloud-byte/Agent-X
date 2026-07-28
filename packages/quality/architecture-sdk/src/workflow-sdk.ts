/**
 * @module architecture-sdk/workflow-sdk
 * @description Workflow engine specification limits.
 */

export class WorkflowSDK {
  getConstraints(): string[] {
    return ['Max nodes 1000', 'Max retry 5', 'Timeout 60s'];
  }
}
