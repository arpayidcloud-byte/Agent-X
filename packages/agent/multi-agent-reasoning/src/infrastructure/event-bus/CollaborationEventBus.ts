/**
 * @module multi-agent-reasoning/infrastructure/event-bus/CollaborationEventBus
 * @description Collaboration event bus.
 */

export class CollaborationEventBus {
  private listeners = new Map<string, Function[]>();

  publish(type: string, payload: Record<string, unknown> = {}): void {
    const list = this.listeners.get(type) || [];
    for (const fn of list) fn({ type, timestamp: new Date(), payload });
  }

  subscribe(type: string, fn: Function): void {
    const current = this.listeners.get(type) || [];
    this.listeners.set(type, [...current, fn]);
  }

  clear(): void {
    this.listeners.clear();
  }
}
