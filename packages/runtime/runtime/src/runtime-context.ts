/**
 * @module runtime/runtime-context
 * @description Runtime context management for execution state.
 */

export interface RuntimeContext {
  traceId: string;
  sessionId: string;
  workflowId?: string;
  agentId?: string;
  toolId?: string;
  metadata: Record<string, unknown>;
}

export function createContext(traceId: string, sessionId: string): RuntimeContext {
  return { traceId, sessionId, metadata: {} };
}

export function extendContext(
  ctx: RuntimeContext,
  updates: Partial<RuntimeContext>,
): RuntimeContext {
  return { ...ctx, ...updates, metadata: { ...ctx.metadata, ...updates.metadata } };
}
