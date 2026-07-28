/**
 * @module provider-release/compatibility-events
 * @description Event emission for PCMRC events.
 */

export interface ReleaseEvent {
  type: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export class ReleaseEventEmitter {
  private events: ReleaseEvent[] = [];

  emit(type: string, payload: Record<string, unknown> = {}): void {
    this.events.push({
      type,
      timestamp: new Date(),
      payload,
    });
  }

  getEvents(): ReleaseEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}
