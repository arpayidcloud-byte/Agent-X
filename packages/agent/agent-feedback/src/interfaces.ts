/**
 * @module agent-feedback/interfaces
 * @description Closed-loop feedback for agent outputs (roadmap: "Agent feedback
 * system"). Converts quality scores into actionable revision guidance so the
 * next agent run starts from a better position.
 */

import type { QualityDimensionName, QualityGrade, QualityScore } from '@agent-xai/quality-scoring';

export interface WeakDimension {
  name: QualityDimensionName;
  score: number;
  weight: number;
  /** Concrete improvement suggestions for this dimension. */
  suggestions: string[];
  /** Original heuristic notes attached to the dimension. */
  notes: string[];
}

export interface AgentFeedback {
  id: string;
  scoreId: string;
  taskId?: string;
  prompt: string;
  response: string;
  overall: number;
  grade: QualityGrade;
  /** Dimensions below the improvement threshold. */
  weakDimensions: WeakDimension[];
  /** Top actionable advice, ordered by impact (lowest score first). */
  priorityAdvice: string[];
  /** Full prompt ready for a revision run (original prompt + feedback). */
  improvementPrompt: string;
  createdAt: string;
}

export interface FeedbackOptions {
  /** Dimensions below this score are flagged for improvement (default 70). */
  weakThreshold?: number;
  /** Max number of priority advice items (default 3). */
  maxAdvice?: number;
}

export type FeedbackSource = QualityScore;
