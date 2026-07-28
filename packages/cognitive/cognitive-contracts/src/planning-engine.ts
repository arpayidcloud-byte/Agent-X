/**
 * @module cognitive-contracts/planning-engine
 * @description Planning engine contract implementation base.
 */

import type { IPlanningEngine } from './contracts.js';

export class PlanningEngineBase implements IPlanningEngine {
  async generatePlan(_goal: string, _context: Record<string, unknown>): Promise<string[]> {
    return [];
  }
}
