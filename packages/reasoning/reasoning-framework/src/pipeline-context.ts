/**
 * @module reasoning-framework/pipeline-context
 * @description Contextual state passed between pipeline stages.
 */

export interface PipelineContext {
  sessionId: string;
  traceId: string;
  currentStage: string;
  metadata: Record<string, unknown>;
}

export function createPipelineContext(sessionId: string, traceId: string): PipelineContext {
  return {
    sessionId,
    traceId,
    currentStage: 'INPUT',
    metadata: {},
  };
}
