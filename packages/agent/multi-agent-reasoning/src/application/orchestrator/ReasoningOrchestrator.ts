/**
 * @module multi-agent-reasoning/application/orchestrator/ReasoningOrchestrator
 * @description Orchestrates multi-agent reasoning sessions.
 */

import type { CollaborationSession } from '../../domain/collaboration/interfaces.js';
import { CollaborationSessionManager } from '../../domain/collaboration/CollaborationSessionManager.js';
import { TaskDelegationEngine } from '../../domain/collaboration/TaskDelegationEngine.js';
import { SharedContextManager } from '../../domain/context/SharedContextManager.js';
import { RecoveryManager } from '../../domain/recovery/RecoveryManager.js';
import { AuditTrailManager } from '../../domain/audit/AuditTrailManager.js';
import { CollaborationPlanner } from '../planner/CollaborationPlanner.js';
import { CollaborationScheduler } from '../dispatcher/CollaborationScheduler.js';
import { DecisionSynthesizer } from '../../domain/synthesis/DecisionSynthesizer.js';
import { CollaborationEventBus } from '../../infrastructure/event-bus/CollaborationEventBus.js';
import { CollaborationHookManager } from './CollaborationHookManager.js';

export interface CollaborationResult {
  sessionId: string;
  success: boolean;
  output: unknown;
}

export class ReasoningOrchestrator {
  private sessionManager = new CollaborationSessionManager();
  private delegationEngine = new TaskDelegationEngine();
  private planner = new CollaborationPlanner();
  private scheduler = new CollaborationScheduler();
  private sharedContext = new SharedContextManager();
  private recoveryManager = new RecoveryManager();
  private auditManager = new AuditTrailManager();
  private synthesizer = new DecisionSynthesizer();
  private eventBus = new CollaborationEventBus();
  private hooks = new CollaborationHookManager();

  async startCollaboration(goalId: string, agentIds: string[]): Promise<CollaborationSession> {
    const session = this.sessionManager.createSession(goalId, agentIds);
    await this.hooks.runBeforeCollaboration(session.id);
    this.eventBus.publish('collaboration.session.created', { sessionId: session.id });

    const plan = this.planner.plan(goalId, agentIds);

    for (const agentId of agentIds) {
      const delegation = this.delegationEngine.delegate(`task-${agentId}`, agentId, goalId, 5);
      this.scheduler.schedule(delegation);
    }

    const context = this.sharedContext.createContext(session.id, { goalId, agentIds });
    this.auditManager.log(session.traceId, session.id, 'session.created', { goalId, agentIds });

    await this.hooks.runAfterCollaboration(session.id, { plan, context });
    this.eventBus.publish('collaboration.session.active', { sessionId: session.id });

    return session;
  }

  async executeReasoning(session: CollaborationSession): Promise<CollaborationResult> {
    await this.hooks.runBeforeCollaboration(session.id);
    this.auditManager.log(session.traceId, session.id, 'reasoning.started', {});

    const decisions = session.participants.map((p) => ({
      agentId: p,
      decision: `decision-${p}`,
      confidence: 0.9,
    }));

    const output = this.synthesizer.synthesize(decisions);

    this.sessionManager.completeSession(session.id);
    await this.hooks.runAfterCollaboration(session.id, output);
    this.auditManager.log(
      session.traceId,
      session.id,
      'reasoning.completed',
      output as unknown as Record<string, unknown>,
    );

    return { sessionId: session.id, success: true, output };
  }

  recoverSession(sessionId: string): boolean {
    const checkpoint = this.recoveryManager.recoverFromCheckpoint(sessionId);
    if (checkpoint) {
      this.auditManager.log('', sessionId, 'recovery.started', {});
      return true;
    }
    return false;
  }
}
