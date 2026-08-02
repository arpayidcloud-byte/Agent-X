/**
 * @module multi-agent-collaboration/parallel-workflow.test
 * @description Tests for ParallelWorkflow: bounded concurrency, per-goal
 * isolation, and failure containment across independent workstreams.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  MultiAgentCollaborationEngine,
  registerSpecialistAgents,
  ParallelWorkflow,
  CollaborationError,
} from '../src/index.js';
import type { PhaseExecutor } from '../src/index.js';

function makeEngine(): MultiAgentCollaborationEngine {
  const engine = new MultiAgentCollaborationEngine();
  registerSpecialistAgents(engine.agentRegistry, engine.agentDirectory);
  return engine;
}

/** Executor that tracks concurrent invocations to prove the pool bound. */
function trackingExecutor(active: { current: number; max: number }): PhaseExecutor {
  return async ({ role, goalId }) => {
    active.current++;
    active.max = Math.max(active.max, active.current);
    // Small delay so concurrency is observable.
    await new Promise((resolve) => setTimeout(resolve, 20));
    active.current--;
    return `[${role}] handled ${goalId}`;
  };
}

describe('ParallelWorkflow', () => {
  let engine: MultiAgentCollaborationEngine;

  beforeEach(() => {
    engine = makeEngine();
  });

  it('runs all goals to completion with separate sessions', async () => {
    const workflow = new ParallelWorkflow(engine, { concurrency: 2 });
    const result = await workflow.run(
      [
        { goalId: 'goal-a', description: 'Build API A' },
        { goalId: 'goal-b', description: 'Build API B' },
        { goalId: 'goal-c', description: 'Build API C' },
      ],
      async ({ role }) => `output of ${role}`,
    );

    expect(result.totalGoals).toBe(3);
    expect(result.approvedCount).toBe(3);
    expect(result.goals).toHaveLength(3);
    expect(result.goals.map((g) => g.goalId)).toEqual(['goal-a', 'goal-b', 'goal-c']);
    // Each goal has its own collaboration session.
    const sessionIds = new Set(result.goals.map((g) => g.sessionId));
    expect(sessionIds.size).toBe(3);
    // Full pipeline ran per goal.
    for (const g of result.goals) {
      expect(g.phases.map((p) => p.role)).toEqual(['architect', 'coder', 'reviewer', 'tester']);
      expect(g.approved).toBe(true);
    }
  });

  it('never exceeds the configured concurrency', async () => {
    const active = { current: 0, max: 0 };
    const workflow = new ParallelWorkflow(engine, { concurrency: 2 });
    await workflow.run(
      [
        { goalId: 'g1', description: 'one' },
        { goalId: 'g2', description: 'two' },
        { goalId: 'g3', description: 'three' },
        { goalId: 'g4', description: 'four' },
      ],
      trackingExecutor(active),
    );
    expect(active.max).toBeLessThanOrEqual(2);
    expect(active.max).toBeGreaterThan(1); // parallelism actually happened
  });

  it('clamps concurrency to [1, 4]', () => {
    expect(new ParallelWorkflow(engine, { concurrency: 99 }).concurrency).toBe(4);
    expect(new ParallelWorkflow(engine, { concurrency: 0 }).concurrency).toBe(1);
    expect(new ParallelWorkflow(engine).concurrency).toBe(2);
  });

  it('contains a failing goal without aborting the others', async () => {
    const workflow = new ParallelWorkflow(engine, { concurrency: 2 });
    const result = await workflow.run(
      [
        { goalId: 'good-1', description: 'ok' },
        { goalId: 'boom', description: 'will fail' },
        { goalId: 'good-2', description: 'ok too' },
      ],
      async ({ role, goalId }) => {
        if (goalId === 'boom' && role === 'coder') {
          throw new Error('simulated coder failure');
        }
        return `output of ${role}`;
      },
    );

    expect(result.totalGoals).toBe(3);
    const boom = result.goals.find((g) => g.goalId === 'boom');
    expect(boom?.approved).toBe(false);
    expect(boom?.error).toContain('simulated coder failure');

    const good = result.goals.filter((g) => g.goalId !== 'boom');
    expect(good.every((g) => g.approved && !g.error)).toBe(true);
  });

  it('rejects empty goal lists', async () => {
    const workflow = new ParallelWorkflow(engine);
    await expect(workflow.run([], async () => 'x')).rejects.toThrow(CollaborationError);
  });
});
