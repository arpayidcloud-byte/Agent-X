/**
 * @module cognitive-learning/learning-session
 * @description Tracks learning execution sessions.
 */

import type { LearningState } from './interfaces.js';
import { createHash } from 'crypto';

export class LearningSession {
  public readonly id: string;
  public readonly traceId: string;
  public status: LearningState = 'CREATED';
  public readonly startedAt: Date = new Date();
  public readonly checksum: string;

  constructor(traceId: string) {
    this.traceId = traceId;
    this.id = `learn-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    this.checksum = createHash('sha256')
      .update(`${this.id}:${traceId}:${Date.now()}`)
      .digest('hex');
  }

  markComplete(): void {
    this.status = 'COMPLETED';
  }

  getDurationMs(): number {
    return Date.now() - this.startedAt.getTime();
  }
}
