/**
 * @module reasoning-framework/pipeline-events
 * @description Event emission structure.
 */

export interface ReasoningEvent {
  type: string;
  traceId: string;
  sessionId: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export class PipelineEventEmitter {
  private events: ReasoningEvent[] = [];

  emit(type: string, traceId: string, sessionId: string, payload: Record<string, unknown>): void {
    this.events.push({ type, traceId, sessionId, timestamp: new Date(), payload });
  }

  getEvents(): ReasoningEvent[] {
    return [...this.events];
  }
}
