/**
 * @module cognitive-contracts/goal-engine
 * @description Goal evaluation engine contract implementation base.
 */

import type { IGoalEngine } from './contracts.js';
import type { GoalResult } from './interfaces.js';

export class GoalEngineBase implements IGoalEngine {
  async evaluateGoal(goalId: string): Promise<GoalResult> {
    return {
      goalId,
      status: 'abandoned',
      evidence: [],
    };
  }
}
