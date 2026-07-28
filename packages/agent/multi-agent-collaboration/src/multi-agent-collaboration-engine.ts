/**
 * @module multi-agent-collaboration/multi-agent-collaboration-engine
 * @description Master orchestrator for multi-agent cognitive collaboration.
 */

import type { CollaborationSession, ConsensusRequest } from './interfaces.js';
// types imported via type-only imports above
import { AgentRegistry } from './agent-registry.js';
import { AgentDirectory } from './agent-directory.js';
import { AgentSelectionEngine } from './agent-selection-engine.js';
import { CollaborationPlanner } from './collaboration-planner.js';
import { TaskDelegationEngine } from './task-delegation-engine.js';
import { CollaborationScheduler } from './collaboration-scheduler.js';
import { ConsensusEngine } from './consensus-engine.js';
import { ConflictResolutionEngine } from './conflict-resolution-engine.js';
import { SharedContextManager } from './shared-context-manager.js';
import { SharedMemoryCoordinator } from './shared-memory-coordinator.js';
import { KnowledgeSynchronizer } from './knowledge-synchronizer.js';
import { MessageRouter } from './message-router.js';
import { CollaborationCheckpointManager } from './collaboration-checkpoint-manager.js';
import { CollaborationRecoveryManager } from './collaboration-recovery-manager.js';
import { CollaborationMetricsCollector } from './collaboration-metrics.js';
import { CollaborationHookManager } from './collaboration-hook-manager.js';
import { CollaborationEventBus } from './collaboration-event-bus.js';
import { createHash } from 'crypto';

export class MultiAgentCollaborationEngine {
  public agentRegistry = new AgentRegistry();
  public agentDirectory = new AgentDirectory();
  public agentSelection = new AgentSelectionEngine();
  public planner = new CollaborationPlanner();
  public delegationEngine = new TaskDelegationEngine();
  public scheduler = new CollaborationScheduler();
  public consensusEngine = new ConsensusEngine();
  public conflictResolution = new ConflictResolutionEngine();
  public sharedContext = new SharedContextManager();
  public sharedMemory = new SharedMemoryCoordinator();
  public knowledgeSynchronizer = new KnowledgeSynchronizer();
  public messageRouter = new MessageRouter();
  public checkpointManager = new CollaborationCheckpointManager();
  public recoveryManager = new CollaborationRecoveryManager(this.checkpointManager);
  public metrics = new CollaborationMetricsCollector();
  public hooks = new CollaborationHookManager();
  public events = new CollaborationEventBus();

  async startSession(goalId: string, agentIds: string[]): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: `collab-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      traceId: `trace-${Date.now()}`,
      goalId,
      participants: [...agentIds],
      status: 'ACTIVE',
      startedAt: new Date(),
      checksum: createHash('sha256').update(JSON.stringify({ goalId, agentIds })).digest('hex'),
    };

    await this.hooks.runBeforeCollaboration(session.id);
    this.events.publish('collaboration.session.created', { sessionId: session.id });

    const plan = this.planner.plan(goalId, agentIds);
    this.events.publish('collaboration.plan.created', { planId: plan.id });

    for (const agentId of agentIds) {
      const delegation = this.delegationEngine.delegate(`task-${agentId}`, agentId, goalId, 5);
      this.scheduler.schedule(delegation);
      this.metrics.recordDelegation(10);
      this.metrics.recordAgentRegistration();
      await this.hooks.runBeforeDelegation(delegation.taskId);
      this.events.publish('collaboration.delegation.created', {
        taskId: delegation.taskId,
        agentId,
      });
    }

    const context = this.sharedContext.create(session.id, { goalId, agentIds });
    this.metrics.recordMessage();

    await this.hooks.runAfterCollaboration(session.id, { plan, context });
    this.events.publish('collaboration.session.active', { sessionId: session.id });

    return session;
  }

  async reachConsensus(proposalId: string, agentIds: string[], proposal: string): Promise<boolean> {
    const request: ConsensusRequest = { proposalId, agents: agentIds, proposal, timeout: 10000 };
    const result = await this.consensusEngine.reachConsensus(request);
    this.metrics.recordConsensus(10);
    await this.hooks.runBeforeConsensus(proposalId);
    await this.hooks.runAfterConsensus(proposalId, result.approved);
    this.events.publish('collaboration.consensus.reached', {
      proposalId,
      approved: result.approved,
    });
    return result.approved;
  }

  resolveConflict(agentIds: string[], conflictType: string, resolution: string): void {
    this.conflictResolution.resolve(agentIds, conflictType, resolution);
    this.metrics.recordConflictResolution();
    this.events.publish('collaboration.conflict.resolved', { agentIds, conflictType });
  }

  saveCheckpoint(sessionId: string): void {
    this.checkpointManager.save(sessionId, { active: 'true' }, {});
    this.events.publish('collaboration.checkpoint.saved', { sessionId });
  }

  recover(sessionId: string): boolean {
    this.metrics.recordRecovery();
    const result = this.recoveryManager.recover(sessionId);
    this.events.publish('collaboration.recovered', { sessionId, restored: result.restored });
    return result.restored;
  }
}
