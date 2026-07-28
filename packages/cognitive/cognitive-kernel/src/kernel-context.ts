/**
 * @module cognitive-kernel/kernel-context
 * @description Context management for cognitive traces.
 */

export interface KernelContext {
  traceId: string;
  correlationId: string;
  metadata: Record<string, unknown>;
}

export function createKernelContext(traceId: string, correlationId: string): KernelContext {
  return {
    traceId,
    correlationId,
    metadata: {},
  };
}
