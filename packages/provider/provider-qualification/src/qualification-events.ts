/**
 * @module provider-qualification/qualification-events
 * @description Event emitter and payload builder.
 */

export interface QualificationEvent {
  type: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export class QualificationEventEmitter {
  private events: QualificationEvent[] = [];

  emit(type: string, payload: Record<string, unknown> = {}): void {
    this.events.push({
      type,
      timestamp: new Date(),
      payload,
    });
  }

  getEvents(): QualificationEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}
