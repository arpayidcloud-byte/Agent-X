/**
 * @module approval/approval-context
 * @description Approval context for execution.
 * Provides context information needed for approval and execution.
 */

import type { ApprovalExecutionContext, ApprovalRequest } from './interfaces.js';

/**
 * Creates an approval execution context
 * @param params - Context parameters
 * @returns ApprovalExecutionContext
 */
export function createApprovalContext(params: {
  requestId: string;
  request: ApprovalRequest;
  workspaceRoot: string;
  taskId: string;
  traceId: string;
  agentRole: string;
}): ApprovalExecutionContext {
  return {
    requestId: params.requestId,
    request: params.request,
    workspaceRoot: params.workspaceRoot,
    taskId: params.taskId,
    traceId: params.traceId,
    agentRole: params.agentRole,
  };
}

/**
 * Validates an approval execution context
 * @param context - The context to validate
 * @returns true if valid
 */
export function validateApprovalContext(context: ApprovalExecutionContext): boolean {
  if (!context.requestId) return false;
  if (!context.request) return false;
  if (!context.workspaceRoot) return false;
  if (!context.taskId) return false;
  if (!context.traceId) return false;
  if (!context.agentRole) return false;
  return true;
}
