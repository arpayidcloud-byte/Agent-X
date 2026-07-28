/**
 * @module cognitive-kernel/kernel-events
 * @description Event publishing and subscription wrappers.
 */

export class KernelEventBus {
  private listeners = new Map<string, Function[]>();

  publish(type: string, payload: unknown): void {
    const typeListeners = this.listeners.get(type) || [];
    for (const listener of typeListeners) {
      listener(payload);
    }
  }

  subscribe(type: string, listener: Function): void {
    const current = this.listeners.get(type) || [];
    this.listeners.set(type, [...current, listener]);
  }

  clear(): void {
    this.listeners.clear();
  }
}
