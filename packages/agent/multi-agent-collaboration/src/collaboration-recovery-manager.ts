/**
 * @module multi-agent-collaboration/collaboration-recovery-manager
 * @description Collaboration recovery manager.
 */

import type { CollaborationCheckpointManager } from './collaboration-checkpoint-manager.js';

export class CollaborationRecoveryManager {
  constructor(private checkpointManager: CollaborationCheckpointManager) {}

  recover(sessionId: string): { restored: boolean; sessionId: string } {
    const cp = this.checkpointManager.load(sessionId);
    return { restored: !!cp, sessionId };
  }
}
