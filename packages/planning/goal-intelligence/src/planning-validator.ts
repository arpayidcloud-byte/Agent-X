/**
 * @module goal-intelligence/planning-validator
 * @description Validates generated plans before execution.
 */

import type { PlanningPlan, DependencyEdge, PlanningBudget } from './interfaces.js';
import { PlanningError, CycleDetectedError } from './errors.js';

export class PlanningValidator {
  validatePlan(plan: PlanningPlan, edges: DependencyEdge[]): void {
    if (plan.steps.length === 0) {
      throw new PlanningError('Plan must have at least one step', 'planning-validator');
    }

    const adj = new Map<string, string[]>();
    for (const e of edges) {
      if (!adj.has(e.source as string)) adj.set(e.source as string, []);
      (adj.get(e.source as string) as string[]).push(e.target as string);
    }
    const visited = new Set<string>();
    const stack = new Set<string>();
    const dfs = (n: string): boolean => {
      visited.add(n);
      stack.add(n);
      for (const nb of adj.get(n) || []) {
        if (!visited.has(nb)) {
          if (dfs(nb)) return true;
        } else if (stack.has(nb)) {
          return true;
        }
      }
      stack.delete(n);
      return false;
    };
    for (const n of adj.keys()) {
      if (!visited.has(n) && dfs(n)) {
        throw new CycleDetectedError('Cycle detected in plan dependencies', 'planning-validator');
      }
    }
  }

  validateBudget(plan: PlanningPlan, maxBudget: PlanningBudget): void {
    if (plan.budget.tokens > maxBudget.tokens) {
      throw new PlanningError('Plan exceeds token budget', 'planning-validator');
    }
    if (plan.budget.timeMs > maxBudget.timeMs) {
      throw new PlanningError('Plan exceeds time budget', 'planning-validator');
    }
  }
}
