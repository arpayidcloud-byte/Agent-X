/**
 * @module goal-intelligence/goal-session
 * @description Session tracking for goal decomposition.
 */

import type { Goal, GoalState } from './interfaces.js';
import { createHash } from 'crypto';

export class GoalSession {
  public readonly id: string;
  public readonly traceId: string;
  public goal: Goal;
  public state: GoalState = 'CREATED';
  public startedAt: Date = new Date();
  public checksum: string;

  constructor(traceId: string, goal: Goal) {
    this.id = `goal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    this.traceId = traceId;
    this.goal = goal;
    this.checksum = createHash('sha256').update(`${this.id}:${traceId}:${goal.id}`).digest('hex');
  }

  markComplete(): void {
    this.state = 'COMPLETED';
  }
}
