/**
 * @module workflow-orchestration/progress-tracker
 * @description Tracks execution progress across workflows.
 */

export class ProgressTracker {
  private progress = new Map<string, number>();

  updateProgress(workflowId: string, percentage: number): void {
    this.progress.set(workflowId, Math.min(100, Math.max(0, percentage)));
  }

  getProgress(workflowId: string): number {
    return this.progress.get(workflowId) || 0;
  }
}
