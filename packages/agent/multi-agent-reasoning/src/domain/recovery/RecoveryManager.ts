/**
 * @module multi-agent-reasoning/domain/recovery/RecoveryManager
 * @description Manages recovery from checkpoints.
 */

import type { CollaborationCheckpoint } from '../collaboration/interfaces.js';
import { createHash } from 'crypto';

export class RecoveryManager {
  private checkpoints = new Map<string, CollaborationCheckpoint>();

  saveCheckpoint(
    sessionId: string,
    agentStates: Record<string, string>,
    sharedState: Record<string, unknown>,
  ): CollaborationCheckpoint {
    const payload = JSON.stringify({ agentStates, sharedState });
    const checksum = createHash('sha256').update(payload).digest('hex');
    const cp: CollaborationCheckpoint = {
      id: `cp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      sessionId,
      agentStates: { ...agentStates },
      sharedState: { ...sharedState },
      timestamp: new Date(),
      checksum,
    };
    this.checkpoints.set(sessionId, cp);
    return cp;
  }

  recoverFromCheckpoint(sessionId: string): CollaborationCheckpoint | undefined {
    return this.checkpoints.get(sessionId);
  }

  validateCheckpoint(checkpoint: CollaborationCheckpoint): boolean {
    return checkpoint.checksum.length > 0;
  }
}
