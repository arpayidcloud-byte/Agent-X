/**
 * @module planning-engine/interfaces
 * @description Interfaces for Planning Engine
 */

export interface IPlanningEngine {
  createPlan(goal: string, context: Record<string, unknown>): Promise<ExecutionPlan>;
  optimizePlan(plan: ExecutionPlan): Promise<ExecutionPlan>;
  validatePlan(plan: ExecutionPlan): Promise<ValidationResult>;
  explainPlan(plan: ExecutionPlan): string;
  getMetrics(): PlanMetrics;
}

export interface ExecutionPlan {
  id: string;
  goal: string;
  tasks: PlannedTask[];
  dependencies: Array<{ source: string; target: string }>;
  estimatedCostUsd: number;
  estimatedTokens: number;
  riskScore: number;
  createdAt: Date;
  metadata: Record<string, unknown>;
}

export interface PlannedTask {
  id: string;
  description: string;
  assignedAgent: string;
  requiredTools: string[];
  estimatedDurationMs: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PlanMetrics {
  totalPlansCreated: number;
  totalPlansOptimized: number;
  averageTasksPerPlan: number;
  averageRiskScore: number;
}
