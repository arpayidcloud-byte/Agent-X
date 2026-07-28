/**
 * @module cognitive-contracts/interfaces
 * @description Core types and specifications for M4.5 Cognitive Runtime Contracts.
 */

export type CognitiveState =
  | 'CREATED'
  | 'INITIALIZING'
  | 'THINKING'
  | 'REASONING'
  | 'REFLECTING'
  | 'PLANNING'
  | 'WAITING_APPROVAL'
  | 'DECISION'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'RECOVERING';

export interface ThinkingSession {
  id: string;
  traceId: string;
  correlationId: string;
  state: CognitiveState;
  startedAt: Date;
  metadata: Record<string, unknown>;
}

export interface ReasoningContext {
  sessionId: string;
  traceId: string;
  parentTraceId?: string;
  goalId: string;
  depth: number;
  maxDepth: number;
}

export interface ThinkingState {
  session: ThinkingSession;
  history: string[];
  currentNodeId?: string;
}

export interface ThinkingSnapshot {
  id: string;
  timestamp: Date;
  state: ThinkingState;
  checksum: string;
}

export interface ExecutionIntent {
  intentId: string;
  action: string;
  params: Record<string, unknown>;
  confidence: number;
}

export interface ReasoningResult {
  thoughtProcess: string[];
  conclusion: string;
  confidenceScore: number;
}

export interface ReflectionResult {
  isCorrect: boolean;
  critique: string;
  improvements: string[];
}

export interface DecisionResult {
  chosenAction: string;
  alternatives: string[];
  explanation: string;
}

export interface GoalResult {
  goalId: string;
  status: 'achieved' | 'failed' | 'abandoned';
  evidence: string[];
}

export interface CognitiveBudget {
  inputBudget: number;
  outputBudget: number;
  reasoningBudget: number;
  reflectionBudget: number;
  planningBudget: number;
  toolBudget: number;
  memoryBudget: number;
  globalBudget: number;
}

export interface SafetyPolicy {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceThreshold: number;
  requiresHumanApproval: boolean;
  rollbackOnFailure: boolean;
}

export interface MemoryRetrievalStrategy {
  limit: number;
  similarityThreshold: number;
  memoryTypes: ('working' | 'short_term' | 'long_term' | 'episodic' | 'semantic')[];
}
export interface MemoryUpdateStrategy {
  importanceThreshold: number;
  compactionEnabled: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  version: string;
  template: string;
  variables: string[];
}
