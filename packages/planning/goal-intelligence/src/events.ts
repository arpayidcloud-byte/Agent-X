/**
 * @module goal-intelligence/events
 * @description Goal intelligence event bus.
 */

export class GoalEventBus {
  private listeners = new Map<string, Function[]>();

  publish(type: string, payload: Record<string, unknown> = {}): void {
    const list = this.listeners.get(type) || [];
    for (const fn of list) fn({ type, timestamp: new Date(), payload });
  }

  subscribe(type: string, fn: Function): void {
    const current = this.listeners.get(type) || [];
    this.listeners.set(type, [...current, fn]);
  }

  clear(): void {
    this.listeners.clear();
  }
}

// Event type constants
export const GOAL_CREATED = 'goal.created';
export const GOAL_VALIDATED = 'goal.validated';
export const GOAL_DECOMPOSED = 'goal.decomposed';
export const GOAL_CONSTRAINT_VALIDATED = 'goal.constraint.validated';
export const GOAL_COST_ESTIMATED = 'goal.cost.estimated';
export const GOAL_PROVENANCE_CREATED = 'goal.provenance.created';
export const PLAN_GENERATED = 'plan.generated';
export const PLAN_SCORE_CALCULATED = 'planning.score.calculated';
export const PLAN_INTEGRITY_VALIDATED = 'planning.integrity.validated';
export const CRITICAL_PATH_GENERATED = 'critical.path.generated';
export const DECISION_SELECTED = 'decision.selected';
export const STRATEGY_SELECTED = 'strategy.selected';
export const PLANNING_COMPLETED = 'planning.completed';
export const PLANNING_FAILED = 'planning.failed';
export const PLANNING_RECOVERED = 'planning.recovered';
export const PLANNING_METADATA_CREATED = 'planning.metadata.created';
