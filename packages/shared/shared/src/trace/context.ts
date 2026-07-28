import { AsyncLocalStorage } from 'async_hooks';
import type { LogContext } from '../logger/interfaces.js';

export class TraceContext {
  private static storage = new AsyncLocalStorage<LogContext>();

  /**
   * Run a function within a new or extended trace context.
   */
  public static run<T>(context: LogContext, fn: () => T): T {
    const current = this.storage.getStore() || {};
    const merged = { ...current, ...context };
    return this.storage.run(merged, fn);
  }

  /**
   * Run an asynchronous function within a new or extended trace context.
   */
  public static async runAsync<T>(context: LogContext, fn: () => Promise<T>): Promise<T> {
    const current = this.storage.getStore() || {};
    const merged = { ...current, ...context };
    return this.storage.run(merged, fn);
  }

  /**
   * Get the current trace context.
   */
  public static get(): LogContext | undefined {
    return this.storage.getStore();
  }

  /**
   * Create a new unique correlation ID.
   */
  public static generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }
}
