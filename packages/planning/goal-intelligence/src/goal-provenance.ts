/**
 * @module goal-intelligence/goal-provenance
 * @description Immutable provenance tracking for goals.
 */

import { createHash } from 'crypto';

export interface GoalProvenance {
  goalId: string;
  parentGoalId: string;
  originGoalId: string;
  createdBy: string;
  createdAt: Date;
  reasoningTraceId: string;
  decisionId: string;
  learningPatternId: string;
  reflectionId: string;
  experienceId: string;
  checkpointId: string;
  checksum: string;
  version: number;
}

export class GoalProvenanceManager {
  createProvenance(overrides: Partial<GoalProvenance>): GoalProvenance {
    const provenance: GoalProvenance = {
      goalId: '',
      parentGoalId: '',
      originGoalId: '',
      createdBy: 'system',
      createdAt: new Date(),
      reasoningTraceId: '',
      decisionId: '',
      learningPatternId: '',
      reflectionId: '',
      experienceId: '',
      checkpointId: '',
      checksum: '',
      version: 1,
      ...overrides,
    };

    const payload = JSON.stringify(provenance);
    provenance.checksum = createHash('sha256').update(payload).digest('hex');
    return Object.freeze(provenance);
  }
}
