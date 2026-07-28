/**
 * @module cognitive-contracts/cognitive-events
 * @description Event contracts definition and structures.
 */

export interface CognitiveEvent {
  type: string;
  timestamp: Date;
  sessionId: string;
  traceId: string;
  workflowId: string;
  correlationId: string;
  source: string;
  version: string;
  payload: Record<string, unknown>;
}

export function createCognitiveEvent(
  type: string,
  sessionId: string,
  traceId: string,
  workflowId: string,
  correlationId: string,
  source: string,
  payload: Record<string, unknown> = {},
): CognitiveEvent {
  return {
    type,
    timestamp: new Date(),
    sessionId,
    traceId,
    workflowId,
    correlationId,
    source,
    version: '1.0.0',
    payload,
  };
}
