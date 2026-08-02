// Real-time event bus for parallel multi-agent runs (Web Pro).
//
// Same pattern as task-stream/chat-stream: in-memory EventEmitter + per-run
// history buffer so a late SSE subscriber can replay what already happened.
// Events describe the progress of a parallel run (goals starting/completing)
// rather than individual LLM calls — the per-goal specialist pipeline
// telemetry stays in the collaboration engine.

import { EventEmitter } from 'node:events';

export type MultiAgentStreamEvent =
  | {
      type: 'run-accepted';
      runId: string;
      goalIds: string[];
      concurrency: number;
      at: string;
    }
  | { type: 'goal-start'; runId: string; goalId: string; index: number; at: string }
  | {
      type: 'goal-complete';
      runId: string;
      goalId: string;
      approved: boolean;
      iterations: number;
      error?: string;
      at: string;
    }
  | {
      type: 'run-complete';
      runId: string;
      approvedCount: number;
      totalGoals: number;
      wallTimeMs: number;
      at: string;
    };

const bus = new EventEmitter();
const history = new Map<string, MultiAgentStreamEvent[]>();

export function publishMultiAgentEvent(ev: MultiAgentStreamEvent): void {
  const list = history.get(ev.runId) ?? [];
  list.push(ev);
  history.set(ev.runId, list);
  bus.emit(ev.runId, ev);
}

export function getMultiAgentEventHistory(runId: string): MultiAgentStreamEvent[] {
  return history.get(runId) ?? [];
}

export function subscribeMultiAgent(
  runId: string,
  handler: (ev: MultiAgentStreamEvent) => void,
): () => void {
  bus.on(runId, handler);
  return () => {
    bus.off(runId, handler);
  };
}
