import { createHash } from 'crypto';
import type { NodeRegistry } from '../../domain/node/NodeRegistry.js';

export interface GoalPlan {
  readonly goalId: string;
  readonly assignedNodes: readonly string[];
  readonly priority: number;
  readonly checksum: string;
}

export class DistributedGoalCoordinator {
  private goalPlans = new Map<string, GoalPlan>();

  constructor(private nodeRegistry: NodeRegistry) {}

  assignGoal(goalId: string, priority: number, preferredNodes: string[] = []): GoalPlan {
    const activeNodes = this.nodeRegistry.getAll().filter((n) => n.status === 'ACTIVE');
    const assignedNodes =
      preferredNodes.length > 0
        ? preferredNodes.filter((n) => activeNodes.some((a) => a.metadata.nodeId === n))
        : activeNodes.map((n) => n.metadata.nodeId).slice(0, Math.min(activeNodes.length, 3));
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, priority, assignedNodes }))
      .digest('hex');
    const plan: GoalPlan = Object.freeze({
      goalId,
      assignedNodes: [...assignedNodes],
      priority,
      checksum,
    });
    this.goalPlans.set(goalId, plan);
    return plan;
  }

  getPlan(goalId: string): GoalPlan | undefined {
    return this.goalPlans.get(goalId);
  }

  getAllPlans(): GoalPlan[] {
    return Array.from(this.goalPlans.values());
  }

  completeGoal(goalId: string): void {
    this.goalPlans.delete(goalId);
  }
}
