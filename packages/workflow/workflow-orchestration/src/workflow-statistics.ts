/**
 * @module workflow-orchestration/workflow-statistics
 * @description Workflow statistics collection.
 */

export interface WorkflowMetrics {
  workflowsCreated: number;
  workflowsCompleted: number;
  goalsRunning: number;
  goalsCompleted: number;
  goalsCancelled: number;
  tasksExecuted: number;
  tasksFailed: number;
  tasksRecovered: number;
  parallelBranches: number;
  replanningCount: number;
  conflictCount: number;
  recoveryCount: number;
  successRate: number;
  failureRate: number;
}

export class WorkflowStatisticsCollector {
  public workflowsCreated = 0;
  public workflowsCompleted = 0;
  public goalsRunning = 0;
  public goalsCompleted = 0;
  public goalsCancelled = 0;
  public tasksExecuted = 0;
  public tasksFailed = 0;
  public tasksRecovered = 0;
  public parallelBranches = 0;
  public replanningCount = 0;
  public conflictCount = 0;
  public recoveryCount = 0;

  recordWorkflow(completed: boolean): void {
    this.workflowsCreated++;
    if (completed) this.workflowsCompleted++;
  }

  recordTask(failed: boolean, recovered: boolean): void {
    this.tasksExecuted++;
    if (failed) this.tasksFailed++;
    if (recovered) this.tasksRecovered++;
  }

  recordFailure(): void {
    this.tasksFailed++;
  }

  getMetrics(): WorkflowMetrics {
    const total = this.tasksExecuted;
    return {
      workflowsCreated: this.workflowsCreated,
      workflowsCompleted: this.workflowsCompleted,
      goalsRunning: this.goalsRunning,
      goalsCompleted: this.goalsCompleted,
      goalsCancelled: this.goalsCancelled,
      tasksExecuted: this.tasksExecuted,
      tasksFailed: this.tasksFailed,
      tasksRecovered: this.tasksRecovered,
      parallelBranches: this.parallelBranches,
      replanningCount: this.replanningCount,
      conflictCount: this.conflictCount,
      recoveryCount: this.recoveryCount,
      successRate: total > 0 ? ((total - this.tasksFailed) / total) * 100 : 0,
      failureRate: total > 0 ? (this.tasksFailed / total) * 100 : 0,
    };
  }
}
