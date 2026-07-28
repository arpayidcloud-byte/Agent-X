import { createHash } from 'crypto';
import type { NodeRegistry } from '../../domain/node/NodeRegistry.js';

export interface PlanNode {
  readonly nodeId: string;
  readonly role: string;
  readonly weight: number;
}

export interface PlanningResult {
  readonly planId: string;
  readonly goalId: string;
  readonly nodes: readonly PlanNode[];
  readonly estimatedDuration: number;
  readonly checksum: string;
}

export class DistributedPlanningCoordinator {
  private plans: PlanningResult[] = [];

  constructor(private nodeRegistry: NodeRegistry) {}

  createPlan(goalId: string, requiredCapabilities: string[]): PlanningResult {
    const planId = `dp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const nodes: PlanNode[] = [];
    const activeNodes = this.nodeRegistry.getAll().filter((n) => n.status === 'ACTIVE');

    for (const node of activeNodes) {
      const caps = node.metadata.capabilities;
      if (requiredCapabilities.some((rc) => caps.includes(rc))) {
        nodes.push(
          Object.freeze({
            nodeId: node.metadata.nodeId,
            role: 'executor',
            weight: node.metadata.priority,
          }),
        );
      }
    }

    const checksum = createHash('sha256')
      .update(JSON.stringify({ planId, goalId, nodes }))
      .digest('hex');
    const plan: PlanningResult = Object.freeze({
      planId,
      goalId,
      nodes: [...nodes],
      estimatedDuration: nodes.length * 1000,
      checksum,
    });
    this.plans.push(plan);
    return plan;
  }

  getPlans(): PlanningResult[] {
    return [...this.plans];
  }
}
