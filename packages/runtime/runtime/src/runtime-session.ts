/**
 * @module runtime/runtime-session
 * @description Session management for the runtime.
 */

import type {
  RuntimeSession,
  ExecutionSession,
  SessionStatus,
  RuntimeMetrics,
} from './interfaces.js';

/**
 * Creates a new runtime session
 * @param owner - Session owner
 * @returns RuntimeSession
 */
export function createRuntimeSession(owner: string): RuntimeSession {
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    traceId: `trace-${Date.now()}`,
    correlationId: `corr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner,
    status: 'ACTIVE',
    metrics: createEmptyMetrics(),
  };
}

/**
 * Creates a new execution session
 * @param traceId - Trace ID
 * @param goal - Execution goal
 * @returns ExecutionSession
 */
export function createExecutionSession(traceId: string, goal: string): ExecutionSession {
  return {
    id: `exec-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    traceId,
    goal,
    status: 'ACTIVE',
    startedAt: new Date(),
  };
}

/**
 * Creates empty metrics
 * @returns RuntimeMetrics
 */
export function createEmptyMetrics(): RuntimeMetrics {
  return {
    executionTimeMs: 0,
    workflowTimeMs: 0,
    planningTimeMs: 0,
    approvalDelayMs: 0,
    agentUtilization: 0,
    parallelism: 0,
    memoryUsageMb: 0,
    tokenUsage: 0,
    providerUsage: 0,
    toolUsage: 0,
    successRate: 0,
    retryCount: 0,
    checkpointCount: 0,
    queueWaitMs: 0,
    criticalPathLength: 0,
    estimatedCostUsd: 0,
  };
}

/**
 * Validates session state transition
 * @param current - Current status
 * @param next - Target status
 * @returns true if transition is valid
 */
export function canSessionTransition(current: SessionStatus, next: SessionStatus): boolean {
  const validTransitions: Record<SessionStatus, SessionStatus[]> = {
    ACTIVE: ['PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED'],
    PAUSED: ['ACTIVE', 'CANCELLED'],
    COMPLETED: [],
    FAILED: [],
    CANCELLED: [],
  };
  return validTransitions[current]?.includes(next) ?? false;
}
