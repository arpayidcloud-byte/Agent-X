/** Scheduler and task domain interfaces. */

export type TaskState =
  | 'PENDING'
  | 'SCHEDULED'
  | 'ASSIGNED'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'MIGRATED';

export interface DistributedTask {
  readonly taskId: string;
  readonly goalId: string;
  readonly assignedNode: string | null;
  readonly priority: number;
  readonly timeout: number;
  readonly state: TaskState;
  readonly createdAt: Date;
  readonly metadata: Record<string, unknown>;
  readonly checksum: string;
}

export interface SchedulePolicy {
  readonly strategy: 'ROUND_ROBIN' | 'LEAST_LOADED' | 'CAPABILITY_MATCH' | 'PRIORITY';
  readonly maxRetries: number;
  readonly timeoutMs: number;
}

export interface TaskMigration {
  readonly taskId: string;
  readonly fromNode: string;
  readonly toNode: string;
  readonly reason: string;
  readonly timestamp: Date;
}
