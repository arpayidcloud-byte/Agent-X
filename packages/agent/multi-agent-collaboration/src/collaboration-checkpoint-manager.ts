/**
 * @module multi-agent-collaboration/collaboration-checkpoint-manager
 * @description Manages immutable collaboration checkpoints.
 */

import type { CollaborationCheckpoint } from './interfaces.js';
import { createHash } from 'crypto';

export class CollaborationCheckpointManager {
  private checkpoints = new Map<string, CollaborationCheckpoint>();

  save(
    sessionId: string,
    agentStates: Record<string, string>,
    sharedState: Record<string, unknown>,
  ): CollaborationCheckpoint {
    const payload = JSON.stringify({ agentStates, sharedState });
    const cp: CollaborationCheckpoint = {
      id: `ccp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      sessionId,
      agentStates: { ...agentStates },
      sharedState: { ...sharedState },
      timestamp: new Date(),
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.checkpoints.set(sessionId, cp);
    return cp;
  }

  load(sessionId: string): CollaborationCheckpoint | undefined {
    return this.checkpoints.get(sessionId);
  }

  clear(): void {
    this.checkpoints.clear();
  }
}
