/**
 * @module multi-agent-reasoning/multi-agent-reasoning.test
 * @description Comprehensive tests for M5.7 Multi-Agent Reasoning.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ReasoningOrchestrator,
  CollaborationSessionManager,
  TaskDelegationEngine,
  CollaborationPlanner,
  CollaborationScheduler,
  ConsensusManager,
  ConsensusProtocolError,
  DecisionSynthesizer,
  SharedContextManager,
  RecoveryManager,
  AuditTrailManager,
  AgentRegistry,
  AgentDirectory,
  AgentSelectionEngine,
  CollaborationEventBus,
  CollaborationHookManager,
  CollaborationSession,
  TaskDelegation,
  CollaborationCheckpoint,
  AgentMetadata,
  AgentDirectoryEntry,
  CapabilityMatch,
  ConsensusResult,
  DecisionInput,
  AuditEntry,
  CollaborationError,
  AgentError,
  DelegationError,
  ConsensusError as CollaborationConsensusError,
  ConflictError,
  SharedMemoryError,
  CircularDelegationError,
  CollaborationHook,
  CollaborationPlan,
  ConsensusRound,
  DecisionOutput,
  SharedContext,
  CollaborationResult,
  AgentRegistration,
  CollaborationMetrics,
} from '../src/index.js';

const makeAgent = (id: string, capabilities: string[] = ['compute']): AgentMetadata => ({
  id,
  name: `Agent ${id}`,
  version: '1.0',
  capabilities,
  priority: 5,
});

// ============================================================================
// Collaboration Errors
// ============================================================================
describe('Collaboration Errors', () => {
  it('instantiates all collaboration error types', () => {
    const ErrTypes = [
      AgentError,
      DelegationError,
      CollaborationConsensusError,
      ConflictError,
      SharedMemoryError,
      CircularDelegationError,
    ];
    for (const Err of ErrTypes) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.code).toBeDefined();
      expect(e.src).toBe('src');
      expect(e.name).toBe(Err.name);
    }
  });

  it('creates CollaborationError with code and src', () => {
    const e = new CollaborationError('msg', 'MY_CODE', 'my-src');
    expect(e.code).toBe('MY_CODE');
    expect(e.src).toBe('my-src');
    expect(e.message).toBe('msg');
    expect(e.name).toBe('CollaborationError');
  });

  it('creates error instances with correct properties', () => {
    const e1 = new CollaborationConsensusError('c-msg', 'c-src');
    expect(e1.code).toBe('CONSENSUS_ERROR');
    expect(e1.src).toBe('c-src');
    expect(e1.name).toBe('ConsensusError');

    const e2 = new ConflictError('co-msg', 'co-src');
    expect(e2.code).toBe('CONFLICT_ERROR');
    expect(e2.src).toBe('co-src');
    expect(e2.name).toBe('ConflictError');

    const e3 = new SharedMemoryError('s-msg', 's-src');
    expect(e3.code).toBe('SHARED_MEMORY_ERROR');
    expect(e3.src).toBe('s-src');
    expect(e3.name).toBe('SharedMemoryError');

    const e4 = new CircularDelegationError('cd-msg', 'cd-src');
    expect(e4.code).toBe('CIRCULAR_DELEGATION');
    expect(e4.src).toBe('cd-src');
    expect(e4.name).toBe('CircularDelegationError');
  });

  it('instantiates ConsensusProtocolError', () => {
    const e = new ConsensusProtocolError('p-msg', 'P_CODE', 'p-src');
    expect(e.message).toBe('p-msg');
    expect(e.code).toBe('P_CODE');
    expect(e.source).toBe('p-src');
    expect(e.name).toBe('ConsensusProtocolError');
  });
});

// ============================================================================
// AgentRegistry
// ============================================================================
describe('AgentRegistry', () => {
  let registry: AgentRegistry;
  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('registers, heartbeats, and manages agents', () => {
    registry.register(makeAgent('a1'));
    expect(registry.list()).toHaveLength(1);
    registry.heartbeat('a1');
    const agent = registry.get('a1');
    expect(agent?.status).toBe('ACTIVE');
    expect(agent?.agentId).toBe('a1');
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

  it('lists registered agents', () => {
    registry.register(makeAgent('a1'));
    registry.register(makeAgent('a2'));
    expect(registry.list()).toHaveLength(2);
  });

  it('retains metadata on registration', () => {
    const meta = makeAgent('a1', ['compute', 'memory']);
    registry.register(meta);
    const agent = registry.get('a1');
    expect(agent?.metadata.capabilities).toContain('compute');
    expect(agent?.registeredAt).toBeInstanceOf(Date);
    expect(agent?.lastHeartbeat).toBeInstanceOf(Date);
  });
});

// ============================================================================
// AgentDirectory
// ============================================================================
describe('AgentDirectory', () => {
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
    expect(match.requiredCapabilities).toEqual(['compute']);
    const noMatch = dir.discover(['storage']);
    expect(noMatch.matchScore).toBe(0);
    expect(noMatch.matchedAgents).toHaveLength(0);
  });

  it('discovers with subset capabilities', () => {
    dir.register('a1', ['compute', 'gpu', 'networking'], 5, 3);
    const match = dir.discover(['compute', 'gpu']);
    expect(match.matchedAgents).toHaveLength(1);
    expect(match.matchedAgents[0]).toBe('a1');
  });

  it('allocates and releases slots', () => {
    dir.register('a1', ['compute'], 5, 1);
    expect(dir.allocate('a1')).toBe(true);
    expect(dir.allocate('a1')).toBe(false);
    dir.release('a1');
    expect(dir.allocate('a1')).toBe(true);
  });

  it('release on empty load does nothing', () => {
    dir.register('a1', ['compute'], 5, 1);
    dir.release('a1');
    dir.release('a1');
    expect(dir.allocate('a1')).toBe(true);
  });

  it('allocate on missing agent returns false', () => {
    expect(dir.allocate('missing')).toBe(false);
  });

  it('removes agents', () => {
    dir.register('a1', ['compute'], 5, 1);
    dir.unregister('a1');
    expect(dir.discover(['compute']).matchedAgents).toHaveLength(0);
  });

  it('returns all capabilities', () => {
    dir.register('a1', ['a', 'b'], 1, 1);
    dir.register('a2', ['b', 'c'], 2, 1);
    const caps = dir.getAllCapabilities();
    expect(caps.length).toBe(3);
    expect(caps).toContain('a');
    expect(caps).toContain('b');
    expect(caps).toContain('c');
  });

  it('returns CapabilityMatch type correctly', () => {
    const match: CapabilityMatch = dir.discover(['nonexistent']);
    expect(match.availableCapabilities).toEqual([]);
    expect(match.matchScore).toBe(0);
  });
});

// ============================================================================
// AgentSelectionEngine
// ============================================================================
describe('AgentSelectionEngine', () => {
  it('selects best candidate by capacity', () => {
    const engine = new AgentSelectionEngine();
    const entries: AgentDirectoryEntry[] = [
      { agentId: 'a1', capabilities: ['c'], priority: 5, availableSlots: 10, currentLoad: 5 },
      { agentId: 'a2', capabilities: ['c'], priority: 1, availableSlots: 10, currentLoad: 1 },
    ];
    const best = engine.selectBestCandidate(entries, ['c']);
    expect(best?.agentId).toBe('a2');
  });

  it('selects by priority when slots are equal', () => {
    const engine = new AgentSelectionEngine();
    const entries: AgentDirectoryEntry[] = [
      { agentId: 'a1', capabilities: ['c'], priority: 10, availableSlots: 5, currentLoad: 5 },
      { agentId: 'a2', capabilities: ['c'], priority: 1, availableSlots: 5, currentLoad: 5 },
    ];
    const best = engine.selectBestCandidate(entries, ['c']);
    expect(best?.agentId).toBe('a1');
  });

  it('returns null when no match', () => {
    const engine = new AgentSelectionEngine();
    expect(engine.selectBestCandidate([], ['c'])).toBeNull();
  });

  it('returns null when no candidate matches capabilities', () => {
    const engine = new AgentSelectionEngine();
    const entries: AgentDirectoryEntry[] = [
      { agentId: 'a1', capabilities: ['compute'], priority: 5, availableSlots: 1, currentLoad: 0 },
    ];
    expect(engine.selectBestCandidate(entries, ['storage'])).toBeNull();
  });

  it('selects from multiple matching candidates', () => {
    const engine = new AgentSelectionEngine();
    const entries: AgentDirectoryEntry[] = [
      { agentId: 'a1', capabilities: ['c'], priority: 1, availableSlots: 10, currentLoad: 9 },
      { agentId: 'a2', capabilities: ['c'], priority: 5, availableSlots: 10, currentLoad: 0 },
    ];
    const best = engine.selectBestCandidate(entries, ['c']);
    expect(best?.agentId).toBe('a2');
  });
});

// ============================================================================
// CollaborationPlanner
// ============================================================================
describe('CollaborationPlanner', () => {
  it('creates deterministic plans', () => {
    const planner = new CollaborationPlanner();
    const plan = planner.plan('g1', ['a1', 'a2']);
    expect(plan.goalId).toBe('g1');
    expect(plan.agentIds).toEqual(['a1', 'a2']);
    expect(plan.phases).toEqual(['planning', 'execution', 'verification', 'completion']);
    expect(plan.checksum).toBeDefined();
    expect(plan.checksum.length).toBe(64);
    expect(plan.estimatedDuration).toBe(4000);
    expect(plan.timestamp).toBeInstanceOf(Date);
    expect(plan.id).toMatch(/^plan-/);
  });

  it('generates different IDs for sequential calls', () => {
    const planner = new CollaborationPlanner();
    const plan1 = planner.plan('g1', ['a1']);
    const plan2 = planner.plan('g1', ['a1']);
    expect(plan1.id).not.toBe(plan2.id);
    expect(plan1.checksum).toBe(plan2.checksum);
  });
});

// ============================================================================
// TaskDelegationEngine
// ============================================================================
describe('TaskDelegationEngine', () => {
  it('delegates tasks with correct properties', () => {
    const engine = new TaskDelegationEngine();
    const d = engine.delegate('t1', 'a1', 'g1', 5);
    expect(d.taskId).toBe('t1');
    expect(d.agentId).toBe('a1');
    expect(d.goalId).toBe('g1');
    expect(d.status).toBe('ASSIGNED');
    expect(d.timeout).toBe(30000);
    expect(d.metadata.delegatedAt).toBeInstanceOf(Date);
  });

  it('retrieves delegation by id', () => {
    const engine = new TaskDelegationEngine();
    engine.delegate('t1', 'a1', 'g1', 5);
    expect(engine.getDelegation('t1')).toBeDefined();
    expect(engine.getDelegation('nonexistent')).toBeUndefined();
  });

  it('returns all delegations', () => {
    const engine = new TaskDelegationEngine();
    engine.delegate('t1', 'a1', 'g1', 5);
    engine.delegate('t2', 'a2', 'g1', 3);
    expect(engine.getAllDelegations()).toHaveLength(2);
  });

  it('detects no cycle on linear dependencies', () => {
    const engine = new TaskDelegationEngine();
    engine.addDependency('t1', 't2');
    engine.addDependency('t2', 't3');
    expect(engine.detectCycle()).toBe(false);
  });

  it('throws on circular delegation', () => {
    const engine = new TaskDelegationEngine();
    engine.addDependency('t1', 't2');
    expect(() => engine.addDependency('t2', 't1')).toThrow(CircularDelegationError);
  });

  it('detects cycle correctly', () => {
    const engine = new TaskDelegationEngine();
    engine.addDependency('t1', 't2');
    engine.addDependency('t2', 't3');
    engine.addDependency('t3', 't4');
    expect(engine.detectCycle()).toBe(false);
    expect(() => engine.addDependency('t4', 't1')).toThrow(CircularDelegationError);
  });

  it('handles self-loop as cycle', () => {
    const engine = new TaskDelegationEngine();
    expect(() => engine.addDependency('t1', 't1')).toThrow(CircularDelegationError);
  });

  it('handles diamond dependencies without cycle', () => {
    const engine = new TaskDelegationEngine();
    engine.addDependency('t1', 't2');
    engine.addDependency('t1', 't3');
    engine.addDependency('t2', 't4');
    engine.addDependency('t3', 't4');
    expect(engine.detectCycle()).toBe(false);
  });
});

// ============================================================================
// CollaborationScheduler
// ============================================================================
describe('CollaborationScheduler', () => {
  it('queues and dequeues tasks by priority descending', () => {
    const sched = new CollaborationScheduler();
    const t1: TaskDelegation = {
      taskId: 't1',
      agentId: 'a1',
      goalId: 'g1',
      priority: 1,
      timeout: 1000,
      status: 'ASSIGNED' as const,
      metadata: {},
    };
    const t2: TaskDelegation = {
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
    expect(sched.dequeue()?.taskId).toBe('t1');
  });

  it('returns undefined when queue empty', () => {
    const sched = new CollaborationScheduler();
    expect(sched.dequeue()).toBeUndefined();
  });

  it('handles equal priorities', () => {
    const sched = new CollaborationScheduler();
    sched.schedule({
      taskId: 't1',
      agentId: 'a1',
      goalId: 'g1',
      priority: 5,
      timeout: 1000,
      status: 'ASSIGNED' as const,
      metadata: {},
    });
    sched.schedule({
      taskId: 't2',
      agentId: 'a1',
      goalId: 'g1',
      priority: 5,
      timeout: 1000,
      status: 'ASSIGNED' as const,
      metadata: {},
    });
    expect(sched.getQueueSize()).toBe(2);
  });
});

// ============================================================================
// ConsensusManager
// ============================================================================
describe('ConsensusManager', () => {
  it('reaches consensus with majority approval', () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1', 'a2', 'a3']);
    engine.castVote(round.id, 'a1', true);
    engine.castVote(round.id, 'a2', true);
    engine.castVote(round.id, 'a3', false);
    const result = engine.resolveRound(round.id);
    expect(result.approved).toBe(true);
    expect(result.votes.a1).toBe(true);
    expect(result.votes.a3).toBe(false);
    expect(result.proposalId).toBe('p1');
  });

  it('rejects with majority disapproval', () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1', 'a2']);
    engine.castVote(round.id, 'a1', false);
    engine.castVote(round.id, 'a2', false);
    const result = engine.resolveRound(round.id);
    expect(result.approved).toBe(false);
  });

  it('rejects on tie (not strictly greater than half)', () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1', 'a2']);
    engine.castVote(round.id, 'a1', true);
    engine.castVote(round.id, 'a2', false);
    const result = engine.resolveRound(round.id);
    expect(result.approved).toBe(false);
  });

  it('handles invalid round id', () => {
    const engine = new ConsensusManager();
    expect(() => engine.castVote('invalid', 'a1', true)).toThrow(ConsensusProtocolError);
    expect(() => engine.resolveRound('invalid')).toThrow(ConsensusProtocolError);
  });

  it('handles invalid agent id', () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1']);
    expect(() => engine.castVote(round.id, 'invalid-agent', true)).toThrow(ConsensusProtocolError);
  });

  it('gets round by id', () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1']);
    expect(engine.getRound(round.id)).toBeDefined();
    expect(engine.getRound('invalid')).toBeUndefined();
  });

  it('starts round with correct initial state', () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1', 'a2']);
    expect(round.status).toBe('PENDING');
    expect(round.votes['a1']).toBe(false);
    expect(round.votes['a2']).toBe(false);
    expect(round.proposalId).toBe('p1');
    expect(round.id).toMatch(/^round-/);
  });

  it('returns all results', () => {
    const engine = new ConsensusManager();
    const r1 = engine.startRound('p1', ['a1']);
    engine.castVote(r1.id, 'a1', true);
    engine.resolveRound(r1.id);
    const r2 = engine.startRound('p2', ['a1']);
    engine.castVote(r2.id, 'a1', false);
    engine.resolveRound(r2.id);
    expect(engine.getResults()).toHaveLength(2);
  });
});

// ============================================================================
// DecisionSynthesizer
// ============================================================================
describe('DecisionSynthesizer', () => {
  it('synthesizes multiple decisions', () => {
    const synth = new DecisionSynthesizer();
    const decisions: DecisionInput[] = [
      { agentId: 'a1', decision: 'approve', confidence: 0.9 },
      { agentId: 'a2', decision: 'reject', confidence: 0.8 },
    ];
    const output = synth.synthesize(decisions);
    expect(output.averageConfidence).toBe(0.85);
    expect(output.inputs).toHaveLength(2);
    expect(output.synthesizedDecision).toBe('approve reject');
  });

  it('handles empty decisions', () => {
    const synth = new DecisionSynthesizer();
    const output = synth.synthesize([]);
    expect(output.synthesizedDecision).toBe('');
    expect(output.inputs).toHaveLength(0);
    expect(output.averageConfidence).toBe(0);
  });

  it('resolves conflicts by confidence descending', () => {
    const synth = new DecisionSynthesizer();
    const d1: DecisionInput = { agentId: 'a1', decision: 'd1', confidence: 0.8 };
    const d2: DecisionInput = { agentId: 'a2', decision: 'd2', confidence: 0.9 };
    const resolved = synth.resolveConflicts([d1, d2]);
    expect(resolved).toHaveLength(2);
    expect(resolved[0].agentId).toBe('a2');
    expect(resolved[1].agentId).toBe('a1');
  });

  it('preserves input immutability', () => {
    const synth = new DecisionSynthesizer();
    const decisions: DecisionInput[] = [{ agentId: 'a1', decision: 'd1', confidence: 0.5 }];
    const output = synth.synthesize(decisions);
    expect(output.inputs[0]).not.toBe(decisions[0]);
    expect(output.inputs[0].agentId).toBe('a1');
  });

  it('single decision synthesis', () => {
    const synth = new DecisionSynthesizer();
    const output = synth.synthesize([{ agentId: 'a1', decision: 'go', confidence: 1.0 }]);
    expect(output.averageConfidence).toBe(1.0);
    expect(output.synthesizedDecision).toBe('go');
  });
});

// ============================================================================
// SharedContextManager
// ============================================================================
describe('SharedContextManager', () => {
  it('creates and updates shared context', () => {
    const ctx = new SharedContextManager();
    const c = ctx.createContext('s1', { data: 'test' });
    expect(c.sessionId).toBe('s1');
    expect(c.version).toBe(1);
    expect(c.checksum).toBeDefined();
    expect(c.checksum.length).toBe(64);

    const updated = ctx.updateContext('s1', { data: 'updated' });
    expect(updated.version).toBe(2);
    expect(updated.data.data).toBe('updated');
  });

  it('retrieves context by session id', () => {
    const ctx = new SharedContextManager();
    ctx.createContext('s1', { x: 1 });
    expect(ctx.getContext('s1')).toBeDefined();
    expect(ctx.getContext('missing')).toBeUndefined();
  });

  it('throws on updating missing context', () => {
    const ctx = new SharedContextManager();
    expect(() => ctx.updateContext('missing', { data: 'test' })).toThrow('Context not found');
  });

  it('merges data on update', () => {
    const ctx = new SharedContextManager();
    ctx.createContext('s1', { a: 1, b: 2 });
    const updated = ctx.updateContext('s1', { b: 3, c: 4 });
    expect(updated.data.a).toBe(1);
    expect(updated.data.b).toBe(3);
    expect(updated.data.c).toBe(4);
  });
});

// ============================================================================
// RecoveryManager
// ============================================================================
describe('RecoveryManager', () => {
  it('saves and recovers checkpoints', () => {
    const rm = new RecoveryManager();
    const cp = rm.saveCheckpoint('s1', { a1: 'idle' }, { data: 1 });
    expect(cp.sessionId).toBe('s1');
    expect(cp.checksum).toBeDefined();
    expect(cp.checksum.length).toBe(64);
    expect(cp.agentStates).toEqual({ a1: 'idle' });
    expect(cp.sharedState).toEqual({ data: 1 });

    const recovered = rm.recoverFromCheckpoint('s1');
    expect(recovered).toBeDefined();
    expect(recovered!.id).toBe(cp.id);
  });

  it('returns undefined for missing checkpoint', () => {
    const rm = new RecoveryManager();
    expect(rm.recoverFromCheckpoint('missing')).toBeUndefined();
  });

  it('validates checkpoint integrity', () => {
    const rm = new RecoveryManager();
    const cp = rm.saveCheckpoint('s1', { a1: 'running' }, {});
    expect(rm.validateCheckpoint(cp)).toBe(true);
  });

  it('replaces previous checkpoint on same session', () => {
    const rm = new RecoveryManager();
    rm.saveCheckpoint('s1', { a1: 'idle' }, { v: 1 });
    const cp2 = rm.saveCheckpoint('s1', { a1: 'busy' }, { v: 2 });
    expect(rm.recoverFromCheckpoint('s1')!.agentStates.a1).toBe('busy');
    expect(cp2.sharedState.v).toBe(2);
  });
});

// ============================================================================
// AuditTrailManager
// ============================================================================
describe('AuditTrailManager', () => {
  it('logs entries with checksum verification', () => {
    const audit = new AuditTrailManager();
    const entry = audit.log('t1', 's1', 'action', { result: 'ok' });
    expect(entry.traceId).toBe('t1');
    expect(entry.sessionId).toBe('s1');
    expect(entry.action).toBe('action');
    expect(entry.checksum).toBeDefined();
    expect(entry.checksum.length).toBe(64);
    expect(entry.id).toMatch(/^aud-/);
  });

  it('verifies integrity returns true for valid entries', () => {
    const audit = new AuditTrailManager();
    audit.log('t1', 's1', 'create', {});
    audit.log('t2', 's1', 'update', {});
    expect(audit.verifyIntegrity('s1')).toBe(true);
  });

  it('returns true for empty session entries', () => {
    const audit = new AuditTrailManager();
    expect(audit.verifyIntegrity('empty')).toBe(true);
  });

  it('returns all entries as copy', () => {
    const audit = new AuditTrailManager();
    audit.log('t1', 's1', 'a1', {});
    audit.log('t2', 's1', 'a2', {});
    const entries = audit.getEntries();
    expect(entries).toHaveLength(2);
    entries.pop();
    expect(audit.getEntries()).toHaveLength(2);
  });

  it('freezes entry objects', () => {
    const audit = new AuditTrailManager();
    const entry = audit.log('t1', 's1', 'action', {});
    expect(Object.isFrozen(entry)).toBe(true);
  });

  it('detects integrity violation with tampered entry', () => {
    const audit = new AuditTrailManager();
    audit.log('t1', 's1', 'action', { data: 'original' });
    const entries = audit.getEntries();
    const tampered = { ...entries[0], checksum: 'tampered' };
    expect(tampered.checksum).toBe('tampered');
  });
});

// ============================================================================
// CollaborationSessionManager
// ============================================================================
describe('CollaborationSessionManager', () => {
  it('creates sessions with correct properties', () => {
    const mgr = new CollaborationSessionManager();
    const session = mgr.createSession('g1', ['a1', 'a2']);
    expect(session.goalId).toBe('g1');
    expect(session.participants).toEqual(['a1', 'a2']);
    expect(session.status).toBe('ACTIVE');
    expect(session.checksum).toBeDefined();
    expect(session.id).toMatch(/^collab-/);
    expect(session.traceId).toMatch(/^trace-/);
  });

  it('completes session', () => {
    const mgr = new CollaborationSessionManager();
    const session = mgr.createSession('g1', ['a1']);
    mgr.completeSession(session.id);
    expect(mgr.getSession(session.id)?.status).toBe('COMPLETED');
  });

  it('fails session', () => {
    const mgr = new CollaborationSessionManager();
    const session = mgr.createSession('g1', ['a1']);
    mgr.failSession(session.id);
    expect(mgr.getSession(session.id)?.status).toBe('FAILED');
  });

  it('lists all sessions', () => {
    const mgr = new CollaborationSessionManager();
    mgr.createSession('g1', ['a1']);
    mgr.createSession('g2', ['a2']);
    expect(mgr.listSessions()).toHaveLength(2);
  });

  it('handles missing session gracefully for complete', () => {
    const mgr = new CollaborationSessionManager();
    mgr.completeSession('missing');
    expect(mgr.getSession('missing')).toBeUndefined();
  });

  it('handles missing session gracefully for fail', () => {
    const mgr = new CollaborationSessionManager();
    mgr.failSession('missing');
    expect(mgr.getSession('missing')).toBeUndefined();
  });
});

// ============================================================================
// CollaborationHookManager
// ============================================================================
describe('CollaborationHookManager', () => {
  it('executes all hook types', async () => {
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
    expect(hook.beforeCollaboration).toHaveBeenCalledWith('s1');
    expect(hook.afterCollaboration).toHaveBeenCalledWith('s1', {});
    expect(hook.beforeDelegation).toHaveBeenCalledWith('t1');
    expect(hook.afterDelegation).toHaveBeenCalledWith('t1', {});
    expect(hook.beforeConsensus).toHaveBeenCalledWith('p1');
    expect(hook.afterConsensus).toHaveBeenCalledWith('p1', true);
    expect(hook.beforeRecovery).toHaveBeenCalledWith('s1');
    expect(hook.afterRecovery).toHaveBeenCalledWith('s1');
  });

  it('skips hooks with undefined methods', async () => {
    const hm = new CollaborationHookManager();
    hm.register({});
    await expect(hm.runBeforeCollaboration('s1')).resolves.toBeUndefined();
    await expect(hm.runAfterCollaboration('s1', {})).resolves.toBeUndefined();
    await expect(hm.runBeforeDelegation('t1')).resolves.toBeUndefined();
    await expect(hm.runAfterDelegation('t1', {})).resolves.toBeUndefined();
    await expect(hm.runBeforeConsensus('p1')).resolves.toBeUndefined();
    await expect(hm.runAfterConsensus('p1', true)).resolves.toBeUndefined();
    await expect(hm.runBeforeRecovery('s1')).resolves.toBeUndefined();
    await expect(hm.runAfterRecovery('s1')).resolves.toBeUndefined();
  });

  it('executes hooks in registration order', async () => {
    const hm = new CollaborationHookManager();
    const order: number[] = [];
    hm.register({
      beforeCollaboration: async () => {
        order.push(1);
      },
    });
    hm.register({
      beforeCollaboration: async () => {
        order.push(2);
      },
    });
    await hm.runBeforeCollaboration('s1');
    expect(order).toEqual([1, 2]);
  });
});

// ============================================================================
// CollaborationEventBus
// ============================================================================
describe('CollaborationEventBus', () => {
  it('publishes and subscribes', () => {
    const bus = new CollaborationEventBus();
    const fn = vi.fn();
    bus.subscribe('test', fn);
    bus.publish('test', { key: 'value' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'test',
        payload: { key: 'value' },
      }),
    );
  });

  it('does not call listeners for other event types', () => {
    const bus = new CollaborationEventBus();
    const fn = vi.fn();
    bus.subscribe('type-a', fn);
    bus.publish('type-b', {});
    expect(fn).not.toHaveBeenCalled();
  });

  it('clears all listeners', () => {
    const bus = new CollaborationEventBus();
    const fn = vi.fn();
    bus.subscribe('test', fn);
    bus.clear();
    bus.publish('test', {});
    expect(fn).not.toHaveBeenCalled();
  });

  it('handles multiple subscribers for same type', () => {
    const bus = new CollaborationEventBus();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    bus.subscribe('test', fn1);
    bus.subscribe('test', fn2);
    bus.publish('test', {});
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it('publishes empty payload by default', () => {
    const bus = new CollaborationEventBus();
    const fn = vi.fn();
    bus.subscribe('test', fn);
    bus.publish('test');
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'test',
        payload: {},
      }),
    );
  });
});

// ============================================================================
// ReasoningOrchestrator Integration
// ============================================================================
describe('ReasoningOrchestrator', () => {
  let orchestrator: ReasoningOrchestrator;

  beforeEach(() => {
    orchestrator = new ReasoningOrchestrator();
  });

  it('starts collaboration session successfully', async () => {
    const session = await orchestrator.startCollaboration('g1', ['a1', 'a2']);
    expect(session.status).toBe('ACTIVE');
    expect(session.goalId).toBe('g1');
    expect(session.participants).toEqual(['a1', 'a2']);
    expect(session.id).toMatch(/^collab-/);
  });

  it('executes reasoning and produces result', async () => {
    const session = await orchestrator.startCollaboration('g1', ['a1', 'a2']);
    const result = await orchestrator.executeReasoning(session);
    expect(result.success).toBe(true);
    expect(result.sessionId).toBe(session.id);
    expect(result.output).toBeDefined();
  });

  it('executed reasoning sets session to completed', async () => {
    const session = await orchestrator.startCollaboration('g1', ['a1']);
    await orchestrator.executeReasoning(session);
    const completed = orchestrator['sessionManager'].getSession(session.id);
    expect(completed?.status).toBe('COMPLETED');
  });

  it('recovers from existing checkpoint', () => {
    const rm = orchestrator['recoveryManager'];
    rm.saveCheckpoint('test-session', { a1: 'running' }, { progress: 0.5 });
    const recovered = orchestrator.recoverSession('test-session');
    expect(recovered).toBe(true);
  });

  it('returns false for missing checkpoint', () => {
    expect(orchestrator.recoverSession('nonexistent')).toBe(false);
  });

  it('single agent session', async () => {
    const session = await orchestrator.startCollaboration('g1', ['a1']);
    expect(session.participants).toHaveLength(1);
    const result = await orchestrator.executeReasoning(session);
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// Type Definition Validation
// ============================================================================
describe('Type Definitions', () => {
  it('validates CollaborationSession shape', () => {
    const session: CollaborationSession = {
      id: 's1',
      traceId: 't1',
      goalId: 'g1',
      participants: ['a1'],
      status: 'ACTIVE',
      startedAt: new Date(),
      checksum: 'abc',
    };
    expect(session.status).toBe('ACTIVE');
    const failed: CollaborationSession = { ...session, status: 'FAILED' as const };
    expect(failed.status).toBe('FAILED');
    const cancelled: CollaborationSession = { ...session, status: 'CANCELLED' as const };
    expect(cancelled.status).toBe('CANCELLED');
  });

  it('validates TaskDelegation shape', () => {
    const d: TaskDelegation = {
      taskId: 't1',
      agentId: 'a1',
      goalId: 'g1',
      priority: 5,
      timeout: 10000,
      status: 'PENDING',
      metadata: { key: 'val' },
    };
    expect(d.status).toBe('PENDING');
    const executing: TaskDelegation = { ...d, status: 'EXECUTING' as const };
    expect(executing.status).toBe('EXECUTING');
  });

  it('validates CollaborationCheckpoint shape', () => {
    const cp: CollaborationCheckpoint = {
      id: 'cp1',
      sessionId: 's1',
      agentStates: { a1: 'idle' },
      sharedState: {},
      timestamp: new Date(),
      checksum: 'abc',
    };
    expect(cp.agentStates.a1).toBe('idle');
  });

  it('validates AuditEntry shape', () => {
    const entry: AuditEntry = {
      id: 'aud-1',
      traceId: 't1',
      sessionId: 's1',
      action: 'test',
      timestamp: new Date(),
      metadata: { x: 1 },
      checksum: 'abc',
    };
    expect(entry.action).toBe('test');
  });

  it('validates CollaborationPlan shape', () => {
    const plan: CollaborationPlan = {
      id: 'plan-1',
      goalId: 'g1',
      agentIds: ['a1'],
      phases: ['plan'],
      estimatedDuration: 1000,
      checksum: 'abc',
      timestamp: new Date(),
    };
    expect(plan.phases).toHaveLength(1);
  });

  it('validates ConsensusRound shape', () => {
    const round: ConsensusRound = {
      id: 'r1',
      proposalId: 'p1',
      votes: { a1: true },
      status: 'PENDING',
    };
    expect(round.status).toBe('PENDING');
    const resolved: ConsensusRound = { ...round, status: 'RESOLVED' as const };
    expect(resolved.status).toBe('RESOLVED');
  });

  it('validates DecisionOutput shape', () => {
    const output: DecisionOutput = {
      synthesizedDecision: 'decision',
      inputs: [{ agentId: 'a1', decision: 'd1', confidence: 0.9 }],
      averageConfidence: 0.9,
    };
    expect(output.synthesizedDecision).toBe('decision');
  });

  it('validates SharedContext shape', () => {
    const ctx: SharedContext = {
      sessionId: 's1',
      data: { key: 'val' },
      version: 1,
      checksum: 'abc',
    };
    expect(ctx.version).toBe(1);
  });

  it('validates CollaborationResult shape', () => {
    const result: CollaborationResult = { sessionId: 's1', success: true, output: { data: 1 } };
    expect(result.success).toBe(true);
    const failed: CollaborationResult = { sessionId: 's1', success: false, output: null };
    expect(failed.success).toBe(false);
  });

  it('validates AgentRegistration shape', () => {
    const reg: AgentRegistration = {
      agentId: 'a1',
      metadata: makeAgent('a1'),
      registeredAt: new Date(),
      lastHeartbeat: new Date(),
      status: 'IDLE',
    };
    expect(reg.status).toBe('IDLE');
    const busy: AgentRegistration = { ...reg, status: 'BUSY' as const };
    expect(busy.status).toBe('BUSY');
  });

  it('validates CapabilityMatch shape', () => {
    const match: CapabilityMatch = {
      requiredCapabilities: ['c1'],
      availableCapabilities: ['c1', 'c2'],
      matchScore: 100,
      matchedAgents: ['a1'],
    };
    expect(match.matchedAgents).toContain('a1');
  });
});

// ============================================================================
// Edge Cases and Property-Based Tests
// ============================================================================
describe('Edge Cases', () => {
  it('CollaborationScheduler respects priority inversion', () => {
    const sched = new CollaborationScheduler();
    const high: TaskDelegation = {
      taskId: 'h',
      agentId: 'a1',
      goalId: 'g1',
      priority: 100,
      timeout: 1000,
      status: 'ASSIGNED' as const,
      metadata: {},
    };
    const low: TaskDelegation = {
      taskId: 'l',
      agentId: 'a1',
      goalId: 'g1',
      priority: 1,
      timeout: 1000,
      status: 'ASSIGNED' as const,
      metadata: {},
    };
    sched.schedule(low);
    sched.schedule(high);
    expect(sched.dequeue()?.taskId).toBe('h');
    expect(sched.dequeue()?.taskId).toBe('l');
  });

  it('CollaborationPlanner uses deterministic checksum', () => {
    const planner = new CollaborationPlanner();
    const plan1 = planner.plan('g1', ['a1']);
    const plan2 = planner.plan('g1', ['a1']);
    expect(plan1.checksum).toBe(plan2.checksum);
  });

  it('ConsensusManager round status transitions', () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1']);
    expect(round.status).toBe('PENDING');
    engine.castVote(round.id, 'a1', true);
    const result = engine.resolveRound(round.id);
    expect(result.approved).toBe(true);
    const resolved = engine.getRound(round.id);
    expect(resolved?.status).toBe('RESOLVED');
  });

  it('SharedContextManager creates independent copies', () => {
    const mgr = new SharedContextManager();
    const originalData = { items: [1, 2, 3] };
    const ctx = mgr.createContext('s1', originalData);
    originalData.items.push(4);
    expect(ctx.data.items).toHaveLength(3);
  });

  it('RecoveryManager validates checkpoints correctly', () => {
    const rm = new RecoveryManager();
    const validCp = rm.saveCheckpoint('s1', {}, {});
    expect(rm.validateCheckpoint(validCp)).toBe(true);
  });

  it('AgentDirectory getAllCapabilities returns empty for no agents', () => {
    const dir = new AgentDirectory();
    expect(dir.getAllCapabilities()).toEqual([]);
  });

  it('CollaborationSessionManager session checksum is deterministic', () => {
    const mgr = new CollaborationSessionManager();
    const s1 = mgr.createSession('g1', ['a1']);
    const s2 = mgr.createSession('g1', ['a1']);
    expect(s1.checksum).toBe(s2.checksum);
  });

  it('ReasoningOrchestrator creates independent sessions', async () => {
    const orch = new ReasoningOrchestrator();
    const s1 = await orch.startCollaboration('g1', ['a1']);
    const s2 = await orch.startCollaboration('g2', ['b1']);
    expect(s1.id).not.toBe(s2.id);
    expect(s1.goalId).toBe('g1');
    expect(s2.goalId).toBe('g2');
  });

  it('CollaborationEventBus timestamp is set on publish', () => {
    const bus = new CollaborationEventBus();
    const fn = vi.fn();
    bus.subscribe('test', fn);
    bus.publish('test', {});
    const event = fn.mock.calls[0][0];
    expect(event.timestamp).toBeInstanceOf(Date);
  });
});
