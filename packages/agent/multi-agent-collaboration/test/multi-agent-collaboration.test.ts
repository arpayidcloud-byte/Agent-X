/**
 * @module multi-agent-collaboration/multi-agent-collaboration.test
 * @description Comprehensive tests for M5.6 Multi-Agent Cognitive Collaboration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  MultiAgentCollaborationEngine,
  AgentRegistry,
  AgentDirectory,
  AgentSelectionEngine,
  CollaborationPlanner,
  TaskDelegationEngine,
  CollaborationScheduler,
  ConsensusEngine,
  ConflictResolutionEngine,
  SharedContextManager,
  SharedMemoryCoordinator,
  KnowledgeSynchronizer,
  MessageRouter,
  CollaborationCheckpointManager,
  CollaborationRecoveryManager,
  CollaborationMetricsCollector,
  CollaborationHookManager,
  CollaborationEventBus,
  CollaborationError,
  AgentError,
  DelegationError,
  ConsensusError,
  ConflictError,
  SharedMemoryError,
  CircularDelegationError,
  AgentMetadata,
  CollaborationSession,
  AgentDirectoryEntry,
  AgentMessage,
  CollaborationHook,
} from '../src/index.js';

const makeAgent = (id: string, capabilities: string[] = ['compute']): AgentMetadata => ({
  id,
  name: `Agent ${id}`,
  version: '1.0',
  type: 'worker',
  capabilities,
  checksum: '',
});

describe('Errors', () => {
  it('instantiates all error types', () => {
    const errs = [
      AgentError,
      DelegationError,
      ConsensusError,
      ConflictError,
      SharedMemoryError,
      CircularDelegationError,
    ];
    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }
    expect(new CollaborationError('msg', 'CODE', 'src').code).toBe('CODE');
  });
});

describe('Agent Registry', () => {
  let registry: AgentRegistry;
  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('registers, heartbeats, and manages agents', () => {
    registry.register(makeAgent('a1'));
    expect(registry.list()).toHaveLength(1);
    registry.heartbeat('a1');
    expect(registry.get('a1')?.status).toBe('ACTIVE');
    registry.setBusy('a1');
    expect(registry.get('a1')?.status).toBe('BUSY');
    registry.setIdle('a1');
    expect(registry.get('a1')?.status).toBe('IDLE');
    registry.unregister('a1');
    expect(registry.list()).toHaveLength(0);
  });

  it('throws on duplicate registration', () => {
    registry.register(makeAgent('a1'));
    expect(() => registry.register(makeAgent('a1'))).toThrow(AgentError);
  });

  it('throws heartbeat on missing agent', () => {
    expect(() => registry.heartbeat('missing')).toThrow(AgentError);
  });
});

describe('Agent Directory', () => {
  let dir: AgentDirectory;
  beforeEach(() => {
    dir = new AgentDirectory();
  });

  it('discovers agents by capabilities', () => {
    dir.register('a1', ['compute', 'gpu'], 5, 2);
    dir.register('a2', ['compute', 'cpu'], 3, 1);
    const match = dir.discover(['compute']);
    expect(match.matchedAgents.length).toBe(2);
    expect(match.matchScore).toBe(100);
    const noMatch = dir.discover(['storage']);
    expect(noMatch.matchScore).toBe(0);
  });

  it('allocates and releases slots', () => {
    dir.register('a1', ['compute'], 5, 1);
    expect(dir.allocate('a1')).toBe(true);
    expect(dir.allocate('a1')).toBe(false);
    dir.release('a1');
    expect(dir.allocate('a1')).toBe(true);
  });

  it('removes agents', () => {
    dir.register('a1', ['compute'], 5, 1);
    dir.unregister('a1');
    expect(dir.discover(['compute']).matchedAgents).toHaveLength(0);
  });

  it('returns all capabilities', () => {
    dir.register('a1', ['a', 'b'], 1, 1);
    dir.register('a2', ['b', 'c'], 2, 1);
    expect(dir.getAllCapabilities().length).toBe(3);
  });
});

describe('Agent Selection Engine', () => {
  it('selects best candidate by capacity', () => {
    const engine = new AgentSelectionEngine();
    const entries: AgentDirectoryEntry[] = [
      { agentId: 'a1', capabilities: ['c'], priority: 5, availableSlots: 10, currentLoad: 5 },
      { agentId: 'a2', capabilities: ['c'], priority: 1, availableSlots: 10, currentLoad: 1 },
    ];
    const best = engine.selectBestCandidate(entries, ['c']);
    expect(best?.agentId).toBe('a2');
  });

  it('returns null when no match', () => {
    const engine = new AgentSelectionEngine();
    expect(engine.selectBestCandidate([], ['c'])).toBeNull();
  });
});

describe('Collaboration Planner', () => {
  it('creates deterministic plans', () => {
    const planner = new CollaborationPlanner();
    const plan = planner.plan('g1', ['a1', 'a2']);
    expect(plan.phases).toContain('planning');
    expect(plan.checksum).toBeDefined();
    expect(plan.agentIds).toEqual(['a1', 'a2']);
  });
});

describe('Task Delegation Engine', () => {
  it('delegates tasks and detects circular dependencies', () => {
    const engine = new TaskDelegationEngine();
    const d = engine.delegate('t1', 'a1', 'g1', 5);
    expect(d.agentId).toBe('a1');
    expect(d.status).toBe('ASSIGNED');
    expect(engine.getDelegation('t1')).toBeDefined();
    engine.addDependency('t1', 't2');
    expect(engine.detectCycle()).toBe(false);
  });

  it('throws on circular delegation', () => {
    const engine = new TaskDelegationEngine();
    engine.addDependency('t1', 't2');
    expect(() => engine.addDependency('t2', 't1')).toThrow(CircularDelegationError);
    // The circular edge was removed by pop(), so detectCycle should be false
    expect(engine.detectCycle()).toBe(false);
  });

  it('returns all delegations', () => {
    const engine = new TaskDelegationEngine();
    engine.delegate('t1', 'a1', 'g1', 5);
    expect(engine.getAllDelegations()).toHaveLength(1);
  });
});

describe('Collaboration Scheduler', () => {
  it('queues and dequeues tasks by priority', () => {
    const sched = new CollaborationScheduler();
    const t1 = {
      taskId: 't1',
      agentId: 'a1',
      goalId: 'g1',
      priority: 1,
      timeout: 1000,
      status: 'ASSIGNED' as const,
      metadata: {},
    };
    const t2 = {
      taskId: 't2',
      agentId: 'a1',
      goalId: 'g1',
      priority: 10,
      timeout: 1000,
      status: 'ASSIGNED' as const,
      metadata: {},
    };
    sched.schedule(t1);
    sched.schedule(t2);
    expect(sched.getQueueSize()).toBe(2);
    expect(sched.dequeue()?.taskId).toBe('t2');
  });
});

describe('Consensus Engine', () => {
  it('reaches consensus', async () => {
    const engine = new ConsensusEngine();
    const result = await engine.reachConsensus({
      proposalId: 'p1',
      agents: ['a1', 'a2'],
      proposal: 'test',
      timeout: 1000,
    });
    expect(result.approved).toBe(true);
    expect(engine.getResults()).toHaveLength(1);
  });
});

describe('Conflict Resolution Engine', () => {
  it('resolves conflicts deterministically', () => {
    const engine = new ConflictResolutionEngine();
    const res = engine.resolve(['a1', 'a2'], 'resource', 'priority');
    expect(res.checksum).toBeDefined();
    expect(engine.getResolutions()).toHaveLength(1);
  });
});

describe('Shared Context and Memory', () => {
  it('manages shared context', () => {
    const ctx = new SharedContextManager();
    const c = ctx.create('s1', { data: 'test' });
    expect(c.version).toBe(1);
    const updated = ctx.update('s1', { data: 'updated' });
    expect(updated.version).toBe(2);
    expect(ctx.get('s1')).toBeDefined();
    expect(ctx.get('missing')).toBeUndefined();
  });

  it('manages shared memory with ownership', () => {
    const mem = new SharedMemoryCoordinator();
    const m = mem.put('k1', 'v1', 'a1');
    expect(m.version).toBe(1);
    expect(mem.get('k1')?.value).toBe('v1');
    mem.delete('k1');
    expect(mem.get('k1')).toBeUndefined();
  });

  it('throws on ownership conflict', () => {
    const mem = new SharedMemoryCoordinator();
    mem.put('k1', 'v1', 'a1');
    expect(() => mem.put('k1', 'v2', 'a2')).toThrow(SharedMemoryError);
  });
});

describe('Knowledge Synchronizer', () => {
  it('syncs and verifies knowledge', () => {
    const sync = new KnowledgeSynchronizer();
    sync.sync('a1', 'k1', { data: 1 });
    expect(sync.get('a1', 'k1')).toEqual({ data: 1 });
    expect(sync.verifyIntegrity('a1', 'k1')).toBe(true);
    expect(sync.verifyIntegrity('a1', 'missing')).toBe(false);
  });
});

describe('Message Router', () => {
  it('routes and retrieves messages', () => {
    const router = new MessageRouter();
    const msg = {
      id: 'm1',
      fromAgentId: 'a1',
      toAgentId: 'a2',
      type: 'task',
      payload: {},
      timestamp: new Date(),
    };
    router.route(msg);
    expect(router.getInbox('a2')).toHaveLength(1);
    router.clearInbox('a2');
    expect(router.getInbox('a2')).toHaveLength(0);
  });
});

describe('Collaboration Checkpoint', () => {
  it('saves and loads checkpoints', () => {
    const cm = new CollaborationCheckpointManager();
    const cp = cm.save('s1', { a1: 'idle' }, { data: 1 });
    expect(cp.checksum).toBeDefined();
    expect(cm.load('s1')).toBeDefined();
    expect(cm.load('missing')).toBeUndefined();
    cm.clear();
    expect(cm.load('s1')).toBeUndefined();
  });
});

describe('Collaboration Recovery', () => {
  it('recovers from checkpoint', () => {
    const cm = new CollaborationCheckpointManager();
    cm.save('s1', { a1: 'idle' }, {});
    const rm = new CollaborationRecoveryManager(cm);
    expect(rm.recover('s1').restored).toBe(true);
    expect(rm.recover('missing').restored).toBe(false);
  });
});

describe('Collaboration Metrics', () => {
  it('tracks metrics', () => {
    const m = new CollaborationMetricsCollector();
    m.recordAgentRegistration();
    m.recordDelegation(100);
    m.recordCompletion();
    m.recordFailure();
    m.recordMessage();
    m.recordConsensus(50);
    m.recordConflictResolution();
    m.recordRecovery();
    m.recordReplay();
    expect(m.agentsRegistered).toBe(1);
    expect(m.tasksDelegated).toBe(1);
    expect(m.consensusCount).toBe(1);
  });
});

describe('Collaboration Hook Manager', () => {
  it('executes all hooks', async () => {
    const hm = new CollaborationHookManager();
    const hook: CollaborationHook = {
      beforeCollaboration: vi.fn(),
      afterCollaboration: vi.fn(),
      beforeDelegation: vi.fn(),
      afterDelegation: vi.fn(),
      beforeConsensus: vi.fn(),
      afterConsensus: vi.fn(),
      beforeRecovery: vi.fn(),
      afterRecovery: vi.fn(),
    };
    hm.register(hook);
    await hm.runBeforeCollaboration('s1');
    await hm.runAfterCollaboration('s1', {});
    await hm.runBeforeDelegation('t1');
    await hm.runAfterDelegation('t1', {});
    await hm.runBeforeConsensus('p1');
    await hm.runAfterConsensus('p1', true);
    await hm.runBeforeRecovery('s1');
    await hm.runAfterRecovery('s1');
    expect(hook.beforeCollaboration).toHaveBeenCalled();
  });
});

describe('Collaboration Event Bus', () => {
  it('publishes and subscribes', () => {
    const bus = new CollaborationEventBus();
    const fn = vi.fn();
    bus.subscribe('test', fn);
    bus.publish('test', {});
    expect(fn).toHaveBeenCalled();
    bus.clear();
    bus.publish('test', {});
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('Multi-Agent Collaboration Engine', () => {
  let engine: MultiAgentCollaborationEngine;

  beforeEach(() => {
    engine = new MultiAgentCollaborationEngine();
  });

  it('starts session and delegates tasks', async () => {
    const session = await engine.startSession('g1', ['a1', 'a2']);
    expect(session.status).toBe('ACTIVE');
    expect(session.participants).toHaveLength(2);
    expect(engine.metrics.agentsRegistered).toBe(2);
    expect(engine.metrics.tasksDelegated).toBe(2);
  });

  it('reaches consensus', async () => {
    const approved = await engine.reachConsensus('p1', ['a1', 'a2'], 'proposal');
    expect(approved).toBe(true);
    expect(engine.metrics.consensusCount).toBe(1);
  });

  it('resolves conflicts', () => {
    engine.resolveConflict(['a1', 'a2'], 'resource', 'priority');
    expect(engine.metrics.conflictsResolved).toBe(1);
  });

  it('saves and recovers checkpoints', () => {
    engine.saveCheckpoint('s1');
    const restored = engine.recover('s1');
    expect(restored).toBe(true);
    expect(engine.metrics.recoveryCount).toBe(1);
  });
});
