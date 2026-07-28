/**
 * @module cognitive-learning/events
 * @description Learning-specific event bus.
 */

export class LearningEventBus {
  private listeners = new Map<string, Array<(...args: unknown[]) => void>>();

  publish(type: string, payload: unknown): void {
    const list = this.listeners.get(type) || [];
    for (const fn of list) fn(payload);
  }

  subscribe(type: string, fn: (...args: unknown[]) => void): void {
    const current = this.listeners.get(type) || [];
    this.listeners.set(type, [...current, fn]);
  }

  clear(): void {
    this.listeners.clear();
  }
}
