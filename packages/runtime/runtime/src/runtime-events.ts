/**
 * @module runtime/runtime-events
 * @description Runtime event types for EventBus integration.
 */

export type RuntimeEventType =
  | 'runtime.started'
  | 'runtime.finished'
  | 'runtime.failed'
  | 'workflow.started'
  | 'workflow.finished'
  | 'agent.started'
  | 'agent.finished'
  | 'tool.started'
  | 'tool.finished'
  | 'approval.started'
  | 'approval.finished'
  | 'memory.updated'
  | 'knowledge.updated'
  | 'context.updated';

export interface RuntimeEvent {
  type: RuntimeEventType;
  runtimeId: string;
  traceId: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export function createRuntimeEvent(
  type: RuntimeEventType,
  runtimeId: string,
  traceId: string,
  payload: Record<string, unknown> = {},
): RuntimeEvent {
  return { type, runtimeId, traceId, timestamp: new Date(), payload };
}
