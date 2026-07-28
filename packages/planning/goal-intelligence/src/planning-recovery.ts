/**
 * @module goal-intelligence/planning-recovery
 * @description Recovers interrupted planning sessions.
 */

import type { PlanningCheckpointManager } from './planning-checkpoint.js';

export class PlanningRecoveryManager {
  constructor(private checkpointManager: PlanningCheckpointManager) {}

  recover(goalId: string): { restored: boolean; goalId: string } {
    const cp = this.checkpointManager.load(goalId);
    return {
      restored: !!cp,
      goalId,
    };
  }
}
