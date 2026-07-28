/**
 * @module approval/approval.test
 * @description Comprehensive tests for Approval & Execution Governance.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  // Policy
  createApprovalPolicy,
  requiresAutoApproval,
  requiresManualApproval,
  requiresDoubleConfirmation,
  classifyRiskLevel,
  isApprovalRequired,
  // Store
  InMemoryApprovalStore,
  // Validator
  ApprovalValidator,
  // Request
  generateRequestId,
  createApprovalRequest,
  updateApprovalRequest,
  canTransition,
  // Session
  createApprovalSession,
  isSessionValid,
  addRequestToSession,
  deactivateSession,
  generateSessionId,
  // Expiration
  checkExpiration,
  isRequestValid,
  formatTimeRemaining,
  // Events
  createApprovalAuditEvent,
  createApprovalCreatedEvent,
  createApprovalApprovedEvent,
  createApprovalRejectedEvent,
  createApprovalCancelledEvent,
  createApprovalExpiredEvent,
  createApprovalExecutedEvent,
  createApprovalFailedEvent,
  // Audit
  ApprovalAuditLogger,
  // Engine
  ApprovalEngine,
  // Service
  ApprovalService,
  // Manager
  ApprovalManager,
  // Registry
  ApprovalRegistry,
  // Middleware
  ApprovalMiddleware,
  // Context
  createApprovalContext,
  validateApprovalContext,
  // Result
  createSuccessResult,
  createRejectionResult,
  createExpirationResult,
  createCancellationResult,
  // Errors
  ApprovalNotFoundError,
  ApprovalAlreadyProcessedError,
  ApprovalExpiredError,
  ApprovalCancelledError,
  ApprovalDoubleConfirmationRequiredError,
  ApprovalValidationError,
  ApprovalExecutionError,
  ApprovalServiceUnavailableError,
  // Types
  ApprovalRequest,
  ApprovalState,
} from '../../src/approval/index.js';

// ============================================================
// TESTS: Policy
// ============================================================

describe('Approval Policy', () => {
  it('creates policy with defaults', () => {
    const policy = createApprovalPolicy();
    expect(policy.autoApproveThreshold).toBe(39);
    expect(policy.manualApprovalThreshold).toBe(40);
    expect(policy.doubleConfirmationThreshold).toBe(90);
    expect(policy.defaultTtlMs).toBe(15 * 60 * 1000);
    expect(policy.requireDoubleConfirmation).toBe(true);
  });

  it('creates policy with custom config', () => {
    const policy = createApprovalPolicy({ autoApproveThreshold: 20 });
    expect(policy.autoApproveThreshold).toBe(20);
    expect(policy.manualApprovalThreshold).toBe(40); // Default preserved
  });

  it('determines auto-approval threshold', () => {
    const policy = createApprovalPolicy();
    expect(requiresAutoApproval(10, policy)).toBe(true);
    expect(requiresAutoApproval(39, policy)).toBe(true);
    expect(requiresAutoApproval(40, policy)).toBe(false);
  });

  it('determines manual approval threshold', () => {
    const policy = createApprovalPolicy();
    expect(requiresManualApproval(39, policy)).toBe(false);
    expect(requiresManualApproval(40, policy)).toBe(true);
    expect(requiresManualApproval(90, policy)).toBe(true);
  });

  it('determines double confirmation threshold', () => {
    const policy = createApprovalPolicy();
    expect(requiresDoubleConfirmation(89, policy)).toBe(false);
    expect(requiresDoubleConfirmation(90, policy)).toBe(true);
  });

  it('classifies risk levels', () => {
    expect(classifyRiskLevel(10)).toBe('Safe');
    expect(classifyRiskLevel(39)).toBe('Safe');
    expect(classifyRiskLevel(40)).toBe('PotentiallyDestructive');
    expect(classifyRiskLevel(89)).toBe('PotentiallyDestructive');
    expect(classifyRiskLevel(90)).toBe('Destructive');
    expect(classifyRiskLevel(100)).toBe('Destructive');
  });

  it('determines if approval is required', () => {
    const policy = createApprovalPolicy();
    expect(isApprovalRequired(10, policy)).toBe(false);
    expect(isApprovalRequired(39, policy)).toBe(false);
    expect(isApprovalRequired(40, policy)).toBe(true);
  });
});

// ============================================================
// TESTS: Store
// ============================================================

describe('InMemoryApprovalStore', () => {
  let store: InMemoryApprovalStore;

  beforeEach(() => {
    store = new InMemoryApprovalStore();
  });

  it('stores and retrieves requests', async () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write file',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    await store.store(request);
    const retrieved = await store.retrieve(request.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(request.id);
  });

  it('returns undefined for non-existent request', async () => {
    const result = await store.retrieve('non-existent');
    expect(result).toBeUndefined();
  });

  it('updates requests', async () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write file',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    await store.store(request);
    const updated = updateApprovalRequest(request, 'APPROVED', { approvedBy: 'operator' });
    await store.update(updated);

    const retrieved = await store.retrieve(request.id);
    expect(retrieved?.state).toBe('APPROVED');
    expect(retrieved?.approvedBy).toBe('operator');
  });

  it('throws on updating non-existent request', async () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write file',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    await expect(store.update(request)).rejects.toThrow();
  });

  it('deletes requests', async () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write file',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    await store.store(request);
    await store.delete(request.id);
    const result = await store.retrieve(request.id);
    expect(result).toBeUndefined();
  });

  it('lists all requests', async () => {
    await store.store(
      createApprovalRequest({
        category: 'fs.write',
        operation: 'write file',
        riskScore: 60,
        riskLevel: 'PotentiallyDestructive',
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      }),
    );

    await store.store(
      createApprovalRequest({
        category: 'git.commit',
        operation: 'commit',
        riskScore: 80,
        riskLevel: 'PotentiallyDestructive',
        taskId: 'task-2',
        traceId: 'trace-2',
        agentRole: 'coding',
      }),
    );

    const all = await store.list();
    expect(all).toHaveLength(2);
  });

  it('lists requests by state', async () => {
    const req1 = createApprovalRequest({
      category: 'fs.write',
      operation: 'write file',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const req2 = createApprovalRequest({
      category: 'git.commit',
      operation: 'commit',
      riskScore: 80,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-2',
      traceId: 'trace-2',
      agentRole: 'coding',
    });

    await store.store(req1);
    await store.store(req2);

    const waiting = await store.listByState('WAITING');
    expect(waiting).toHaveLength(2);

    const approved = await store.listByState('APPROVED');
    expect(approved).toHaveLength(0);
  });
});

// ============================================================
// TESTS: Validator
// ============================================================

describe('ApprovalValidator', () => {
  let validator: ApprovalValidator;

  beforeEach(() => {
    validator = new ApprovalValidator();
  });

  it('validates creation with valid params', () => {
    expect(
      validator.validateCreation({
        category: 'fs.write',
        operation: 'write',
        riskScore: 60,
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      }),
    ).toBe(true);
  });

  it('rejects creation without category', () => {
    expect(() =>
      validator.validateCreation({
        operation: 'write',
        riskScore: 60,
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      }),
    ).toThrow(ApprovalValidationError);
  });

  it('rejects creation without operation', () => {
    expect(() =>
      validator.validateCreation({
        category: 'fs.write',
        riskScore: 60,
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      }),
    ).toThrow(ApprovalValidationError);
  });

  it('rejects creation with invalid risk score', () => {
    expect(() =>
      validator.validateCreation({
        category: 'fs.write',
        operation: 'write',
        riskScore: -1,
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      }),
    ).toThrow(ApprovalValidationError);
  });

  it('rejects creation without taskId', () => {
    expect(() =>
      validator.validateCreation({
        category: 'fs.write',
        operation: 'write',
        riskScore: 60,
        traceId: 'trace-1',
        agentRole: 'coding',
      }),
    ).toThrow(ApprovalValidationError);
  });

  it('validates action for waiting state', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(validator.validateAction(request, 'approve')).toBe(true);
    expect(validator.validateAction(request, 'reject')).toBe(true);
    expect(validator.validateAction(request, 'cancel')).toBe(true);
  });

  it('rejects action for approved state', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });
    const approved = updateApprovalRequest(request, 'APPROVED');

    expect(() => validator.validateAction(approved, 'approve')).toThrow(ApprovalValidationError);
  });
});

// ============================================================
// TESTS: Request
// ============================================================

describe('Approval Request', () => {
  it('generates unique request IDs', () => {
    const id1 = generateRequestId();
    const id2 = generateRequestId();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^approval-/);
  });

  it('creates approval request with defaults', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write file',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(request.state).toBe('WAITING');
    expect(request.riskScore).toBe(60);
    expect(request.riskLevel).toBe('PotentiallyDestructive');
    expect(request.category).toBe('fs.write');
    expect(request.operation).toBe('write file');
    expect(request.taskId).toBe('task-1');
    expect(request.traceId).toBe('trace-1');
    expect(request.agentRole).toBe('coding');
    expect(request.expiresAt.getTime()).toBeGreaterThan(request.createdAt.getTime());
  });

  it('creates request with custom TTL', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write file',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
      ttlMs: 60000,
    });

    expect(request.ttlMs).toBe(60000);
  });

  it('detects double confirmation requirement', () => {
    const request = createApprovalRequest({
      category: 'shell.exec',
      operation: 'exec',
      riskScore: 90,
      riskLevel: 'Destructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(request.requiresDoubleConfirmation).toBe(true);
  });

  it('validates state transitions', () => {
    expect(canTransition('WAITING', 'APPROVED')).toBe(true);
    expect(canTransition('WAITING', 'REJECTED')).toBe(true);
    expect(canTransition('WAITING', 'EXPIRED')).toBe(true);
    expect(canTransition('WAITING', 'CANCELLED')).toBe(true);
    expect(canTransition('APPROVED', 'EXECUTED')).toBe(true);
    expect(canTransition('APPROVED', 'WAITING')).toBe(false);
    expect(canTransition('REJECTED', 'APPROVED')).toBe(false);
    expect(canTransition('EXECUTED', 'WAITING')).toBe(false);
  });
});

// ============================================================
// TESTS: Session
// ============================================================

describe('Approval Session', () => {
  it('creates session with defaults', () => {
    const session = createApprovalSession('operator-1');
    expect(session.operatorId).toBe('operator-1');
    expect(session.isActive).toBe(true);
    expect(session.requestIds).toEqual([]);
  });

  it('creates session with custom TTL', () => {
    const session = createApprovalSession('operator-1', 60000);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now() + 50000);
  });

  it('checks session validity', () => {
    const validSession = createApprovalSession('operator-1');
    expect(isSessionValid(validSession)).toBe(true);

    const expiredSession = createApprovalSession('operator-1', -1000);
    expect(isSessionValid(expiredSession)).toBe(false);

    const deactivatedSession = deactivateSession(createApprovalSession('operator-1'));
    expect(isSessionValid(deactivatedSession)).toBe(false);
  });

  it('adds requests to session', () => {
    const session = createApprovalSession('operator-1');
    const updated = addRequestToSession(session, 'request-1');
    expect(updated.requestIds).toContain('request-1');
  });

  it('deactivates session', () => {
    const session = createApprovalSession('operator-1');
    const deactivated = deactivateSession(session);
    expect(deactivated.isActive).toBe(false);
  });
});

// ============================================================
// TESTS: Expiration
// ============================================================

describe('Approval Expiration', () => {
  it('checks expiration status', () => {
    const expiredRequest = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
      ttlMs: -1000,
    });

    const result = checkExpiration(expiredRequest);
    expect(result.isExpired).toBe(true);
    expect(result.timeRemainingMs).toBe(0);
  });

  it('checks request validity', () => {
    const validRequest = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(isRequestValid(validRequest)).toBe(true);

    const approvedRequest = updateApprovalRequest(validRequest, 'APPROVED');
    expect(isRequestValid(approvedRequest)).toBe(false);
  });

  it('formats time remaining', () => {
    expect(formatTimeRemaining(0)).toBe('Expired');
    expect(formatTimeRemaining(60000)).toBe('1 minute 0 seconds');
    expect(formatTimeRemaining(90000)).toBe('1 minute 30 seconds');
    expect(formatTimeRemaining(30000)).toBe('30 seconds');
  });
});

// ============================================================
// TESTS: Audit Events
// ============================================================

describe('Approval Audit Events', () => {
  it('creates approval audit event', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const event = createApprovalAuditEvent('approval.created', request);
    expect(event.eventType).toBe('approval.created');
    expect(event.requestId).toBe(request.id);
    expect(event.state).toBe('WAITING');
    expect(event.category).toBe('fs.write');
    expect(event.riskScore).toBe(60);
  });

  it('creates all event types', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(createApprovalCreatedEvent(request).eventType).toBe('approval.created');
    expect(createApprovalApprovedEvent(request).eventType).toBe('approval.approved');
    expect(createApprovalRejectedEvent(request).eventType).toBe('approval.rejected');
    expect(createApprovalCancelledEvent(request).eventType).toBe('approval.cancelled');
    expect(createApprovalExpiredEvent(request).eventType).toBe('approval.expired');
    expect(createApprovalExecutedEvent(request, 100).eventType).toBe('approval.executed');
    expect(createApprovalFailedEvent(request).eventType).toBe('approval.failed');
  });
});

// ============================================================
// TESTS: Audit Logger
// ============================================================

describe('Approval Audit Logger', () => {
  let logger: ApprovalAuditLogger;

  beforeEach(() => {
    logger = new ApprovalAuditLogger();
  });

  it('logs and retrieves events', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    logger.log(createApprovalCreatedEvent(request));
    expect(logger.getEvents()).toHaveLength(1);
    expect(logger.getEvents()[0].eventType).toBe('approval.created');
  });

  it('filters events by type', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    logger.log(createApprovalCreatedEvent(request));
    logger.log(createApprovalApprovedEvent(request));

    const created = logger.getEventsByType('approval.created');
    expect(created).toHaveLength(1);

    const approved = logger.getEventsByType('approval.approved');
    expect(approved).toHaveLength(1);
  });

  it('filters events by request ID', () => {
    const req1 = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const req2 = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-2',
      traceId: 'trace-2',
      agentRole: 'coding',
    });

    logger.log(createApprovalCreatedEvent(req1));
    logger.log(createApprovalCreatedEvent(req2));

    const req1Events = logger.getEventsByRequest(req1.id);
    expect(req1Events).toHaveLength(1);
  });

  it('filters events by task ID', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    logger.log(createApprovalCreatedEvent(request));
    const taskEvents = logger.getEventsByTask('task-1');
    expect(taskEvents).toHaveLength(1);
  });

  it('clears events', () => {
    logger.log(
      createApprovalCreatedEvent(
        createApprovalRequest({
          category: 'fs.write',
          operation: 'write',
          riskScore: 60,
          taskId: 'task-1',
          traceId: 'trace-1',
          agentRole: 'coding',
        }),
      ),
    );

    logger.clear();
    expect(logger.getEvents()).toHaveLength(0);
  });
});

// ============================================================
// TESTS: Engine
// ============================================================

describe('Approval Engine', () => {
  let store: InMemoryApprovalStore;
  let engine: ApprovalEngine;

  beforeEach(() => {
    store = new InMemoryApprovalStore();
    engine = new ApprovalEngine(store);
  });

  it('creates approval request', async () => {
    const request = await engine.createRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(request.id).toBeDefined();
    expect(request.state).toBe('WAITING');
  });

  it('approves request', async () => {
    const request = await engine.createRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const result = await engine.approve(request.id, 'operator-1');
    expect(result.approved).toBe(true);
    expect(result.request.state).toBe('APPROVED');
  });

  it('rejects request', async () => {
    const request = await engine.createRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const result = await engine.reject(request.id, 'operator-1', 'Not needed');
    expect(result.approved).toBe(false);
    expect(result.request.state).toBe('REJECTED');
  });

  it('cancels request', async () => {
    const request = await engine.createRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const result = await engine.cancel(request.id, 'operator-1');
    expect(result.approved).toBe(false);
    expect(result.request.state).toBe('CANCELLED');
  });

  it('executes approved request', async () => {
    const request = await engine.createRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    await engine.approve(request.id, 'operator-1');
    await engine.execute(request.id);

    const updated = await engine.getRequest(request.id);
    expect(updated?.state).toBe('EXECUTED');
  });

  it('throws on non-existent request', async () => {
    await expect(engine.approve('non-existent', 'operator-1')).rejects.toThrow(
      ApprovalNotFoundError,
    );
  });

  it('throws on already processed request', async () => {
    const request = await engine.createRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    await engine.approve(request.id, 'operator-1');
    await expect(engine.approve(request.id, 'operator-1')).rejects.toThrow(
      ApprovalAlreadyProcessedError,
    );
  });

  it('throws on expired request', async () => {
    const request = await engine.createRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
      ttlMs: -1000,
    });

    await expect(engine.approve(request.id, 'operator-1')).rejects.toThrow(ApprovalExpiredError);
  });

  it('handles double confirmation', async () => {
    const request = await engine.createRequest({
      category: 'shell.exec',
      operation: 'exec',
      riskScore: 90,
      riskLevel: 'Destructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    // First confirmation
    const result1 = await engine.approve(request.id, 'operator-1', false);
    expect(result1.approved).toBe(false);
    expect(result1.doubleConfirmationRequired).toBe(true);

    // Second confirmation
    const result2 = await engine.approve(request.id, 'operator-1', true);
    expect(result2.approved).toBe(true);
  });

  it('gets audit logger', () => {
    expect(engine.getAuditLogger()).toBeDefined();
  });
});

// ============================================================
// TESTS: Service
// ============================================================

describe('Approval Service', () => {
  let service: ApprovalService;

  beforeEach(() => {
    service = new ApprovalService();
  });

  it('checks if approval is required', () => {
    expect(service.isApprovalRequired(10)).toBe(false);
    expect(service.isApprovalRequired(40)).toBe(true);
  });

  it('creates and manages requests', async () => {
    const request = await service.createRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      riskLevel: 'PotentiallyDestructive',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(request.state).toBe('WAITING');

    const result = await service.approve(request.id, 'operator-1');
    expect(result.approved).toBe(true);

    const retrieved = await service.getRequest(request.id);
    expect(retrieved?.state).toBe('APPROVED');
  });

  it('gets engine', () => {
    expect(service.getEngine()).toBeDefined();
  });
});

// ============================================================
// TESTS: Registry
// ============================================================

describe('Approval Registry', () => {
  let registry: ApprovalRegistry;

  beforeEach(() => {
    registry = new ApprovalRegistry();
  });

  it('has default entries', () => {
    expect(registry.getEntry('fs.read')).toBeDefined();
    expect(registry.getEntry('fs.write')).toBeDefined();
    expect(registry.getEntry('shell.exec')).toBeDefined();
  });

  it('registers new entries', () => {
    registry.registerEntry({
      category: 'custom.tool',
      riskScore: 25,
      riskLevel: 'Safe',
      requiresApproval: false,
      description: 'Custom tool',
    });

    expect(registry.getEntry('custom.tool')).toBeDefined();
  });

  it('gets risk scores', () => {
    expect(registry.getRiskScore('fs.read')).toBe(10);
    expect(registry.getRiskScore('fs.write')).toBe(60);
    expect(registry.getRiskScore('shell.exec')).toBe(90);
  });

  it('checks approval requirements', () => {
    expect(registry.requiresApproval('fs.read')).toBe(false);
    expect(registry.requiresApproval('fs.write')).toBe(true);
    expect(registry.requiresApproval('shell.exec')).toBe(true);
  });
});

// ============================================================
// TESTS: Middleware
// ============================================================

describe('Approval Middleware', () => {
  let store: InMemoryApprovalStore;
  let middleware: ApprovalMiddleware;

  beforeEach(() => {
    store = new InMemoryApprovalStore();
    middleware = new ApprovalMiddleware(store);
  });

  it('checks if approval is required', () => {
    expect(middleware.isApprovalRequired('fs.write', 10)).toBe(false);
    expect(middleware.isApprovalRequired('fs.write', 40)).toBe(true);
  });

  it('gets approval status', async () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    await store.store(request);
    const status = await middleware.getApprovalStatus(request.id);
    expect(status).toBe('WAITING');
  });

  it('returns undefined for non-existent request', async () => {
    const status = await middleware.getApprovalStatus('non-existent');
    expect(status).toBeUndefined();
  });
});

// ============================================================
// TESTS: Context
// ============================================================

describe('Approval Context', () => {
  it('creates approval context', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const context = createApprovalContext({
      requestId: request.id,
      request,
      workspaceRoot: '/root/agentx',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(context.requestId).toBe(request.id);
    expect(context.workspaceRoot).toBe('/root/agentx');
  });

  it('validates context', () => {
    const validContext = createApprovalContext({
      requestId: 'req-1',
      request: {},
      workspaceRoot: '/root/agentx',
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    expect(validateApprovalContext(validContext)).toBe(true);
  });

  it('rejects invalid context', () => {
    expect(validateApprovalContext({} as any)).toBe(false);
  });
});

// ============================================================
// TESTS: Results
// ============================================================

describe('Approval Results', () => {
  it('creates success result', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const result = createSuccessResult(request, false);
    expect(result.approved).toBe(true);
    expect(result.doubleConfirmationRequired).toBe(false);
  });

  it('creates rejection result', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const result = createRejectionResult(request, 'Not needed');
    expect(result.approved).toBe(false);
    expect(result.message).toBe('Not needed');
  });

  it('creates expiration result', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const result = createExpirationResult(request);
    expect(result.approved).toBe(false);
    expect(result.wasExpired).toBe(true);
  });

  it('creates cancellation result', () => {
    const request = createApprovalRequest({
      category: 'fs.write',
      operation: 'write',
      riskScore: 60,
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    });

    const result = createCancellationResult(request);
    expect(result.approved).toBe(false);
    expect(result.wasCancelled).toBe(true);
  });
});

// ============================================================
// TESTS: Errors
// ============================================================

describe('Approval Errors', () => {
  it('creates all error types', () => {
    expect(new ApprovalNotFoundError('req-1').code).toBe('APPROVAL_NOT_FOUND');
    expect(new ApprovalAlreadyProcessedError('req-1').code).toBe('APPROVAL_ALREADY_PROCESSED');
    expect(new ApprovalExpiredError('req-1').code).toBe('APPROVAL_EXPIRED');
    expect(new ApprovalCancelledError('req-1').code).toBe('APPROVAL_CANCELLED');
    expect(new ApprovalDoubleConfirmationRequiredError('req-1').code).toBe(
      'APPROVAL_DOUBLE_CONFIRMATION_REQUIRED',
    );
    expect(new ApprovalValidationError('msg').code).toBe('APPROVAL_VALIDATION_ERROR');
    expect(new ApprovalExecutionError('req-1', 'reason').code).toBe('APPROVAL_EXECUTION_FAILED');
    expect(new ApprovalServiceUnavailableError().code).toBe('APPROVAL_SERVICE_UNAVAILABLE');
  });
});

// ============================================================
// TESTS: Manager
// ============================================================

describe('Approval Manager', () => {
  let manager: ApprovalManager;

  beforeEach(() => {
    manager = new ApprovalManager();
  });

  it('creates request with session', async () => {
    const request = await manager.createRequest(
      {
        category: 'fs.write',
        operation: 'write',
        riskScore: 60,
        riskLevel: 'PotentiallyDestructive',
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      },
      'operator-1',
    );

    expect(request.id).toBeDefined();
    expect(request.state).toBe('WAITING');
  });

  it('approves request', async () => {
    const request = await manager.createRequest(
      {
        category: 'fs.write',
        operation: 'write',
        riskScore: 60,
        riskLevel: 'PotentiallyDestructive',
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      },
      'operator-1',
    );

    const result = await manager.approve(request.id, 'operator-1');
    expect(result.approved).toBe(true);
  });

  it('rejects request', async () => {
    const request = await manager.createRequest(
      {
        category: 'fs.write',
        operation: 'write',
        riskScore: 60,
        riskLevel: 'PotentiallyDestructive',
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      },
      'operator-1',
    );

    const result = await manager.reject(request.id, 'operator-1');
    expect(result.approved).toBe(false);
  });

  it('cancels request', async () => {
    const request = await manager.createRequest(
      {
        category: 'fs.write',
        operation: 'write',
        riskScore: 60,
        riskLevel: 'PotentiallyDestructive',
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      },
      'operator-1',
    );

    const result = await manager.cancel(request.id, 'operator-1');
    expect(result.approved).toBe(false);
  });

  it('gets service', () => {
    expect(manager.getService()).toBeDefined();
  });
});

// ============================================================
// TESTS: Manager Expiration
// ============================================================

describe('Approval Manager Expiration', () => {
  let manager: ApprovalManager;

  beforeEach(() => {
    manager = new ApprovalManager();
  });

  it('checks expirations', async () => {
    await manager.createRequest(
      {
        category: 'fs.write',
        operation: 'write',
        riskScore: 60,
        riskLevel: 'PotentiallyDestructive',
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coding',
      },
      'operator-1',
    );

    const expired = await manager.checkExpirations();
    expect(Array.isArray(expired)).toBe(true);
  });
});
