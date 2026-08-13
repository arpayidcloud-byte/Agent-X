// Parallel multi-agent run orchestration (Web Pro).
//
// Wires the multi-agent-collaboration package's ParallelWorkflow to the LLM
// router: each specialist phase (architect → coder → reviewer → tester)
// produces its output by calling the router (mock providers in dev/demo).
// Run state is kept in-memory per process (like taskStore) and lifecycle
// events are published on the multi-agent event bus for SSE consumers.

import {
  MultiAgentCollaborationEngine,
  registerSpecialistAgents,
  ParallelWorkflow,
  type PhaseExecutor,
  type ParallelWorkflowResult,
} from '@agent-xai/multi-agent-collaboration';
import { router } from './agentx-server.js';
import { executeRoute } from './combo-router.js';
import { publishMultiAgentEvent, type MultiAgentStreamEvent } from './multi-agent-stream.js';

export interface MultiAgentRun {
  runId: string;
  orgId: string;
  status: 'running' | 'completed' | 'error';
  concurrency: number;
  goals: Array<{ goalId: string; description: string }>;
  startedAt: string;
  completedAt?: string;
  result?: ParallelWorkflowResult;
  error?: string;
}

const runs = new Map<string, MultiAgentRun>();
const MAX_RUNS = 50;

function evictIfNeeded(): void {
  if (runs.size < MAX_RUNS) return;
  const oldest = [...runs.keys()].shift();
  if (oldest) runs.delete(oldest);
}

export function getMultiAgentRun(runId: string): MultiAgentRun | undefined {
  return runs.get(runId);
}

/** Active (in-progress) runs — feeds the CLI Command Deck AGENTS panel. */
export function getActiveRuns(): MultiAgentRun[] {
  return [...runs.values()].filter((r) => r.status === 'running');
}

/** Most recent runs (any status) — lets the deck show recent agent activity. */
export function getRecentRuns(limit = 3): MultiAgentRun[] {
  return [...runs.values()].sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)).slice(0, limit);
}

const PHASE_PROMPTS: Record<string, (description: string, ctx: Record<string, unknown>) => string> =
  {
    architect: (d) =>
      `You are the Architect Agent. Design the system architecture for: ${d}. ` +
      `Output a concise architecture plan with components and interfaces.`,
    coder: (d, ctx) =>
      `You are the Coder Agent. Implement the feature for: ${d}. ` +
      `Architecture context: ${typeof ctx.architect === 'string' ? ctx.architect : 'none'}. ` +
      `Output concrete code or implementation details.`,
    reviewer: (d, ctx) =>
      `You are the Reviewer Agent. Review this implementation for correctness and quality: ` +
      `"${typeof ctx.coder === 'string' ? ctx.coder : 'no implementation'}" (goal: ${d}). ` +
      `If it is acceptable, reply starting with APPROVE. If changes are required, reply starting with REJECT and explain.`,
    tester: (d, ctx) =>
      `You are the Tester Agent. Define tests that validate this implementation: ` +
      `"${typeof ctx.coder === 'string' ? ctx.coder : 'no implementation'}" (goal: ${d}). ` +
      `Output concrete test cases and acceptance criteria.`,
  };

/**
 * Executor that routes each specialist phase through the LLM router.
 * The reviewer's "REJECT" marker (when the model asks for changes) feeds the
 * specialist workflow's peer-review loop naturally.
 */
function makeRouterExecutor(): PhaseExecutor {
  return async ({ role, goalId, description, iteration: _iteration, context }) => {
    const prompt = PHASE_PROMPTS[role]?.(description, context) ?? `Process ${role} for ${goalId}`;
    const request = {
      taskId: `ma-${role}-${goalId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      description: prompt.slice(0, 120),
      complexity: role === 'architect' ? ('complex' as const) : ('medium' as const),
      type: 'reasoning' as const,
      budget: 'medium' as const,
    };
    const response = await executeRoute(router, request, prompt);
    return response.message;
  };
}

export function startParallelRun(input: {
  goals: string[];
  concurrency: number;
  orgId: string;
}): MultiAgentRun {
  const runId = `ma-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = new Date().toISOString();
  const goalInputs = input.goals.map((description, i) => ({
    goalId: `goal-${i + 1}-${Math.random().toString(36).slice(2, 6)}`,
    description,
  }));

  const run: MultiAgentRun = {
    runId,
    orgId: input.orgId,
    status: 'running',
    concurrency: input.concurrency,
    goals: goalInputs,
    startedAt,
  };
  evictIfNeeded();
  runs.set(runId, run);

  publishMultiAgentEvent({
    type: 'run-accepted',
    runId,
    goalIds: goalInputs.map((g) => g.goalId),
    concurrency: input.concurrency,
    at: startedAt,
  });

  // Background worker: run all goals in parallel, publishing per-goal events.
  void (async () => {
    try {
      const engine = new MultiAgentCollaborationEngine();
      registerSpecialistAgents(engine.agentRegistry, engine.agentDirectory);
      const workflow = new ParallelWorkflow(engine, { concurrency: input.concurrency });

      // Hook per-goal lifecycle into the event bus.
      const workflowWithEvents = {
        ...workflow,
        run: async (
          goals: Array<{ goalId: string; description: string }>,
          executor: PhaseExecutor,
        ) => {
          const active = { current: 0, max: 0 };
          const result = await workflow.run(
            goals.map((g, index) => {
              publishMultiAgentEvent({
                type: 'goal-start',
                runId,
                goalId: g.goalId,
                index,
                at: new Date().toISOString(),
              });
              return g;
            }),
            async (params) => {
              active.current++;
              active.max = Math.max(active.max, active.current);
              try {
                return await executor(params);
              } finally {
                active.current--;
              }
            },
          );
          return result;
        },
      };

      const result = await workflowWithEvents.run(goalInputs, makeRouterExecutor());

      for (const g of result.goals) {
        publishMultiAgentEvent({
          type: 'goal-complete',
          runId,
          goalId: g.goalId,
          approved: g.approved,
          iterations: g.iterations,
          error: g.error,
          at: new Date().toISOString(),
        });
      }

      run.status = 'completed';
      run.completedAt = new Date().toISOString();
      run.result = result;
      publishMultiAgentEvent({
        type: 'run-complete',
        runId,
        approvedCount: result.approvedCount,
        totalGoals: result.totalGoals,
        wallTimeMs: result.wallTimeMs,
        at: run.completedAt,
      });
    } catch (e) {
      run.status = 'error';
      run.error = e instanceof Error ? e.message : String(e);
      run.completedAt = new Date().toISOString();
      publishMultiAgentEvent({
        type: 'run-complete',
        runId,
        approvedCount: 0,
        totalGoals: run.goals.length,
        wallTimeMs: 0,
        at: run.completedAt,
      });
    }
  })();

  return run;
}

export type { MultiAgentStreamEvent };
