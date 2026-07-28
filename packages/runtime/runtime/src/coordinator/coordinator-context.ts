/**
 * @module coordinator/coordinator-context
 * @description Context management with trace propagation and correlation.
 */

export interface CoordinatorContext {
  traceId: string;
  correlationId: string;
  workflowId?: string;
  executionId: string;
  sessionId: string;
  metadata: Record<string, unknown>;
}

export function createCoordinatorContext(
  traceId: string,
  sessionId: string,
  executionId: string,
  correlationId?: string,
): CoordinatorContext {
  return {
    traceId,
    sessionId,
    executionId,
    correlationId:
      correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    metadata: {},
  };
}

export function extendCoordinatorContext(
  ctx: CoordinatorContext,
  updates: Partial<CoordinatorContext>,
): CoordinatorContext {
  return {
    ...ctx,
    ...updates,
    metadata: { ...ctx.metadata, ...updates.metadata },
  };
}
