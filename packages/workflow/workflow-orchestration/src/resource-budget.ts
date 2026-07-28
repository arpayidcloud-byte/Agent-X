/**
 * @module workflow-orchestration/resource-budget
 * @description Resource budget tracking.
 */

import type { WorkflowBudget } from './interfaces.js';
import { ResourceExhaustedError } from './errors.js';

export class ResourceBudgetManager {
  private consumed: WorkflowBudget = {
    maxTokens: 0,
    maxTimeMs: 0,
    maxCost: 0,
    maxConcurrentTasks: 0,
  };

  consumeTokens(amount: number, limit: number): void {
    if (this.consumed.maxTokens + amount > limit) {
      throw new ResourceExhaustedError('Token budget exceeded', 'budget-manager');
    }
    this.consumed.maxTokens += amount;
  }

  getConsumption(): WorkflowBudget {
    return { ...this.consumed };
  }
}
