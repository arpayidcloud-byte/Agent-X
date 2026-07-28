/**
 * @module goal-intelligence/goal-cost-estimator
 * @description Deterministic estimation of goal execution costs.
 */

export interface CostEstimate {
  estimatedExecutionTime: number;
  estimatedCPU: number;
  estimatedMemory: number;
  estimatedTokenUsage: number;
  estimatedCost: number;
  estimatedRisk: number;
  estimatedComplexity: number;
  estimatedParallelism: number;
}

export class GoalCostEstimator {
  estimate(subgoalCount: number, dependencyCount: number, priority: number): CostEstimate {
    const baseTime = subgoalCount * 1000;
    const timeWithDeps = baseTime + dependencyCount * 500;
    const cpuEstimate = subgoalCount * 2;
    const memoryEstimate = subgoalCount * 64;
    const tokenEstimate = subgoalCount * 500;
    const costEstimate = subgoalCount * 0.01;
    const riskEstimate = (10 - priority) * 10;
    const complexityEstimate = subgoalCount + dependencyCount;
    const parallelismEstimate = Math.max(1, Math.min(subgoalCount, 5));

    return {
      estimatedExecutionTime: timeWithDeps,
      estimatedCPU: cpuEstimate,
      estimatedMemory: memoryEstimate,
      estimatedTokenUsage: tokenEstimate,
      estimatedCost: costEstimate,
      estimatedRisk: riskEstimate,
      estimatedComplexity: complexityEstimate,
      estimatedParallelism: parallelismEstimate,
    };
  }
}
