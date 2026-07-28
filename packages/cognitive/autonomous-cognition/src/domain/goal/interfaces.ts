export type GoalState =
  | 'INTAKE'
  | 'ANALYZING'
  | 'DECOMPOSED'
  | 'PRIORITIZED'
  | 'SCHEDULED'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface Goal {
  readonly goalId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: number;
  readonly state: GoalState;
  readonly createdAt: Date;
  readonly metadata: Record<string, unknown>;
  readonly checksum: string;
}

export interface GoalAnalysis {
  readonly goalId: string;
  readonly complexity: number;
  readonly estimatedTasks: number;
  readonly requiredCapabilities: readonly string[];
  readonly riskScore: number;
  readonly checksum: string;
}

export interface GoalDecomposition {
  readonly goalId: string;
  readonly subGoals: readonly string[];
  readonly dependencies: ReadonlyArray<readonly string[]>;
  readonly checksum: string;
}
