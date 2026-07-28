/**
 * @module cognitive-kernel/kernel-checkpoint
 * @description State checkpoint and snapshot saving for failure rollbacks.
 */

import type { SessionCheckpoint } from './interfaces.js';
import { createHash } from 'crypto';

export class KernelCheckpointManager {
  private checkpoints = new Map<string, SessionCheckpoint>();

  saveCheckpoint(sessionId: string, snapshot: Record<string, unknown>): SessionCheckpoint {
    const serialized = JSON.stringify(snapshot);
    const checksum = createHash('sha256').update(serialized).digest('hex');

    const checkpoint: SessionCheckpoint = {
      metadata: {
        id: `chk-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        sessionId,
        timestamp: new Date(),
        checksum,
      },
      snapshot,
    };

    this.checkpoints.set(sessionId, checkpoint);
    return checkpoint;
  }

  getCheckpoint(sessionId: string): SessionCheckpoint | undefined {
    return this.checkpoints.get(sessionId);
  }

  clear(): void {
    this.checkpoints.clear();
  }
}
