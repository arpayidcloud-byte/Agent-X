/**
 * @module cognitive-learning/checkpoint
 * @description Learning checkpoint with immutable snapshots.
 */

import { createHash } from 'crypto';

export interface LearningCheckpoint {
  id: string;
  timestamp: Date;
  snapshot: Record<string, unknown>;
  checksum: string;
}

export class LearningCheckpointManager {
  private checkpoints = new Map<string, LearningCheckpoint>();

  save(sessionId: string, snapshot: Record<string, unknown>): LearningCheckpoint {
    const payload = JSON.stringify(snapshot);
    const cp: LearningCheckpoint = {
      id: `lcp-${Date.now()}`,
      timestamp: new Date(),
      snapshot,
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.checkpoints.set(sessionId, cp);
    return cp;
  }

  load(sessionId: string): LearningCheckpoint | undefined {
    return this.checkpoints.get(sessionId);
  }
}
