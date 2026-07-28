/**
 * @module approval/interfaces
 * @description Approval & Execution Governance interfaces for the AgentX Tool SDK.
 * These interfaces implement the final approval gate before tool execution.
 */

import type { ToolCategory } from '../interfaces/index.js';

/** @description Approval request states */
export type ApprovalState =
  'WAITING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED' | 'EXECUTED';

/** @description Risk classification levels */
export type RiskLevel = 'Safe' | 'PotentiallyDestructive' | 'Destructive';

/** @description Approval policy configuration */
export interface ApprovalPolicyConfig {
  /** Risk score threshold for auto-approval (default: 39) */
  autoApproveThreshold: number;
  /** Risk score threshold for manual approval (default: 40) */
  manualApprovalThreshold: number;
  /** Risk score threshold for double confirmation (default: 90) */
  doubleConfirmationThreshold: number;
  /** Default TTL in milliseconds (default: 15 minutes = 900000ms) */
  defaultTtlMs: number;
  /** Whether to require double confirmation for high-risk operations */
  requireDoubleConfirmation: boolean;
}

/** @description Approval request */
export interface ApprovalRequest {
  /** Unique request ID */
  id: string;
  /** Tool category */
  category: ToolCategory;
  /** Operation to approve */
  operation: string;
  /** Risk score (0-100) */
  riskScore: number;
  /** Risk level classification */
  riskLevel: RiskLevel;
  /** Current state */
  state: ApprovalState;
  /** Whether double confirmation is required */
  requiresDoubleConfirmation: boolean;
  /** Whether first confirmation has been given */
  firstConfirmationGiven: boolean;
  /** Task ID for correlation */
  taskId: string;
  /** Trace ID for correlation */
  traceId: string;
  /** Agent role requesting the operation */
  agentRole: string;
  /** Operator who approved (if approved) */
  approvedBy?: string;
  /** Approval timestamp */
  approvedAt?: Date;
  /** Rejection reason (if rejected) */
  rejectionReason?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Expiration timestamp */
  expiresAt: Date;
  /** TTL in milliseconds */
  ttlMs: number;
  /** Metadata for the request */
  metadata?: Record<string, unknown>;
}

/** @description Approval result */
export interface ApprovalResult {
  /** Whether the operation was approved */
  approved: boolean;
  /** The approval request */
  request: ApprovalRequest;
  /** Whether double confirmation was required */
  doubleConfirmationRequired: boolean;
  /** Whether the request was expired */
  wasExpired: boolean;
  /** Whether the request was cancelled */
  wasCancelled: boolean;
  /** Message for the result */
  message: string;
}

/** @description Approval session */
export interface ApprovalSession {
  /** Session ID */
  id: string;
  /** Operator who created the session */
  operatorId: string;
  /** Start timestamp */
  startedAt: Date;
  /** Expiration timestamp */
  expiresAt: Date;
  /** Whether the session is active */
  isActive: boolean;
  /** Requests in this session */
  requestIds: string[];
}

/** @description Approval store interface */
export interface IApprovalStore {
  /** Store an approval request */
  store(request: ApprovalRequest): Promise<void>;
  /** Retrieve an approval request */
  retrieve(id: string): Promise<ApprovalRequest | undefined>;
  /** Update an approval request */
  update(request: ApprovalRequest): Promise<void>;
  /** Delete an approval request */
  delete(id: string): Promise<void>;
  /** List all requests */
  list(): Promise<ApprovalRequest[]>;
  /** List requests by state */
  listByState(state: ApprovalState): Promise<ApprovalRequest[]>;
}

/** @description Approval validator interface */
export interface IApprovalValidator {
  /** Validate an approval request before creation */
  validateCreation(request: Partial<ApprovalRequest>): boolean;
  /** Validate an approval action */
  validateAction(request: ApprovalRequest, action: 'approve' | 'reject' | 'cancel'): boolean;
}

/** @description Approval engine interface */
export interface IApprovalEngine {
  /** Create an approval request */
  createRequest(params: CreateApprovalRequestParams): Promise<ApprovalRequest>;
  /** Approve a request */
  approve(requestId: string, operatorId: string, confirmed?: boolean): Promise<ApprovalResult>;
  /** Reject a request */
  reject(requestId: string, operatorId: string, reason?: string): Promise<ApprovalResult>;
  /** Cancel a request */
  cancel(requestId: string, operatorId: string): Promise<ApprovalResult>;
  /** Get request status */
  getRequest(requestId: string): Promise<ApprovalRequest | undefined>;
  /** Execute approved operation */
  execute(requestId: string): Promise<void>;
}

/** @description Parameters for creating an approval request */
export interface CreateApprovalRequestParams {
  /** Tool category */
  category: ToolCategory;
  /** Operation to approve */
  operation: string;
  /** Risk score (0-100) */
  riskScore: number;
  /** Risk level */
  riskLevel: RiskLevel;
  /** Task ID */
  taskId: string;
  /** Trace ID */
  traceId: string;
  /** Agent role */
  agentRole: string;
  /** TTL override in milliseconds */
  ttlMs?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/** @description Approval middleware interface */
export interface IApprovalMiddleware {
  /** Check if approval is required for an operation */
  isApprovalRequired(category: ToolCategory, riskScore: number): boolean;
  /** Get approval request if exists */
  getApprovalStatus(requestId: string): Promise<ApprovalState | undefined>;
}

/** @description Approval registry entry */
export interface ApprovalRegistryEntry {
  /** Tool category */
  category: ToolCategory;
  /** Risk score */
  riskScore: number;
  /** Risk level */
  riskLevel: RiskLevel;
  /** Whether approval is required */
  requiresApproval: boolean;
  /** Description */
  description: string;
}

/** @description Approval context for execution */
export interface ApprovalExecutionContext {
  /** Approval request ID */
  requestId: string;
  /** Approval request */
  request: ApprovalRequest;
  /** Workspace root */
  workspaceRoot: string;
  /** Task ID */
  taskId: string;
  /** Trace ID */
  traceId: string;
  /** Agent role */
  agentRole: string;
}

/** @description Approval expiration check result */
export interface ExpirationCheckResult {
  /** Request ID */
  requestId: string;
  /** Whether the request is expired */
  isExpired: boolean;
  /** Time remaining in milliseconds */
  timeRemainingMs: number;
}

/** @description Approval event types */
export type ApprovalEventType =
  | 'approval.created'
  | 'approval.approved'
  | 'approval.rejected'
  | 'approval.cancelled'
  | 'approval.expired'
  | 'approval.executed'
  | 'approval.failed';

/** @description Approval audit event */
export interface ApprovalAuditEvent {
  /** Event type */
  eventType: ApprovalEventType;
  /** Request ID */
  requestId: string;
  /** Approval state */
  state: ApprovalState;
  /** Tool category */
  category: ToolCategory;
  /** Operation */
  operation: string;
  /** Risk score */
  riskScore: number;
  /** Risk level */
  riskLevel: RiskLevel;
  /** Operator ID */
  operatorId?: string;
  /** Rejection reason */
  rejectionReason?: string;
  /** Task ID */
  taskId: string;
  /** Trace ID */
  traceId: string;
  /** Agent role */
  agentRole: string;
  /** Duration in milliseconds */
  durationMs?: number;
  /** Timestamp */
  timestamp: Date;
}
