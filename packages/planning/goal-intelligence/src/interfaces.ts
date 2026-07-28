/**
 * @module goal-intelligence/interfaces
 * @description Types for Goal Decomposition & Autonomous Decision Intelligence.
 */

export type GoalState =
  | 'CREATED'
  | 'VALIDATING'
  | 'DECOMPOSING'
  | 'GRAPH_BUILDING'
  | 'PLANNING'
  | 'DECISION'
  | 'VALIDATION'
  | 'CHECKPOINTING'
  | 'READY'
  | 'COMPLETED'
  | 'FAILED';

export interface Goal {
  id: string;
  title: string;
  description: string;
  priority: number;
  maxDepth: number;
  checksum: string;
  timestamp: Date;
}

export interface SubGoal {
  id: string;
  goalId: string;
  title: string;
  objective: string;
  depth: number;
  priority: number;
  dependencies: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

export interface ObjectiveNode {
  id: string;
  goalId: string;
  subgoalId: string;
  objective: string;
  children: string[];
  metadata: Record<string, unknown>;
}

export interface DependencyEdge {
  source: string;
  target: string;
  weight: number;
}

export interface DecisionChoice {
  id: string;
  strategy: string;
  confidence: number;
  cost: number;
  safety: 'SAFE' | 'CAUTION' | 'UNSAFE';
  metadata: Record<string, unknown>;
}

export interface PlanningStep {
  id: string;
  subgoalId: string;
  strategy: string;
  order: number;
  parallel: boolean;
  dependencies: string[];
  fallback?: string;
}

export interface PlanningPlan {
  id: string;
  goalId: string;
  steps: PlanningStep[];
  totalEstimatedTime: number;
  budget: PlanningBudget;
  checksum: string;
  timestamp: Date;
}

export interface PlanningBudget {
  tokens: number;
  timeMs: number;
  cost: number;
}

export interface CognitiveEvent {
  type: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export interface CognitiveHook {
  beforeGoal?: (goalId: string) => Promise<void>;
  afterGoal?: (goalId: string, result: unknown) => Promise<void>;
  beforeDecision?: (goalId: string) => Promise<void>;
  afterDecision?: (goalId: string, choice: string) => Promise<void>;
  beforePlanning?: (goalId: string) => Promise<void>;
  afterPlanning?: (goalId: string, planId: string) => Promise<void>;
  beforeConstraintValidation?: (goalId: string) => Promise<void>;
  afterConstraintValidation?: (goalId: string) => Promise<void>;
  beforePlanningScore?: (goalId: string) => Promise<void>;
  afterPlanningScore?: (goalId: string, score: number) => Promise<void>;
  beforeIntegrityValidation?: (goalId: string) => Promise<void>;
  afterIntegrityValidation?: (goalId: string) => Promise<void>;
  beforeCriticalPath?: (goalId: string) => Promise<void>;
  afterCriticalPath?: (goalId: string, path: string[]) => Promise<void>;
}
