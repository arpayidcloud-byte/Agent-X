/**
 * @module goal-intelligence/metrics
 * @description Goal intelligence metrics.
 */

export interface GoalIntelligenceMetrics {
  goalsCreated: number;
  goalsCompleted: number;
  subgoalsGenerated: number;
  decisionCount: number;
  planningTimeMs: number;
  averageSubgoalDepth: number;
  averageBranchFactor: number;
  strategyUsage: Record<string, number>;
  recoveryCount: number;
  planningFailures: number;
  decisionConfidence: number;
  planningScoreAverage: number;
  planningComplexityAverage: number;
  criticalPathAverage: number;
  constraintViolationCount: number;
  integrityFailureCount: number;
  recoverySuccessRate: number;
  estimatedCostAverage: number;
  estimatedRiskAverage: number;
  goalTreeDepthAverage: number;
  planningValidationTime: number;
}

export class GoalIntelligenceMetricsCollector {
  public goalsCreated = 0;
  public goalsCompleted = 0;
  public subgoalsGenerated = 0;
  public decisionCount = 0;
  public totalPlanningTimeMs = 0;
  public totalSubgoalDepth = 0;
  public totalBranchFactor = 0;
  public strategyUsage: Record<string, number> = {};
  public recoveryCount = 0;
  public planningFailures = 0;
  public totalConfidence = 0;
  public confidenceCount = 0;
  public planningScoreSum = 0;
  public planningComplexitySum = 0;
  public criticalPathSum = 0;
  public constraintViolationCount = 0;
  public integrityFailureCount = 0;
  public totalEstimatedCost = 0;
  public totalEstimatedRisk = 0;
  public totalGoalTreeDepth = 0;
  public totalValidationTime = 0;

  recordGoal(completed: boolean): void {
    this.goalsCreated++;
    if (completed) this.goalsCompleted++;
  }

  recordDecision(confidence: number): void {
    this.decisionCount++;
    this.totalConfidence += confidence;
    this.confidenceCount++;
  }

  recordPlanning(durationMs: number): void {
    this.totalPlanningTimeMs += durationMs;
  }

  recordSubgoals(count: number, avgDepth: number, avgBranch: number): void {
    this.subgoalsGenerated += count;
    this.totalSubgoalDepth += avgDepth;
    this.totalBranchFactor += avgBranch;
  }

  recordStrategy(name: string): void {
    this.strategyUsage[name] = (this.strategyUsage[name] || 0) + 1;
  }

  recordRecovery(): void {
    this.recoveryCount++;
  }

  recordFailure(): void {
    this.planningFailures++;
  }

  recordPlanningScore(score: number): void {
    this.planningScoreSum += score;
  }

  recordPlanningComplexity(complexity: number): void {
    this.planningComplexitySum += complexity;
  }

  recordCriticalPath(length: number): void {
    this.criticalPathSum += length;
  }

  recordConstraintViolation(): void {
    this.constraintViolationCount++;
  }

  recordIntegrityFailure(): void {
    this.integrityFailureCount++;
  }

  recordEstimatedCost(cost: number): void {
    this.totalEstimatedCost += cost;
  }

  recordEstimatedRisk(risk: number): void {
    this.totalEstimatedRisk += risk;
  }

  recordGoalTreeDepth(depth: number): void {
    this.totalGoalTreeDepth += depth;
  }

  recordValidationTime(ms: number): void {
    this.totalValidationTime += ms;
  }

  getMetrics(): GoalIntelligenceMetrics {
    return {
      goalsCreated: this.goalsCreated,
      goalsCompleted: this.goalsCompleted,
      subgoalsGenerated: this.subgoalsGenerated,
      decisionCount: this.decisionCount,
      planningTimeMs: this.totalPlanningTimeMs,
      averageSubgoalDepth: this.goalsCreated > 0 ? this.totalSubgoalDepth / this.goalsCreated : 0,
      averageBranchFactor: this.goalsCreated > 0 ? this.totalBranchFactor / this.goalsCreated : 0,
      strategyUsage: { ...this.strategyUsage },
      recoveryCount: this.recoveryCount,
      planningFailures: this.planningFailures,
      decisionConfidence:
        this.confidenceCount > 0 ? this.totalConfidence / this.confidenceCount : 0,
      planningScoreAverage: this.goalsCreated > 0 ? this.planningScoreSum / this.goalsCreated : 0,
      planningComplexityAverage:
        this.goalsCreated > 0 ? this.planningComplexitySum / this.goalsCreated : 0,
      criticalPathAverage: this.goalsCreated > 0 ? this.criticalPathSum / this.goalsCreated : 0,
      constraintViolationCount: this.constraintViolationCount,
      integrityFailureCount: this.integrityFailureCount,
      recoverySuccessRate:
        this.goalsCreated > 0 ? (this.recoveryCount / this.goalsCreated) * 100 : 0,
      estimatedCostAverage: this.goalsCreated > 0 ? this.totalEstimatedCost / this.goalsCreated : 0,
      estimatedRiskAverage: this.goalsCreated > 0 ? this.totalEstimatedRisk / this.goalsCreated : 0,
      goalTreeDepthAverage: this.goalsCreated > 0 ? this.totalGoalTreeDepth / this.goalsCreated : 0,
      planningValidationTime: this.totalValidationTime,
    };
  }
}
