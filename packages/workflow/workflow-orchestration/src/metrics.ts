/**
 * @module workflow-orchestration/metrics
 * @description Workflow orchestration metrics.
 */

export interface WorkflowIntelligenceMetrics {
  workflowsCreated: number;
  workflowsCompleted: number;
  goalsRunning: number;
  goalsCompleted: number;
  goalsCancelled: number;
  tasksExecuted: number;
  tasksFailed: number;
  tasksRecovered: number;
  parallelBranches: number;
  schedulerLatency: number;
  dispatcherLatency: number;
  executionLatency: number;
  replanningCount: number;
  conflictCount: number;
  recoveryCount: number;
  successRate: number;
  failureRate: number;
  averageWorkflowDepth: number;
  averageWorkflowWidth: number;
  averageGoalCount: number;
}

export class WorkflowIntelligenceMetricsCollector {
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

  getMetrics(): WorkflowIntelligenceMetrics {
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
      schedulerLatency: 0,
      dispatcherLatency: 0,
      executionLatency: 0,
      replanningCount: this.replanningCount,
      conflictCount: this.conflictCount,
      recoveryCount: this.recoveryCount,
      successRate:
        this.tasksExecuted > 0
          ? ((this.tasksExecuted - this.tasksFailed) / this.tasksExecuted) * 100
          : 0,
      failureRate: this.tasksExecuted > 0 ? (this.tasksFailed / this.tasksExecuted) * 100 : 0,
      averageWorkflowDepth: 2,
      averageWorkflowWidth: 1,
      averageGoalCount: 1,
    };
  }
}
