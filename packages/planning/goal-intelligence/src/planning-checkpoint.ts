/**
 * @module goal-intelligence/planning-checkpoint
 * @description Immutable planning snapshots.
 */

import type { PlanningPlan } from './interfaces.js';
import { createHash } from 'crypto';

export interface PlanningCheckpoint {
  id: string;
  goalId: string;
  snapshot: PlanningPlan;
  checksum: string;
  timestamp: Date;
}

export class PlanningCheckpointManager {
  private checkpoints = new Map<string, PlanningCheckpoint>();

  save(goalId: string, plan: PlanningPlan): PlanningCheckpoint {
    const payload = JSON.stringify(plan);
    const cp: PlanningCheckpoint = {
      id: `pcp-${Date.now()}`,
      goalId,
      snapshot: plan,
      checksum: createHash('sha256').update(payload).digest('hex'),
      timestamp: new Date(),
    };
    this.checkpoints.set(goalId, cp);
    return cp;
  }

  load(goalId: string): PlanningCheckpoint | undefined {
    return this.checkpoints.get(goalId);
  }
}
