/**
 * @module runtime-production/execution-deduplicator
 * @description Prevents identical concurrent workflows from executing.
 */

export class ExecutionDeduplicator {
  private activeExecutions = new Set<string>();

  isDuplicate(workflowId: string): boolean {
    return this.activeExecutions.has(workflowId);
  }

  register(workflowId: string): void {
    this.activeExecutions.add(workflowId);
  }

  deregister(workflowId: string): void {
    this.activeExecutions.delete(workflowId);
  }

  clear(): void {
    this.activeExecutions.clear();
  }
}
