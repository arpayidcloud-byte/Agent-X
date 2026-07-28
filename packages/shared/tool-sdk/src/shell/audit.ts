/**
 * @module shell/audit
 * @description Audit event emitter for shell execution.
 * Implements audit trail for tool.invoked, tool.finished, tool.failed events.
 * Follows Volume 2 Event Bus patterns and Volume 13 Observability requirements.
 */

import type { ShellAuditEvent, ToolCategory } from './interfaces.js';

/**
 * In-memory audit emitter for shell execution events
 */
export class ShellAuditEmitter {
  private events: ShellAuditEvent[] = [];

  /**
   * Emit an audit event
   * @param event - The audit event to emit
   */
  emit(event: ShellAuditEvent): void {
    this.events.push({
      ...event,
      timestamp: event.timestamp || new Date(),
    });
  }

  /**
   * Get all emitted events
   * @returns Array of audit events
   */
  getEvents(): ShellAuditEvent[] {
    return [...this.events];
  }

  /**
   * Get events filtered by type
   * @param eventType - The event type to filter
   * @returns Filtered audit events
   */
  getEventsByType(eventType: ShellAuditEvent['eventType']): ShellAuditEvent[] {
    return this.events.filter((e) => e.eventType === eventType);
  }

  /**
   * Get events for a specific task
   * @param taskId - The task ID to filter
   * @returns Filtered audit events
   */
  getEventsByTask(taskId: string): ShellAuditEvent[] {
    return this.events.filter((e) => e.taskId === taskId);
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
  }
}

/**
 * Creates a shell invoked audit event
 */
export function createToolInvokedEvent(
  command: string,
  category: ToolCategory,
  taskId: string,
  traceId: string,
  agentRole: string,
): ShellAuditEvent {
  return {
    eventType: 'tool.invoked',
    category,
    command,
    allowed: true,
    taskId,
    traceId,
    agentRole,
    timestamp: new Date(),
  };
}

/**
 * Creates a shell finished audit event
 */
export function createToolFinishedEvent(
  command: string,
  category: ToolCategory,
  exitCode: number,
  durationMs: number,
  stdoutLength: number,
  stderrLength: number,
  taskId: string,
  traceId: string,
  agentRole: string,
  timedOut: boolean = false,
): ShellAuditEvent {
  return {
    eventType: 'tool.finished',
    category,
    command,
    exitCode,
    durationMs,
    stdoutLength,
    stderrLength,
    allowed: true,
    timedOut,
    taskId,
    traceId,
    agentRole,
    timestamp: new Date(),
  };
}

/**
 * Creates a shell failed audit event
 */
export function createToolFailedEvent(
  command: string,
  category: ToolCategory,
  taskId: string,
  traceId: string,
  agentRole: string,
  _reason: string,
): ShellAuditEvent {
  return {
    eventType: 'tool.failed',
    category,
    command,
    allowed: false,
    taskId,
    traceId,
    agentRole,
    timestamp: new Date(),
  };
}
