/**
 * @module cognitive-contracts/contracts
 * @description Primary cognitive engine port contracts.
 */

import type {
  ThinkingSession,
  ReasoningContext,
  ReasoningResult,
  ReflectionResult,
  DecisionResult,
  GoalResult,
  SafetyPolicy,
  MemoryRetrievalStrategy,
  MemoryUpdateStrategy,
  PromptTemplate,
} from './interfaces.js';

export interface ICognitiveEngine {
  executeSession(session: ThinkingSession): Promise<unknown>;
  getEngineMetadata(): { id: string; name: string; version: string };
}

export interface IThinkingEngine {
  think(session: ThinkingSession): Promise<ReasoningResult>;
}

export interface IReasoningEngine {
  reason(context: ReasoningContext, input: string): Promise<ReasoningResult>;
}

export interface IReflectionEngine {
  reflect(thought: string, criteria: string[]): Promise<ReflectionResult>;
}

export interface IPlanningEngine {
  generatePlan(goal: string, context: Record<string, unknown>): Promise<string[]>;
}

export interface IGoalEngine {
  evaluateGoal(goalId: string): Promise<GoalResult>;
}

export interface IDecisionEngine {
  makeDecision(options: string[], policy: SafetyPolicy): Promise<DecisionResult>;
}

export interface IMemoryStrategy {
  retrieve(query: string, strategy: MemoryRetrievalStrategy): Promise<unknown[]>;
  update(key: string, value: unknown, strategy: MemoryUpdateStrategy): Promise<void>;
}

export interface IContextStrategy {
  compress(context: Record<string, unknown>): Promise<Record<string, unknown>>;
}

export interface IPromptStrategy {
  render(template: PromptTemplate, variables: Record<string, string>): string;
}
