/**
 * @module goal-intelligence/planning-score
 * @description Deterministic scoring of planning quality.
 */

import type { PlanningPlan } from './interfaces.js';

export interface PlanningScoreData {
  complexityScore: number;
  riskScore: number;
  resourceScore: number;
  dependencyScore: number;
  parallelismScore: number;
  estimatedSuccessScore: number;
  planningQualityScore: number;
  grade: string;
}

export class PlanningScorer {
  score(plan: PlanningPlan): PlanningScoreData {
    const stepCount = plan.steps.length;
    const parallelCount = plan.steps.filter((s) => s.parallel).length;
    const complexityScore = Math.min(100, stepCount * 10);
    const riskScore = Math.max(0, 100 - stepCount * 5);
    const resourceScore = Math.max(0, 100 - plan.budget.tokens / 100);
    const dependencyScore = Math.min(100, stepCount * 15);
    const parallelismScore = Math.min(100, parallelCount * 20);
    const estimatedSuccessScore = Math.max(0, 100 - riskScore * 0.5);
    const planningQualityScore =
      (complexityScore + riskScore + resourceScore + dependencyScore + parallelismScore) / 5;

    let grade: string;
    if (planningQualityScore >= 90) grade = 'Excellent';
    else if (planningQualityScore >= 75) grade = 'Good';
    else if (planningQualityScore >= 60) grade = 'Acceptable';
    else grade = 'Poor';

    return {
      complexityScore,
      riskScore,
      resourceScore,
      dependencyScore,
      parallelismScore,
      estimatedSuccessScore,
      planningQualityScore,
      grade,
    };
  }
}
