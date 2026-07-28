export interface DistributedEvent {
  readonly eventType: string;
  readonly sourceNode: string;
  readonly payload: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export type EventListener = (event: DistributedEvent) => void;

export class DistributedEventBus {
  private listeners = new Map<string, EventListener[]>();
  private eventLog: DistributedEvent[] = [];

  publish(event: DistributedEvent): void {
    this.eventLog.push(Object.freeze({ ...event }));
    const handlers = this.listeners.get(event.eventType) || [];
    for (const handler of handlers) {
      handler(event);
    }
  }

  subscribe(eventType: string, listener: EventListener): void {
    const current = this.listeners.get(eventType) || [];
    this.listeners.set(eventType, [...current, listener]);
  }

  unsubscribe(eventType: string): void {
    this.listeners.delete(eventType);
  }

  getEventLog(): DistributedEvent[] {
    return [...this.eventLog];
  }

  getListeners(eventType: string): EventListener[] {
    return [...(this.listeners.get(eventType) || [])];
  }

  clear(): void {
    this.listeners.clear();
  }
}
