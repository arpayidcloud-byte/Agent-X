// Real-time task event bus (Web Pro: SSE streaming).
//
// Task lifecycle events are published here by background workers and
// consumed by the SSE endpoint (GET /v1/agentx/tasks/:id/events). The bus is
// in-memory per process — fine for a single-node demo deployment; events are
// also buffered per task so a late subscriber can replay the history.
import { EventEmitter } from 'node:events';

export type TaskStreamEvent =
  | { type: 'accepted'; taskId: string; at: string }
  | { type: 'generating'; taskId: string; at: string }
  | {
      type: 'complete';
      taskId: string;
      status: 'success' | 'error';
      provider?: string;
      model?: string;
      response?: string;
      error?: string;
      at: string;
    };

const bus = new EventEmitter();
const history = new Map<string, TaskStreamEvent[]>();

export function publishEvent(ev: TaskStreamEvent): void {
  const list = history.get(ev.taskId) ?? [];
  list.push(ev);
  history.set(ev.taskId, list);
  bus.emit(ev.taskId, ev);
}

export function getTaskEventHistory(taskId: string): TaskStreamEvent[] {
  return history.get(taskId) ?? [];
}

/** Subscribe to live events for a task. Returns an unsubscribe function. */
export function subscribeTask(taskId: string, handler: (ev: TaskStreamEvent) => void): () => void {
  bus.on(taskId, handler);
  return () => {
    bus.off(taskId, handler);
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Small pacing delay between lifecycle stages. Mock providers resolve in
 * milliseconds, which would make every SSE stream look like a single blob;
 * the pacing only makes the real stage transitions observable in the UI.
 */
export const STAGE_DELAY_MS = 150;
