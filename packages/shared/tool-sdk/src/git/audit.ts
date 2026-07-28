/**
 * @module git/audit
 * @description Audit event emitter for git operations.
 * Follows Volume 2 Event Bus patterns and Volume 13 Observability requirements.
 */

import type { GitAuditEvent, GitOperation } from './interfaces.js';
import type { ToolCategory } from '../interfaces/index.js';
import { ShellAuditEmitter } from '../shell/audit.js';

/**
 * Git-specific audit emitter
 */
export class GitAuditEmitter extends ShellAuditEmitter {
  /**
   * Emit a git-specific audit event
   * @param event - The git audit event
   */
  emitGitEvent(event: GitAuditEvent): void {
    this.emit({
      eventType: event.eventType,
      category: event.category,
      command: event.operation,
      exitCode: event.exitCode,
      durationMs: event.durationMs,
      stdoutLength: 0,
      stderrLength: 0,
      allowed: event.allowed,
      taskId: event.taskId,
      traceId: event.traceId,
      agentRole: event.agentRole,
      timestamp: event.timestamp || new Date(),
    });
  }

  /**
   * Get events filtered by git operation
   * @param operation - Git operation to filter
   * @returns Filtered events
   */
  getEventsByOperation(_operation: GitOperation): GitAuditEvent[] {
    return this.getEvents().map((e) => ({
      eventType: e.eventType,
      category: e.category,
      operation: e.command as GitOperation,
      repository: '',
      branch: undefined,
      commitHash: undefined,
      exitCode: e.exitCode,
      durationMs: e.durationMs,
      allowed: e.allowed,
      taskId: e.taskId,
      traceId: e.traceId,
      agentRole: e.agentRole,
      timestamp: e.timestamp,
    }));
  }
}

/**
 * Creates a git invoked audit event
 */
export function createGitInvokedEvent(
  operation: GitOperation,
  repository: string,
  branch: string | undefined,
  taskId: string,
  traceId: string,
  agentRole: string,
): GitAuditEvent {
  return {
    eventType: 'tool.invoked',
    category: 'git.read' as ToolCategory,
    operation,
    repository,
    branch,
    allowed: true,
    taskId,
    traceId,
    agentRole,
    timestamp: new Date(),
  };
}

/**
 * Creates a git finished audit event
 */
export function createGitFinishedEvent(
  operation: GitOperation,
  repository: string,
  branch: string | undefined,
  commitHash: string | undefined,
  exitCode: number,
  durationMs: number,
  taskId: string,
  traceId: string,
  agentRole: string,
): GitAuditEvent {
  return {
    eventType: 'tool.finished',
    category: 'git.read' as ToolCategory,
    operation,
    repository,
    branch,
    commitHash,
    exitCode,
    durationMs,
    allowed: true,
    taskId,
    traceId,
    agentRole,
    timestamp: new Date(),
  };
}

/**
 * Creates a git failed audit event
 */
export function createGitFailedEvent(
  operation: GitOperation,
  repository: string,
  taskId: string,
  traceId: string,
  agentRole: string,
): GitAuditEvent {
  return {
    eventType: 'tool.failed',
    category: 'git.read' as ToolCategory,
    operation,
    repository,
    allowed: false,
    taskId,
    traceId,
    agentRole,
    timestamp: new Date(),
  };
}
