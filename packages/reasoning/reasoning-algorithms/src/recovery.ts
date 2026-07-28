/**
 * @module reasoning-algorithms/recovery
 * @description Recovery logic for symbolic engines.
 */

import type { CheckpointManager } from './checkpoint.js';

export class RecoveryManager {
  constructor(private checkpointManager: CheckpointManager) {}

  recover(sessionId: string): Record<string, unknown> | undefined {
    return this.checkpointManager.load(sessionId);
  }
}
