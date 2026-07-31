/**
 * @module multi-agent-collaboration/specialist-workflow
 * @description Orchestrates a goal through the specialist team:
 *
 *   architect → coder → reviewer → (reject → coder again) → tester
 *
 * The reviewer acts as the peer-review loop from the roadmap (Week 11-12):
 * a rejection sends the implementation back to the coder with the review
 * feedback attached to the shared context, up to `maxReviewIterations`.
 */

import type { MultiAgentCollaborationEngine } from './multi-agent-collaboration-engine.js';
import { CollaborationError } from './errors.js';
import { specialistByRole, type SpecialistRole } from './specialist-agents.js';

export interface PhaseExecutorParams {
  role: SpecialistRole;
  agentId: string;
  goalId: string;
  description: string;
  /** Current coder/reviewer iteration (1 = first pass). */
  iteration: number;
  /** Shared context accumulated so far (previous phase outputs, review feedback). */
  context: Record<string, unknown>;
}

export type PhaseExecutor = (params: PhaseExecutorParams) => Promise<string>;

export interface WorkflowPhaseResult {
  role: SpecialistRole;
  agentId: string;
  /** 'COMPLETED' = phase output produced; 'REJECTED' = reviewer requested changes. */
  status: 'COMPLETED' | 'REJECTED';
  output: string;
  startedAt: Date;
  completedAt: Date;
}

export interface SpecialistWorkflowResult {
  goalId: string;
  sessionId: string;
  approved: boolean;
  /** Number of coder iterations (1 = first pass, >1 = review loop engaged). */
  iterations: number;
  phases: WorkflowPhaseResult[];
  summary: Record<string, unknown>;
}

const PHASE_CAPABILITIES: Record<SpecialistRole, string[]> = {
  architect: ['architecture'],
  coder: ['implementation'],
  reviewer: ['code-review'],
  tester: ['testing'],
};

const PHASE_ORDER: SpecialistRole[] = ['architect', 'coder', 'reviewer', 'tester'];

const DEFAULT_EXECUTOR: PhaseExecutor = async ({ role, agentId, goalId }) =>
  `[${role}] ${agentId} processed goal "${goalId}".`;

export class SpecialistWorkflow {
  private readonly maxReviewIterations: number;

  constructor(
    private readonly engine: MultiAgentCollaborationEngine,
    options: { maxReviewIterations?: number } = {},
  ) {
    this.maxReviewIterations = options.maxReviewIterations ?? 3;
    if (this.maxReviewIterations < 1) {
      throw new CollaborationError(
        'maxReviewIterations must be >= 1',
        'INVALID_OPTIONS',
        'specialist-workflow',
      );
    }
  }

  /**
   * Runs the specialist pipeline for a goal.
   *
   * @param executor optional per-phase executor (defaults to a generic stub).
   *        A reviewer executor should include the marker "REJECT" in its output
   *        to request changes, which loops the implementation back to the coder.
   */
  async run(
    goalId: string,
    description: string,
    executor: PhaseExecutor = DEFAULT_EXECUTOR,
  ): Promise<SpecialistWorkflowResult> {
    const { engine } = this;
    const agentIds = PHASE_ORDER.map((role) => specialistByRole(role).id);

    // Assemble the team: session + plan + per-agent engagement delegations.
    const session = await engine.startSession(goalId, agentIds);

    const context: Record<string, unknown> = { goalId, description };
    const phases: WorkflowPhaseResult[] = [];
    let iterations = 0;
    let approved = false;

    // Architect phase (runs once).
    phases.push(await this.executePhase('architect', goalId, description, context, executor, 1));

    // Coder ↔ Reviewer loop.
    while (iterations < this.maxReviewIterations) {
      iterations++;
      phases.push(
        await this.executePhase('coder', goalId, description, context, executor, iterations),
      );
      const review = await this.executePhase(
        'reviewer',
        goalId,
        description,
        context,
        executor,
        iterations,
      );
      phases.push(review);

      if (review.output.includes('REJECT')) {
        review.status = 'REJECTED';
        context.reviewFeedback = review.output;
        context.iteration = iterations;
        this.engine.events.publish('specialist.review.rejected', {
          goalId,
          iteration: iterations,
        });
        continue;
      }

      // Review passed → tester validates.
      phases.push(
        await this.executePhase('tester', goalId, description, context, executor, iterations),
      );
      approved = true;
      break;
    }

    // Persist final phase outputs into the shared context for the session.
    const summary: Record<string, unknown> = {};
    for (const phase of phases) {
      summary[phase.role] = { status: phase.status, output: phase.output };
    }
    summary.approved = approved;
    summary.iterations = iterations;
    engine.sharedContext.update(session.id, { phases: summary });

    this.engine.events.publish('specialist.workflow.completed', {
      goalId,
      sessionId: session.id,
      approved,
      iterations,
    });

    return { goalId, sessionId: session.id, approved, iterations, phases, summary };
  }

  private async executePhase(
    role: SpecialistRole,
    goalId: string,
    description: string,
    context: Record<string, unknown>,
    executor: PhaseExecutor,
    iteration: number,
  ): Promise<WorkflowPhaseResult> {
    const { engine } = this;
    const def = specialistByRole(role);
    const capabilities = PHASE_CAPABILITIES[role];

    // Verify the specialist is registered and can take work.
    const match = engine.agentDirectory.discover(capabilities);
    if (!match.matchedAgents.includes(def.id)) {
      throw new CollaborationError(
        `Specialist ${role} (${def.id}) is not registered in the agent directory`,
        'SPECIALIST_NOT_REGISTERED',
        'specialist-workflow',
      );
    }
    if (!engine.agentDirectory.allocate(def.id)) {
      throw new CollaborationError(
        `Specialist ${role} (${def.id}) has no free work slots`,
        'SPECIALIST_BUSY',
        'specialist-workflow',
      );
    }

    const startedAt = new Date();
    const taskId = `task-${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const delegation = engine.delegationEngine.delegate(taskId, def.id, goalId, 5);
    engine.scheduler.schedule(delegation);
    engine.metrics.recordDelegation(10);

    try {
      const output = await executor({
        role,
        agentId: def.id,
        goalId,
        description,
        iteration,
        context: { ...context },
      });
      const completedAt = new Date();
      context[role] = output;
      engine.events.publish('specialist.phase.completed', {
        goalId,
        role,
        agentId: def.id,
      });
      return { role, agentId: def.id, status: 'COMPLETED', output, startedAt, completedAt };
    } finally {
      engine.agentDirectory.release(def.id);
    }
  }
}
