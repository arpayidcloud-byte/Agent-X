/**
 * @module goal-intelligence/goal-statistics
 * @description Goal statistics collection.
 */

export interface GoalStatistics {
  averageGoalSize: number;
  averagePlanningDepth: number;
  averageBranchingFactor: number;
  averageDependencyCount: number;
  averageCost: number;
  averageRisk: number;
  averagePlanningTime: number;
  goalCompletionRatio: number;
  planningFailureRatio: number;
  recoveryRatio: number;
}

export class GoalStatisticsCollector {
  public totalGoals = 0;
  public completedGoals = 0;
  public failedGoals = 0;
  public recoveredGoals = 0;
  public totalSubgoalSizes: number[] = [];
  public totalPlanningDepths: number[] = [];
  public totalBranchFactors: number[] = [];
  public totalDependencyCounts: number[] = [];
  public totalCosts: number[] = [];
  public totalRisks: number[] = [];
  public totalPlanningTimes: number[] = [];

  recordGoalCompletion(
    completed: boolean,
    subgoalSize: number,
    planningDepth: number,
    branchFactor: number,
    dependencyCount: number,
    cost: number,
    risk: number,
    planningTime: number,
  ): void {
    this.totalGoals++;
    if (completed) this.completedGoals++;
    else this.failedGoals++;
    this.totalSubgoalSizes.push(subgoalSize);
    this.totalPlanningDepths.push(planningDepth);
    this.totalBranchFactors.push(branchFactor);
    this.totalDependencyCounts.push(dependencyCount);
    this.totalCosts.push(cost);
    this.totalRisks.push(risk);
    this.totalPlanningTimes.push(planningTime);
  }

  recordRecovery(): void {
    this.recoveredGoals++;
  }

  getStatistics(): GoalStatistics {
    const avg = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    return {
      averageGoalSize: avg(this.totalSubgoalSizes),
      averagePlanningDepth: avg(this.totalPlanningDepths),
      averageBranchingFactor: avg(this.totalBranchFactors),
      averageDependencyCount: avg(this.totalDependencyCounts),
      averageCost: avg(this.totalCosts),
      averageRisk: avg(this.totalRisks),
      averagePlanningTime: avg(this.totalPlanningTimes),
      goalCompletionRatio: this.totalGoals > 0 ? this.completedGoals / this.totalGoals : 0,
      planningFailureRatio: this.totalGoals > 0 ? this.failedGoals / this.totalGoals : 0,
      recoveryRatio: this.totalGoals > 0 ? this.recoveredGoals / this.totalGoals : 0,
    };
  }
}
