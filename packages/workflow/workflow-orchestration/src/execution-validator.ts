/**
 * @module workflow-orchestration/execution-validator
 * @description Validates execution plans before execution.
 */

import { WorkflowExecutionError } from './errors.js';

export class ExecutionValidator {
  validatePlan(taskCount: number, budget: number): void {
    if (taskCount <= 0) {
      throw new WorkflowExecutionError(
        'Execution plan must have at least one task',
        'execution-validator',
      );
    }
    if (budget <= 0) {
      throw new WorkflowExecutionError('Execution budget must be positive', 'execution-validator');
    }
  }
}
