/**
 * @module cognitive-contracts/thinking-snapshot
 * @description Thinking snapshot contract base implementation.
 */

import type { ThinkingSnapshot } from './interfaces.js';

export class ThinkingSnapshotBase {
  private snapshot: ThinkingSnapshot;

  constructor(snapshot: ThinkingSnapshot) {
    this.snapshot = snapshot;
  }

  getSnapshot(): ThinkingSnapshot {
    return { ...this.snapshot };
  }
}
