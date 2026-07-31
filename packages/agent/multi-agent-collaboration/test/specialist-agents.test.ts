/**
 * @module multi-agent-collaboration/specialist-agents.test
 * @description Tests for specialist agent definitions and the specialist workflow
 * (architect → coder → reviewer → tester, with peer-review loop).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  MultiAgentCollaborationEngine,
  AgentRegistry,
  AgentDirectory,
  registerSpecialistAgents,
  SpecialistWorkflow,
  SPECIALIST_AGENTS,
  specialistByRole,
  CollaborationError,
} from '../src/index.js';
import type { PhaseExecutor } from '../src/index.js';

describe('Specialist agents', () => {
  it('defines the four roadmap specialists with correct capabilities', () => {
    const roles = SPECIALIST_AGENTS.map((a) => a.role);
    expect(roles).toEqual(['architect', 'coder', 'reviewer', 'tester']);

    expect(specialistByRole('architect').capabilities).toContain('architecture');
    expect(specialistByRole('coder').capabilities).toContain('implementation');
    expect(specialistByRole('reviewer').capabilities).toContain('code-review');
    expect(specialistByRole('tester').capabilities).toContain('testing');
  });

  it('registers specialists into registry and directory', () => {
    const registry = new AgentRegistry();
    const directory = new AgentDirectory();
    const metadata = registerSpecialistAgents(registry, directory);

    expect(metadata.length).toBe(4);
    expect(registry.list().length).toBe(4);

    // Directory discovery routes capability → right specialist.
    const arch = directory.discover(['architecture']);
    expect(arch.matchedAgents).toContain('agent-architect');

    const coder = directory.discover(['implementation']);
    expect(coder.matchedAgents).toContain('agent-coder');

    const review = directory.discover(['code-review']);
    expect(review.matchedAgents).toContain('agent-reviewer');

    const test = directory.discover(['testing']);
    expect(test.matchedAgents).toContain('agent-tester');
  });
});

describe('SpecialistWorkflow', () => {
  let engine: MultiAgentCollaborationEngine;

  beforeEach(() => {
    engine = new MultiAgentCollaborationEngine();
    registerSpecialistAgents(engine.agentRegistry, engine.agentDirectory);
  });

  it('runs the full pipeline and approves when review passes', async () => {
    const workflow = new SpecialistWorkflow(engine);
    const result = await workflow.run('goal-1', 'Build a todo API');

    expect(result.approved).toBe(true);
    expect(result.iterations).toBe(1);
    expect(result.sessionId).toMatch(/^collab-/);

    const roles = result.phases.map((p) => p.role);
    expect(roles).toEqual(['architect', 'coder', 'reviewer', 'tester']);

    const agents = result.phases.map((p) => p.agentId);
    expect(agents).toEqual(['agent-architect', 'agent-coder', 'agent-reviewer', 'agent-tester']);

    // Phase outputs are persisted to the shared context of the session.
    const ctx = engine.sharedContext.get(result.sessionId);
    expect(ctx).toBeDefined();
    const phases = ctx?.data.phases as Record<string, unknown>;
    expect(phases?.architect).toBeTruthy();
    expect(phases?.tester).toBeTruthy();
  });

  it('routes reviewer rejection back to the coder (peer-review loop)', async () => {
    const executor: PhaseExecutor = async ({ role, iteration }) => {
      if (role === 'reviewer') {
        return iteration === 1 ? 'REJECT: missing error handling' : 'APPROVE';
      }
      return `output of ${role} (iter ${iteration ?? 1})`;
    };

    const workflow = new SpecialistWorkflow(engine, { maxReviewIterations: 3 });
    const result = await workflow.run('goal-2', 'Retry logic', executor);

    expect(result.approved).toBe(true);
    expect(result.iterations).toBe(2);

    // First review rejected, second approved.
    const reviews = result.phases.filter((p) => p.role === 'reviewer');
    expect(reviews.length).toBe(2);
    expect(reviews[0]?.status).toBe('REJECTED');
    expect(reviews[1]?.status).toBe('COMPLETED');

    // Coder ran twice (initial + rework after rejection).
    const coders = result.phases.filter((p) => p.role === 'coder');
    expect(coders.length).toBe(2);

    // Review feedback is in the shared context.
    const ctx = engine.sharedContext.get(result.sessionId);
    const phases = ctx?.data.phases as Record<string, unknown>;
    const reviewer = phases?.reviewer as { status: string; output: string };
    expect(reviewer.output).toContain('APPROVE');
  });

  it('stops with approved=false when reviewer keeps rejecting', async () => {
    const executor: PhaseExecutor = async ({ role }) =>
      role === 'reviewer' ? 'REJECT: always' : `output of ${role}`;

    const workflow = new SpecialistWorkflow(engine, { maxReviewIterations: 3 });
    const result = await workflow.run('goal-3', 'Hard goal', executor);

    expect(result.approved).toBe(false);
    expect(result.iterations).toBe(3);

    const reviews = result.phases.filter((p) => p.role === 'reviewer');
    expect(reviews.length).toBe(3);
    expect(reviews.every((r) => r.status === 'REJECTED')).toBe(true);

    // Tester never ran.
    expect(result.phases.some((p) => p.role === 'tester')).toBe(false);
  });

  it('throws when a specialist is missing from the directory', async () => {
    // Register only some specialists.
    const partial = new MultiAgentCollaborationEngine();
    partial.agentDirectory.register('agent-architect', ['architecture'], 10, 4);
    partial.agentRegistry.register({
      id: 'agent-architect',
      name: 'Architect Agent',
      version: '1.0.0',
      type: 'specialist',
      capabilities: ['architecture'],
      checksum: '',
    });

    const workflow = new SpecialistWorkflow(partial);
    await expect(workflow.run('goal-4', 'Missing team')).rejects.toThrow(CollaborationError);
  });

  it('rejects invalid maxReviewIterations', () => {
    expect(() => new SpecialistWorkflow(engine, { maxReviewIterations: 0 })).toThrow(
      CollaborationError,
    );
  });
});
