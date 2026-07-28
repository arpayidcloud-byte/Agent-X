/**
 * @module reasoning-framework/reasoning-checkpoint
 * @description Reasoning checkpoint operations.
 */

import type { ReasoningSnapshot } from './interfaces.js';
import { createHash } from 'crypto';

export class ReasoningCheckpointManager {
  private snapshots: ReasoningSnapshot[] = [];

  save(sessionId: string, snapshot: Record<string, unknown>): ReasoningSnapshot {
    const payload = JSON.stringify(snapshot);
    const checksum = createHash('sha256').update(payload).digest('hex');
    const snap: ReasoningSnapshot = {
      id: `snap-${Date.now()}`,
      sessionId,
      timestamp: new Date(),
      snapshot,
      checksum,
    };
    this.snapshots.push(snap);
    return snap;
  }

  getSnapshots(sessionId: string): ReasoningSnapshot[] {
    return this.snapshots.filter((s) => s.sessionId === sessionId);
  }
}
