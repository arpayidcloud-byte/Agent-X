/**
 * @module goal-intelligence/goal-decomposer
 * @description Decomposes goals into subgoals deterministically.
 */

import type { Goal, SubGoal } from './interfaces.js';
import { DecompositionError } from './errors.js';

export class GoalDecomposer {
  decompose(goal: Goal, objectiveCount: number = 2): SubGoal[] {
    if (objectiveCount < 1) {
      throw new DecompositionError('Must decompose into at least one subgoal', 'decomposer');
    }
    if (objectiveCount > goal.maxDepth) {
      throw new DecompositionError(
        `Decomposition exceeds maxDepth of ${goal.maxDepth}`,
        'decomposer',
      );
    }

    const subgoals: SubGoal[] = [];
    for (let i = 0; i < objectiveCount; i++) {
      const sub: SubGoal = {
        id: `sg-${goal.id}-${i}`,
        goalId: goal.id,
        title: `${goal.title} - Step ${i + 1}`,
        objective: `Execute step ${i + 1} for ${goal.title}`,
        depth: 1,
        priority: goal.priority,
        dependencies: i > 0 ? [`sg-${goal.id}-${i - 1}`] : [],
        status: 'PENDING',
      };
      subgoals.push(sub);
    }
    return subgoals;
  }
}
