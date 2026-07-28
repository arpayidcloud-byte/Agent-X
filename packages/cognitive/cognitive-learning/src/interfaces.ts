/**
 * @module cognitive-learning/interfaces
 * @description Core types for M5.3 Cognitive Learning & Adaptive Feedback.
 */

export type LearningState =
  | 'CREATED'
  | 'COLLECTING'
  | 'EXTRACTING'
  | 'PATTERN_ANALYSIS'
  | 'REFLECTION'
  | 'ADAPTATION'
  | 'VALIDATION'
  | 'CHECKPOINTING'
  | 'COMPLETED';

export interface Experience {
  id: string;
  sessionId: string;
  goal?: string;
  taskId?: string;
  action?: string;
  input?: string;
  output?: string;
  reasoningTrace: string[];
  decision: string;
  confidence: number;
  outcome: 'success' | 'failure' | 'partial';
  feedback: string[];
  durationMs?: number;
  timestamp: Date;
  checksum: string;
}

export interface Pattern {
  id: string;
  type:
    | 'repeated_failure'
    | 'repeated_success'
    | 'frequent_path'
    | 'common_conflict'
    | 'common_recovery';
  signature: string;
  occurrenceCount: number;
  firstSeen: Date;
  lastSeen: Date;
  checksum: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  source: 'runtime' | 'reasoning' | 'approval' | 'human' | 'workflow';
  type: 'success' | 'failure' | 'partial' | 'approval' | 'rejection';
  payload: Record<string, unknown>;
  timestamp: Date;
}

export interface Reflection {
  id: string;
  sessionId: string;
  question: string;
  answer: string;
  timestamp: Date;
  checksum: string;
}

export interface Adaptation {
  id: string;
  sessionId: string;
  type: 'priority' | 'threshold' | 'checkpoint' | 'strategy';
  previousValue: string;
  newValue: string;
  reason: string;
  timestamp: Date;
}

export interface Improvement {
  id: string;
  sessionId: string;
  recommendation: string;
  priority: number;
  category: string;
  timestamp: Date;
}

export interface StrategyRecord {
  id: string;
  name: string;
  version: string;
  priority: number;
  confidence: number;
}

export type AdaptationPolicy = 'conservative' | 'balanced' | 'aggressive' | 'strict';
