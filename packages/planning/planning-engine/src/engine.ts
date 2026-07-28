import type {
  IPlanningEngine,
  ExecutionPlan,
  PlannedTask,
  ValidationResult,
  PlanMetrics,
} from './interfaces.js';
import type { IEventBus } from '@agentx-fast/core-runtime';

export class PlanningEngine implements IPlanningEngine {
  private metrics: PlanMetrics = {
    totalPlansCreated: 0,
    totalPlansOptimized: 0,
    averageTasksPerPlan: 0,
    averageRiskScore: 0,
  };

  constructor(private eventBus: IEventBus) {}

  public async createPlan(goal: string, context: Record<string, unknown>): Promise<ExecutionPlan> {
    // Simple deterministic decomposition for foundation
    const tasks: PlannedTask[] = [
      {
        id: `t_${Math.random().toString(36).substring(2, 9)}`,
        description: `Analyze: ${goal}`,
        assignedAgent: 'planner',
        requiredTools: ['fs.read'],
        estimatedDurationMs: 1000,
      },
      {
        id: `t_${Math.random().toString(36).substring(2, 9)}`,
        description: `Execute: ${goal}`,
        assignedAgent: 'coder',
        requiredTools: ['fs.read', 'fs.write'],
        estimatedDurationMs: 5000,
      },
    ];

    const plan: ExecutionPlan = {
      id: `plan_${Math.random().toString(36).substring(2, 9)}`,
      goal,
      tasks,
      dependencies: [
        { source: (tasks[0] as PlannedTask).id, target: (tasks[1] as PlannedTask).id },
      ],
      estimatedCostUsd: 0.05,
      estimatedTokens: 1000,
      riskScore: 40, // Base risk due to fs.write
      createdAt: new Date(),
      metadata: context,
    };

    this.updateMetrics(plan, true);
    await this.eventBus.publish('plan.created', plan, `trace_${plan.id}`);

    return plan;
  }

  public async optimizePlan(plan: ExecutionPlan): Promise<ExecutionPlan> {
    // Simulated optimization: merges tasks or reduces dependencies
    const optimized: ExecutionPlan = {
      ...plan,
      estimatedCostUsd: plan.estimatedCostUsd * 0.9,
      estimatedTokens: Math.floor(plan.estimatedTokens * 0.9),
      metadata: { ...plan.metadata, optimized: true },
    };

    this.metrics.totalPlansOptimized++;
    await this.eventBus.publish('plan.optimized', optimized, `trace_${optimized.id}`);
    return optimized;
  }

  public async validatePlan(plan: ExecutionPlan): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!plan.goal) errors.push('Goal is required');
    if (plan.tasks.length === 0) errors.push('Plan must have at least one task');

    if (plan.riskScore >= 90) {
      warnings.push('High risk score, requires double confirmation');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  public explainPlan(plan: ExecutionPlan): string {
    let explanation = `Plan for: ${plan.goal}\n`;
    explanation += `Tasks: ${plan.tasks.length}\n`;
    explanation += `Estimated Cost: $${plan.estimatedCostUsd}\n\n`;

    for (const task of plan.tasks) {
      explanation += `- [${task.assignedAgent}] ${task.description}\n`;
    }

    return explanation;
  }

  public getMetrics(): PlanMetrics {
    return { ...this.metrics };
  }

  private updateMetrics(plan: ExecutionPlan, isNew: boolean): void {
    if (isNew) {
      const prevTotal = this.metrics.totalPlansCreated;
      this.metrics.totalPlansCreated++;

      this.metrics.averageTasksPerPlan =
        (this.metrics.averageTasksPerPlan * prevTotal + plan.tasks.length) /
        this.metrics.totalPlansCreated;

      this.metrics.averageRiskScore =
        (this.metrics.averageRiskScore * prevTotal + plan.riskScore) /
        this.metrics.totalPlansCreated;
    }
  }
}
