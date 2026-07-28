/**
 * @module approval
 * @description Approval & Execution Governance for the AgentX Tool SDK.
 *
 * This module implements the final approval gate before tool execution.
 * All destructive operations MUST pass through the Approval Engine.
 *
 * Key features:
 * - Risk-based approval policies
 * - Double confirmation for high-risk operations
 * - TTL-based expiration
 * - Full audit trail
 * - State machine for approval lifecycle
 * - Integration with Tool SDK, Filesystem, Shell, and Git sandboxes
 */

// Types and interfaces
export type {
  ApprovalState,
  RiskLevel,
  ApprovalPolicyConfig,
  ApprovalRequest,
  ApprovalResult,
  ApprovalSession,
  ExpirationCheckResult,
  ApprovalEventType,
  ApprovalAuditEvent,
  ApprovalExecutionContext,
  ApprovalRegistryEntry,
  CreateApprovalRequestParams,
} from './interfaces.js';

export type {
  IApprovalStore,
  IApprovalValidator,
  IApprovalEngine,
  IApprovalMiddleware,
} from './interfaces.js';

// Errors
export {
  ApprovalError,
  ApprovalNotFoundError,
  ApprovalAlreadyProcessedError,
  ApprovalExpiredError,
  ApprovalCancelledError,
  ApprovalDoubleConfirmationRequiredError,
  ApprovalTokenInvalidError,
  ApprovalReplayAttackError,
  ApprovalDuplicateError,
  ApprovalValidationError,
  ApprovalExecutionError,
  ApprovalServiceUnavailableError,
} from './errors.js';

// Core components
export { ApprovalEngine } from './approval-engine.js';
export { ApprovalService } from './approval-service.js';
export { ApprovalManager } from './approval-manager.js';
export { InMemoryApprovalStore } from './approval-store.js';
export { ApprovalValidator } from './approval-validator.js';
export { ApprovalMiddleware } from './approval-middleware.js';
export { ApprovalRegistry } from './approval-registry.js';
export { ApprovalAuditLogger } from './approval-audit.js';

// Utilities
export {
  createApprovalPolicy,
  requiresAutoApproval,
  requiresManualApproval,
  requiresDoubleConfirmation,
  classifyRiskLevel,
  isApprovalRequired,
} from './approval-policy.js';

export {
  generateRequestId,
  createApprovalRequest,
  updateApprovalRequest,
  canTransition,
} from './approval-request.js';

export { checkExpiration, isRequestValid, formatTimeRemaining } from './approval-expiration.js';

export {
  generateSessionId,
  createApprovalSession,
  isSessionValid,
  addRequestToSession,
  deactivateSession,
} from './approval-session.js';

export { createApprovalContext, validateApprovalContext } from './approval-context.js';

export {
  createApprovalAuditEvent,
  createApprovalCreatedEvent,
  createApprovalApprovedEvent,
  createApprovalRejectedEvent,
  createApprovalCancelledEvent,
  createApprovalExpiredEvent,
  createApprovalExecutedEvent,
  createApprovalFailedEvent,
} from './approval-events.js';

export {
  createSuccessResult,
  createRejectionResult,
  createExpirationResult,
  createCancellationResult,
} from './approval-result.js';
