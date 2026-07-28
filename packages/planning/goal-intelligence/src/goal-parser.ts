/**
 * @module goal-intelligence/goal-parser
 * @description Parses user goals into structured objectives.
 */

import type { Goal } from './interfaces.js';
import { createHash } from 'crypto';

export class GoalParser {
  parse(title: string, description: string, priority: number = 5): Goal {
    const id = `goal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const goal: Goal = {
      id,
      title,
      description,
      priority,
      maxDepth: 5,
      checksum: createHash('sha256').update(`${title}:${description}:${priority}`).digest('hex'),
      timestamp: new Date(),
    };
    return goal;
  }
}
