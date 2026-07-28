/**
 * @module cognitive-learning/recovery
 * @description Recovers interrupted learning sessions.
 */

import type { LearningCheckpointManager, LearningCheckpoint } from './checkpoint.js';

export class LearningRecoveryManager {
  constructor(private checkpointManager: LearningCheckpointManager) {}

  recover(sessionId: string): LearningCheckpoint | undefined {
    return this.checkpointManager.load(sessionId);
  }
}
