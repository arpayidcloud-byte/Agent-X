/**
 * @module approval/approval-validator
 * @description Approval request validation logic.
 * Validates requests before creation and approval actions.
 */

import type { IApprovalValidator, ApprovalRequest, ApprovalState } from './interfaces.js';
import { ApprovalValidationError } from './errors.js';

/**
 * Approval validator implementation
 */
export class ApprovalValidator implements IApprovalValidator {
  /** @inheritdoc */
  validateCreation(request: Partial<ApprovalRequest>): boolean {
    const errors: string[] = [];

    if (!request.category) {
      errors.push('Category is required');
    }

    if (!request.operation) {
      errors.push('Operation is required');
    }

    if (request.riskScore === undefined || request.riskScore < 0 || request.riskScore > 100) {
      errors.push('Risk score must be between 0 and 100');
    }

    if (!request.taskId) {
      errors.push('Task ID is required');
    }

    if (!request.traceId) {
      errors.push('Trace ID is required');
    }

    if (!request.agentRole) {
      errors.push('Agent role is required');
    }

    if (errors.length > 0) {
      throw new ApprovalValidationError(errors.join(', '));
    }

    return true;
  }

  /** @inheritdoc */
  validateAction(request: ApprovalRequest, action: 'approve' | 'reject' | 'cancel'): boolean {
    // Check if request is in a valid state for the action
    const validStates: Record<string, ApprovalState[]> = {
      approve: ['WAITING'],
      reject: ['WAITING'],
      cancel: ['WAITING'],
    };

    const valid = validStates[action];
    if (!valid || !valid.includes(request.state)) {
      throw new ApprovalValidationError(
        `Cannot ${action} request '${request.id}' in state '${request.state}'`,
      );
    }

    return true;
  }

  /**
   * Validates if an approval action is allowed
   * @param request - The approval request
   * @param action - The action to perform
   * @returns true if valid
   */
  isActionAllowed(request: ApprovalRequest, action: 'approve' | 'reject' | 'cancel'): boolean {
    try {
      return this.validateAction(request, action);
    } catch {
      return false;
    }
  }
}
