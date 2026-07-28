/**
 * @module approval/approval-engine
 * @description Core approval engine implementation.
 * Manages the full approval lifecycle: create, approve, reject, expire, cancel, execute.
 */

import type {
  IApprovalEngine,
  IApprovalStore,
  ApprovalRequest,
  ApprovalResult,
  CreateApprovalRequestParams,
} from './interfaces.js';
import {
  ApprovalNotFoundError,
  ApprovalAlreadyProcessedError,
  ApprovalExpiredError,
  ApprovalDoubleConfirmationRequiredError,
  ApprovalValidationError,
} from './errors.js';
import { createApprovalRequest, updateApprovalRequest } from './approval-request.js';
import { checkExpiration } from './approval-expiration.js';
import { ApprovalValidator } from './approval-validator.js';
import { ApprovalAuditLogger } from './approval-audit.js';
import {
  createApprovalCreatedEvent,
  createApprovalApprovedEvent,
  createApprovalRejectedEvent,
  createApprovalCancelledEvent,
  createApprovalExpiredEvent,
  createApprovalExecutedEvent,
} from './approval-events.js';

/**
 * Approval engine implementation
 */
export class ApprovalEngine implements IApprovalEngine {
  private store: IApprovalStore;
  private validator: ApprovalValidator;
  private auditLogger: ApprovalAuditLogger;

  constructor(store: IApprovalStore) {
    this.store = store;
    this.validator = new ApprovalValidator();
    this.auditLogger = new ApprovalAuditLogger();
  }

  /** @inheritdoc */
  async createRequest(params: CreateApprovalRequestParams): Promise<ApprovalRequest> {
    // Validate parameters
    this.validator.validateCreation(params);

    // Create the request
    const request = createApprovalRequest(params);

    // Store the request
    await this.store.store(request);

    // Log audit event
    this.auditLogger.log(createApprovalCreatedEvent(request));

    return request;
  }

  /** @inheritdoc */
  async approve(
    requestId: string,
    operatorId: string,
    confirmed: boolean = true,
  ): Promise<ApprovalResult> {
    // Retrieve the request
    const request = await this.store.retrieve(requestId);
    if (!request) {
      throw new ApprovalNotFoundError(requestId);
    }

    // Check if already processed
    if (request.state !== 'WAITING') {
      throw new ApprovalAlreadyProcessedError(requestId);
    }

    // Check if expired
    const expiration = checkExpiration(request);
    if (expiration.isExpired) {
      const expired = updateApprovalRequest(request, 'EXPIRED');
      await this.store.update(expired);
      this.auditLogger.log(createApprovalExpiredEvent(expired));
      throw new ApprovalExpiredError(requestId);
    }

    // Check if double confirmation is required
    if (request.requiresDoubleConfirmation && !confirmed) {
      if (!request.firstConfirmationGiven) {
        // First confirmation given, update state
        const updated = { ...request, firstConfirmationGiven: true };
        await this.store.update(updated);
        return {
          approved: false,
          request: updated,
          doubleConfirmationRequired: true,
          wasExpired: false,
          wasCancelled: false,
          message: 'First confirmation received. Double confirmation required.',
        };
      }
      throw new ApprovalDoubleConfirmationRequiredError(requestId);
    }

    // Approve the request
    const approved = updateApprovalRequest(request, 'APPROVED', {
      approvedBy: operatorId,
      approvedAt: new Date(),
    });

    await this.store.update(approved);
    this.auditLogger.log(createApprovalApprovedEvent(approved));

    return {
      approved: true,
      request: approved,
      doubleConfirmationRequired: request.requiresDoubleConfirmation,
      wasExpired: false,
      wasCancelled: false,
      message: 'Approval granted.',
    };
  }

  /** @inheritdoc */
  async reject(requestId: string, operatorId: string, reason?: string): Promise<ApprovalResult> {
    const request = await this.store.retrieve(requestId);
    if (!request) {
      throw new ApprovalNotFoundError(requestId);
    }

    if (request.state !== 'WAITING') {
      throw new ApprovalAlreadyProcessedError(requestId);
    }

    const rejected = updateApprovalRequest(request, 'REJECTED', {
      approvedBy: operatorId,
      rejectionReason: reason,
    });

    await this.store.update(rejected);
    this.auditLogger.log(createApprovalRejectedEvent(rejected));

    return {
      approved: false,
      request: rejected,
      doubleConfirmationRequired: false,
      wasExpired: false,
      wasCancelled: false,
      message: reason || 'Approval rejected.',
    };
  }

  /** @inheritdoc */
  async cancel(requestId: string, operatorId: string): Promise<ApprovalResult> {
    const request = await this.store.retrieve(requestId);
    if (!request) {
      throw new ApprovalNotFoundError(requestId);
    }

    if (request.state !== 'WAITING') {
      throw new ApprovalAlreadyProcessedError(requestId);
    }

    const cancelled = updateApprovalRequest(request, 'CANCELLED', {
      approvedBy: operatorId,
    });

    await this.store.update(cancelled);
    this.auditLogger.log(createApprovalCancelledEvent(cancelled));

    return {
      approved: false,
      request: cancelled,
      doubleConfirmationRequired: false,
      wasExpired: false,
      wasCancelled: true,
      message: 'Approval cancelled.',
    };
  }

  /** @inheritdoc */
  async getRequest(requestId: string): Promise<ApprovalRequest | undefined> {
    return this.store.retrieve(requestId);
  }

  /** @inheritdoc */
  async execute(requestId: string): Promise<void> {
    const request = await this.store.retrieve(requestId);
    if (!request) {
      throw new ApprovalNotFoundError(requestId);
    }

    if (request.state !== 'APPROVED') {
      throw new ApprovalValidationError(
        `Cannot execute request '${requestId}' in state '${request.state}'`,
      );
    }

    // Mark as executed
    const executed = updateApprovalRequest(request, 'EXECUTED');
    await this.store.update(executed);
    this.auditLogger.log(createApprovalExecutedEvent(executed, 0));
  }

  /**
   * Gets the audit logger
   * @returns ApprovalAuditLogger instance
   */
  getAuditLogger(): ApprovalAuditLogger {
    return this.auditLogger;
  }
}
