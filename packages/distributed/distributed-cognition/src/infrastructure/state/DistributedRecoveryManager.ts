import type { DistributedCheckpointManager } from './DistributedCheckpointManager.js';

export interface RecoveryPlan {
  readonly sessionId: string;
  readonly targetNodeId: string;
  readonly checkpointId: string;
  readonly state: Record<string, unknown>;
  readonly version: number;
}

export class DistributedRecoveryManager {
  private recoveryPlans = new Map<string, RecoveryPlan>();

  constructor(private checkpointManager: DistributedCheckpointManager) {}

  planRecovery(sessionId: string, targetNodeId: string): RecoveryPlan {
    const checkpoint = this.checkpointManager.load(sessionId);
    if (!checkpoint) throw new Error(`No checkpoint found for session: ${sessionId}`);
    const plan: RecoveryPlan = Object.freeze({
      sessionId,
      targetNodeId,
      checkpointId: checkpoint.checkpointId,
      state: JSON.parse(JSON.stringify(checkpoint.state)) as Record<string, unknown>,
      version: checkpoint.version,
    });
    this.recoveryPlans.set(sessionId, plan);
    return plan;
  }

  executeRecovery(sessionId: string): Record<string, unknown> | undefined {
    const plan = this.recoveryPlans.get(sessionId);
    if (!plan) return undefined;
    return JSON.parse(JSON.stringify(plan.state)) as Record<string, unknown>;
  }

  getPlan(sessionId: string): RecoveryPlan | undefined {
    return this.recoveryPlans.get(sessionId);
  }

  cancelRecovery(sessionId: string): boolean {
    return this.recoveryPlans.delete(sessionId);
  }
}
