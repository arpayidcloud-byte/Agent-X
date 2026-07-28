/**
 * @module distributed-cognition/distributed-cognition.test
 * @description Comprehensive tests for M5.8 Distributed Cognitive Intelligence.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  NodeRegistry,
  NodeCapabilityRegistry,
  NodeDiscoveryEngine,
  NodeHealthMonitor,
  NodeMetadata,
  NodeRegistration,
  NodeHealth,
  NodeStatus,
  ClusterMembershipManager,
  ClusterCoordinator,
  ClusterConfig,
  ClusterState,
  DistributedScheduler,
  DistributedTaskDispatcher,
  SchedulePolicy,
  DistributedTask,
  TaskMigration,
  CrossNodeCollaborationManager,
  CollaborationMessage,
  DistributedConsensusEngine,
  KnowledgeReplicationManager,
  KnowledgeSynchronizationEngine,
  KnowledgeEntry,
  SyncResult,
  DistributedMemoryCoordinator,
  InterNodeMessageBus,
  ReliableMessageQueue,
  DistributedEventBus,
  DistributedEvent,
  DistributedCheckpointManager,
  DistributedCheckpoint,
  DistributedRecoveryManager,
  RecoveryPlan,
  DistributedReplayEngine,
  ReplayEntry,
  DistributedAuditManager,
  AuditEntry,
  DistributedMetricsCollector,
  MetricPoint,
  DistributedTraceManager,
  TraceSpan,
  DistributedConfigurationManager,
  ConfigEntry,
  DistributedSecurityValidator,
  SecurityToken,
  DistributedIntegrityValidator,
  IntegrityRecord,
  DistributedVersionManager,
  VersionInfo,
  DistributedCompatibilityValidator,
  CompatibilityCheck,
  DistributedWorkflowCoordinator,
  DistributedGoalCoordinator,
  DistributedLearningSynchronizer,
  DistributedPlanningCoordinator,
  DistributedResourceAllocator,
  DistributedConflictResolver,
} from '../src/index.js';

const makeNodeMeta = (
  id: string,
  region = 'us-east-1',
  caps: string[] = ['compute'],
): NodeMetadata => ({
  nodeId: id,
  name: `Node ${id}`,
  version: '1.0',
  capabilities: caps,
  priority: 5,
  maxSlots: 10,
  region,
});

const makeKnowledgeEntry = (
  id: string,
  key: string,
  version: number,
  sourceNode: string,
): KnowledgeEntry => ({
  entryId: id,
  key,
  value: { data: `val-${version}` },
  sourceNode,
  version,
  timestamp: new Date(),
  checksum: 'test-checksum',
});

const makeCollabMessage = (
  id: string,
  from: string,
  to: string,
  type: CollaborationMessage['type'] = 'HEARTBEAT',
): CollaborationMessage => ({
  messageId: id,
  fromNode: from,
  toNode: to,
  type,
  payload: {},
  timestamp: new Date(),
  checksum: 'msg-checksum',
});

// ============================================================================
// Node Registry
// ============================================================================
describe('NodeRegistry', () => {
  let registry: NodeRegistry;
  beforeEach(() => {
    registry = new NodeRegistry();
  });

  it('registers and retrieves nodes', () => {
    registry.register(makeNodeMeta('n1'));
    expect(registry.get('n1')).toBeDefined();
    expect(registry.getAll()).toHaveLength(1);
  });

  it('throws on duplicate registration', () => {
    registry.register(makeNodeMeta('n1'));
    expect(() => registry.register(makeNodeMeta('n1'))).toThrow('already registered');
  });

  it('unregisters nodes', () => {
    registry.register(makeNodeMeta('n1'));
    registry.unregister('n1');
    expect(registry.get('n1')).toBeUndefined();
  });

  it('sets node status', () => {
    registry.register(makeNodeMeta('n1'));
    registry.setStatus('n1', 'UNHEALTHY');
    expect(registry.get('n1')?.status).toBe('UNHEALTHY');
  });

  it('throws on setting status of missing node', () => {
    expect(() => registry.setStatus('missing', 'ACTIVE')).toThrow('not found');
  });

  it('updates heartbeat', () => {
    registry.register(makeNodeMeta('n1'));
    registry.updateHeartbeat('n1');
    expect(registry.get('n1')?.status).toBe('ACTIVE');
  });

  it('throws on heartbeat for missing node', () => {
    expect(() => registry.updateHeartbeat('missing')).toThrow('not found');
  });

  it('finds nodes by capability', () => {
    registry.register(makeNodeMeta('n1', 'us-east-1', ['compute', 'gpu']));
    registry.register(makeNodeMeta('n2', 'us-east-1', ['compute']));
    expect(registry.findNodesByCapability('gpu')).toHaveLength(1);
    expect(registry.findNodesByCapability('storage')).toHaveLength(0);
  });
});

// ============================================================================
// Node Capability Registry
// ============================================================================
describe('NodeCapabilityRegistry', () => {
  let capReg: NodeCapabilityRegistry;
  beforeEach(() => {
    capReg = new NodeCapabilityRegistry();
  });

  it('registers and retrieves capabilities', () => {
    capReg.register('n1', [{ name: 'compute', version: '1.0', weight: 10 }]);
    expect(capReg.getCapabilities('n1')).toBeDefined();
    expect(capReg.getAll()).toHaveLength(1);
  });

  it('unregisters capabilities', () => {
    capReg.register('n1', [{ name: 'compute', version: '1.0', weight: 10 }]);
    capReg.unregister('n1');
    expect(capReg.getCapabilities('n1')).toBeUndefined();
  });

  it('finds nodes with specific capability', () => {
    capReg.register('n1', [{ name: 'compute', version: '1.0', weight: 10 }]);
    capReg.register('n2', [{ name: 'storage', version: '1.0', weight: 5 }]);
    expect(capReg.findNodesWithCapability('compute')).toEqual(['n1']);
    expect(capReg.findNodesWithCapability('missing')).toEqual([]);
  });

  it('sorts capabilities by weight descending', () => {
    capReg.register('n1', [
      { name: 'a', version: '1', weight: 1 },
      { name: 'b', version: '1', weight: 10 },
    ]);
    expect(capReg.getCapabilities('n1')?.capabilities[0].name).toBe('b');
  });
});

// ============================================================================
// Node Discovery Engine
// ============================================================================
describe('NodeDiscoveryEngine', () => {
  let registry: NodeRegistry;
  let discovery: NodeDiscoveryEngine;
  beforeEach(() => {
    registry = new NodeRegistry();
    discovery = new NodeDiscoveryEngine(registry);
  });

  it('discovers nodes by region', () => {
    registry.register(makeNodeMeta('n1', 'us-east-1'));
    registry.register(makeNodeMeta('n2', 'eu-west-1'));
    expect(discovery.discover('us-east-1')).toHaveLength(1);
    expect(discovery.discover('eu-west-1')).toHaveLength(1);
  });

  it('discovers by capability', () => {
    registry.register(makeNodeMeta('n1', 'us-east-1', ['gpu']));
    registry.register(makeNodeMeta('n2', 'us-east-1', ['cpu']));
    expect(discovery.discoverByCapability('gpu')).toHaveLength(1);
  });

  it('registers discovered nodes', () => {
    discovery.registerDiscovered(makeNodeMeta('n1'));
    expect(registry.get('n1')).toBeDefined();
  });

  it('does not re-register existing discovered nodes', () => {
    discovery.registerDiscovered(makeNodeMeta('n1'));
    discovery.registerDiscovered(makeNodeMeta('n1'));
    expect(registry.getAll()).toHaveLength(1);
  });

  it('prunes stale nodes', () => {
    discovery.registerDiscovered(makeNodeMeta('n1'));
    const pruned = discovery.pruneStale(0);
    expect(pruned).toHaveLength(1);
  });
});

// ============================================================================
// Node Health Monitor
// ============================================================================
describe('NodeHealthMonitor', () => {
  let monitor: NodeHealthMonitor;
  beforeEach(() => {
    monitor = new NodeHealthMonitor();
  });

  it('records and retrieves health', () => {
    const health: NodeHealth = {
      nodeId: 'n1',
      cpuUsage: 0.5,
      memoryUsage: 0.3,
      latencyMs: 10,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    };
    monitor.recordHealth(health);
    expect(monitor.getLatestHealth('n1')).toBeDefined();
  });

  it('returns undefined for missing node', () => {
    expect(monitor.getLatestHealth('missing')).toBeUndefined();
  });

  it('evaluates status as HEALTHY', () => {
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.5,
      memoryUsage: 0.5,
      latencyMs: 10,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    expect(monitor.evaluateStatus('n1')).toBe('HEALTHY');
  });

  it('evaluates status as DEGRADED on high CPU', () => {
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.95,
      memoryUsage: 0.5,
      latencyMs: 10,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    expect(monitor.evaluateStatus('n1')).toBe('DEGRADED');
  });

  it('evaluates status as DEGRADED on high memory', () => {
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.5,
      memoryUsage: 0.95,
      latencyMs: 10,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    expect(monitor.evaluateStatus('n1')).toBe('DEGRADED');
  });

  it('evaluates status as UNHEALTHY on high latency', () => {
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.5,
      memoryUsage: 0.5,
      latencyMs: 2000,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    expect(monitor.evaluateStatus('n1')).toBe('UNHEALTHY');
  });

  it('evaluates status as UNHEALTHY on high error rate', () => {
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.5,
      memoryUsage: 0.5,
      latencyMs: 10,
      errorRate: 0.5,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    expect(monitor.evaluateStatus('n1')).toBe('UNHEALTHY');
  });

  it('evaluates OFFLINE for missing node', () => {
    expect(monitor.evaluateStatus('missing')).toBe('OFFLINE');
  });

  it('maintains health history', () => {
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.5,
      memoryUsage: 0.5,
      latencyMs: 10,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.6,
      memoryUsage: 0.6,
      latencyMs: 20,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    expect(monitor.getHealthHistory('n1')).toHaveLength(2);
  });

  it('removes node health', () => {
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.5,
      memoryUsage: 0.5,
      latencyMs: 10,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    monitor.removeNode('n1');
    expect(monitor.getLatestHealth('n1')).toBeUndefined();
  });

  it('clears all health', () => {
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.5,
      memoryUsage: 0.5,
      latencyMs: 10,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    monitor.clear();
    expect(monitor.getLatestHealth('n1')).toBeUndefined();
  });
});

// ============================================================================
// Cluster Membership Manager
// ============================================================================
describe('ClusterMembershipManager', () => {
  let cmm: ClusterMembershipManager;
  beforeEach(() => {
    cmm = new ClusterMembershipManager();
  });

  it('creates and joins clusters', () => {
    cmm.createCluster({
      clusterId: 'c1',
      name: 'Test',
      minNodes: 1,
      maxNodes: 5,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    });
    expect(cmm.listClusters()).toEqual(['c1']);
    cmm.joinCluster('c1', 'n1');
    expect(cmm.getMembers('c1')).toHaveLength(1);
  });

  it('throws on duplicate cluster creation', () => {
    const config: ClusterConfig = {
      clusterId: 'c1',
      name: 'Test',
      minNodes: 1,
      maxNodes: 5,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    };
    cmm.createCluster(config);
    expect(() => cmm.createCluster(config)).toThrow('already exists');
  });

  it('throws on join to missing cluster', () => {
    expect(() => cmm.joinCluster('missing', 'n1')).toThrow('not found');
  });

  it('throws on duplicate node in cluster', () => {
    cmm.createCluster({
      clusterId: 'c1',
      name: 'T',
      minNodes: 1,
      maxNodes: 5,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    });
    cmm.joinCluster('c1', 'n1');
    expect(() => cmm.joinCluster('c1', 'n1')).toThrow('already in cluster');
  });

  it('throws when cluster is full', () => {
    cmm.createCluster({
      clusterId: 'c1',
      name: 'T',
      minNodes: 1,
      maxNodes: 1,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    });
    cmm.joinCluster('c1', 'n1');
    expect(() => cmm.joinCluster('c1', 'n2')).toThrow('Cluster full');
  });

  it('leaves cluster', () => {
    cmm.createCluster({
      clusterId: 'c1',
      name: 'T',
      minNodes: 1,
      maxNodes: 5,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    });
    cmm.joinCluster('c1', 'n1');
    cmm.leaveCluster('c1', 'n1');
    expect(cmm.getMembers('c1')).toHaveLength(0);
  });

  it('leaves nonexistent cluster gracefully', () => {
    expect(() => cmm.leaveCluster('missing', 'n1')).not.toThrow();
  });

  it('gets config', () => {
    const config: ClusterConfig = {
      clusterId: 'c1',
      name: 'T',
      minNodes: 1,
      maxNodes: 5,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    };
    cmm.createCluster(config);
    expect(cmm.getConfig('c1')).toBeDefined();
    expect(cmm.getConfig('missing')).toBeUndefined();
  });
});

// ============================================================================
// Cluster Coordinator
// ============================================================================
describe('ClusterCoordinator', () => {
  let coordinator: ClusterCoordinator;
  beforeEach(() => {
    coordinator = new ClusterCoordinator();
  });

  it('initializes cluster', () => {
    const state = coordinator.initialize('c1', ['n1', 'n2']);
    expect(state.status).toBe('FORMING');
    expect(state.members).toEqual(['n1', 'n2']);
    expect(state.leader).toBeNull();
    expect(state.checksum).toBeDefined();
  });

  it('elects leader', () => {
    coordinator.initialize('c1', ['n1', 'n2']);
    const updated = coordinator.electLeader('c1', 'n1');
    expect(updated.leader).toBe('n1');
  });

  it('throws on leader election for missing cluster', () => {
    expect(() => coordinator.electLeader('missing', 'n1')).toThrow('not found');
  });

  it('throws on leader election for non-member', () => {
    coordinator.initialize('c1', ['n1']);
    expect(() => coordinator.electLeader('c1', 'n2')).toThrow('not in cluster');
  });

  it('transitions status', () => {
    coordinator.initialize('c1', ['n1']);
    const updated = coordinator.transition('c1', 'ACTIVE');
    expect(updated.status).toBe('ACTIVE');
  });

  it('throws on transition for missing cluster', () => {
    expect(() => coordinator.transition('missing', 'ACTIVE')).toThrow('not found');
  });

  it('gets state', () => {
    coordinator.initialize('c1', ['n1']);
    expect(coordinator.getState('c1')).toBeDefined();
    expect(coordinator.getState('missing')).toBeUndefined();
  });

  it('removes node from cluster', () => {
    coordinator.initialize('c1', ['n1', 'n2']);
    const updated = coordinator.removeNode('c1', 'n1');
    expect(updated.members).toEqual(['n2']);
  });

  it('removes leader node clears leader', () => {
    coordinator.initialize('c1', ['n1', 'n2']);
    coordinator.electLeader('c1', 'n1');
    const updated = coordinator.removeNode('c1', 'n1');
    expect(updated.leader).toBeNull();
  });

  it('removes non-leader preserves leader', () => {
    coordinator.initialize('c1', ['n1', 'n2']);
    coordinator.electLeader('c1', 'n1');
    const updated = coordinator.removeNode('c1', 'n2');
    expect(updated.leader).toBe('n1');
  });

  it('throws on remove for missing cluster', () => {
    expect(() => coordinator.removeNode('missing', 'n1')).toThrow('not found');
  });
});

// ============================================================================
// Distributed Scheduler
// ============================================================================
describe('DistributedScheduler', () => {
  let scheduler: DistributedScheduler;
  beforeEach(() => {
    scheduler = new DistributedScheduler();
  });

  it('enqueues tasks', () => {
    const task = scheduler.enqueue('g1', 5);
    expect(task.goalId).toBe('g1');
    expect(task.state).toBe('PENDING');
    expect(task.checksum).toBeDefined();
  });

  it('assigns tasks', () => {
    const task = scheduler.enqueue('g1', 5);
    const assigned = scheduler.assign(task.taskId, 'n1');
    expect(assigned.assignedNode).toBe('n1');
    expect(assigned.state).toBe('ASSIGNED');
  });

  it('throws on assigning missing task', () => {
    expect(() => scheduler.assign('missing', 'n1')).toThrow('not found');
  });

  it('throws on assigning non-schedulable task', () => {
    const task = scheduler.enqueue('g1', 5);
    scheduler.assign(task.taskId, 'n1');
    scheduler.transition(task.taskId, 'COMPLETED');
    expect(() => scheduler.assign(task.taskId, 'n2')).toThrow('not in schedulable state');
  });

  it('transitions task state', () => {
    const task = scheduler.enqueue('g1', 5);
    scheduler.transition(task.taskId, 'EXECUTING');
    expect(scheduler.getTask(task.taskId)?.state).toBe('EXECUTING');
  });

  it('throws on transition for missing task', () => {
    expect(() => scheduler.transition('missing', 'COMPLETED')).toThrow('not found');
  });

  it('gets pending tasks', () => {
    scheduler.enqueue('g1', 5);
    scheduler.enqueue('g2', 3);
    expect(scheduler.getPendingTasks()).toHaveLength(2);
  });

  it('gets tasks by node', () => {
    const t1 = scheduler.enqueue('g1', 5);
    scheduler.assign(t1.taskId, 'n1');
    expect(scheduler.getTasksByNode('n1')).toHaveLength(1);
    expect(scheduler.getTasksByNode('n2')).toHaveLength(0);
  });

  it('returns policy', () => {
    expect(scheduler.getPolicy().strategy).toBe('LEAST_LOADED');
  });
});

// ============================================================================
// Distributed Task Dispatcher
// ============================================================================
describe('DistributedTaskDispatcher', () => {
  let scheduler: DistributedScheduler;
  let dispatcher: DistributedTaskDispatcher;
  beforeEach(() => {
    scheduler = new DistributedScheduler();
    dispatcher = new DistributedTaskDispatcher(scheduler);
  });

  it('dispatches tasks', () => {
    const task = scheduler.enqueue('g1', 5);
    dispatcher.dispatch(task.taskId, 'n1');
    expect(scheduler.getTask(task.taskId)?.state).toBe('EXECUTING');
  });

  it('migrates tasks', () => {
    const task = scheduler.enqueue('g1', 5);
    dispatcher.dispatch(task.taskId, 'n1');
    const migration = dispatcher.migrate(task.taskId, 'n1', 'n2', 'load');
    expect(migration.fromNode).toBe('n1');
    expect(migration.toNode).toBe('n2');
    expect(dispatcher.getMigrations()).toHaveLength(1);
  });

  it('throws on migrate for missing task', () => {
    expect(() => dispatcher.migrate('missing', 'n1', 'n2', 'load')).toThrow('not found');
  });

  it('completes tasks', () => {
    const task = scheduler.enqueue('g1', 5);
    dispatcher.dispatch(task.taskId, 'n1');
    dispatcher.complete(task.taskId);
    expect(scheduler.getTask(task.taskId)?.state).toBe('COMPLETED');
  });

  it('fails tasks', () => {
    const task = scheduler.enqueue('g1', 5);
    dispatcher.dispatch(task.taskId, 'n1');
    dispatcher.fail(task.taskId);
    expect(scheduler.getTask(task.taskId)?.state).toBe('FAILED');
  });

  it('cancels tasks', () => {
    const task = scheduler.enqueue('g1', 5);
    dispatcher.dispatch(task.taskId, 'n1');
    dispatcher.cancel(task.taskId);
    expect(scheduler.getTask(task.taskId)?.state).toBe('CANCELLED');
  });
});

// ============================================================================
// Cross-Node Collaboration Manager
// ============================================================================
describe('CrossNodeCollaborationManager', () => {
  let manager: CrossNodeCollaborationManager;
  beforeEach(() => {
    manager = new CrossNodeCollaborationManager();
  });

  it('initiates collaboration session', () => {
    const session = manager.initiate('n1', 'g1', ['n2', 'n3']);
    expect(session.initiatorNode).toBe('n1');
    expect(session.participants).toContain('n1');
    expect(session.participants).toContain('n2');
    expect(session.state).toBe('INITIATED');
  });

  it('transitions session state', () => {
    const session = manager.initiate('n1', 'g1', ['n2']);
    const updated = manager.transition(session.sessionId, 'EXECUTING');
    expect(updated.state).toBe('EXECUTING');
  });

  it('throws on transition for missing session', () => {
    expect(() => manager.transition('missing', 'EXECUTING')).toThrow('not found');
  });

  it('sends and retrieves messages', () => {
    const msg = makeCollabMessage('m1', 'n1', 'n2', 'PROPOSAL');
    manager.sendMessage(msg);
    expect(manager.getMessages('n1')).toHaveLength(1);
    expect(manager.getMessages(undefined, 'n2')).toHaveLength(1);
    expect(manager.getMessages('n2')).toHaveLength(0);
  });

  it('gets session', () => {
    const session = manager.initiate('n1', 'g1', ['n2']);
    expect(manager.getSession(session.sessionId)).toBeDefined();
    expect(manager.getSession('missing')).toBeUndefined();
  });

  it('gets sessions by node', () => {
    manager.initiate('n1', 'g1', ['n2']);
    expect(manager.getSessionsByNode('n1')).toHaveLength(1);
    expect(manager.getSessionsByNode('n3')).toHaveLength(0);
  });
});

// ============================================================================
// Distributed Consensus Engine
// ============================================================================
describe('DistributedConsensusEngine', () => {
  let engine: DistributedConsensusEngine;
  beforeEach(() => {
    engine = new DistributedConsensusEngine();
  });

  it('proposes', () => {
    const proposal = engine.propose('n1', { decision: 'approve' });
    expect(proposal.proposerNode).toBe('n1');
    expect(proposal.state).toBe('PROPOSED');
    expect(proposal.checksum).toBeDefined();
  });

  it('casts votes', () => {
    const proposal = engine.propose('n1', {});
    engine.castVote(proposal.proposalId, 'n1', true, 'agree');
    expect(engine.getVotes(proposal.proposalId)).toHaveLength(1);
  });

  it('throws on vote for missing proposal', () => {
    expect(() => engine.castVote('missing', 'n1', true, 'r')).toThrow('not found');
  });

  it('throws on duplicate vote', () => {
    const proposal = engine.propose('n1', {});
    engine.castVote(proposal.proposalId, 'n1', true, 'r');
    expect(() => engine.castVote(proposal.proposalId, 'n1', false, 'r')).toThrow('already voted');
  });

  it('resolves with quorum', () => {
    const proposal = engine.propose('n1', {});
    engine.castVote(proposal.proposalId, 'n1', true, 'r');
    engine.castVote(proposal.proposalId, 'n2', true, 'r');
    engine.castVote(proposal.proposalId, 'n3', false, 'r');
    const result = engine.resolve(proposal.proposalId, 3);
    expect(result.accepted).toBe(true);
    expect(result.votes.get('n1')).toBe(true);
  });

  it('resolves with rejection on tie', () => {
    const proposal = engine.propose('n1', {});
    engine.castVote(proposal.proposalId, 'n1', true, 'r');
    engine.castVote(proposal.proposalId, 'n2', false, 'r');
    const result = engine.resolve(proposal.proposalId, 2);
    expect(result.accepted).toBe(false);
  });

  it('throws on resolve with insufficient quorum', () => {
    const proposal = engine.propose('n1', {});
    engine.castVote(proposal.proposalId, 'n1', true, 'r');
    expect(() => engine.resolve(proposal.proposalId, 5)).toThrow('Quorum not met');
  });

  it('throws on resolve for missing proposal', () => {
    expect(() => engine.resolve('missing', 1)).toThrow('not found');
  });

  it('gets results', () => {
    const proposal = engine.propose('n1', {});
    engine.castVote(proposal.proposalId, 'n1', true, 'r');
    engine.resolve(proposal.proposalId, 1);
    expect(engine.getResults()).toHaveLength(1);
  });
});

// ============================================================================
// Knowledge Replication Manager
// ============================================================================
describe('KnowledgeReplicationManager', () => {
  let km: KnowledgeReplicationManager;
  beforeEach(() => {
    km = new KnowledgeReplicationManager();
  });

  it('stores and retrieves entries', () => {
    const entry = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    km.store(entry);
    expect(km.get('e1')).toBeDefined();
    expect(km.getAll()).toHaveLength(1);
  });

  it('gets by key', () => {
    const entry = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    km.store(entry);
    expect(km.getByKey('k1')).toBeDefined();
    expect(km.getByKey('missing')).toBeUndefined();
  });

  it('replicates entries', () => {
    const entry = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    km.store(entry);
    const replica = km.replicate('e1', 'n2');
    expect(replica.nodeId).toBe('n2');
    expect(km.getReplicas('e1')).toHaveLength(1);
  });

  it('updates existing replica', () => {
    const entry = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    km.store(entry);
    km.replicate('e1', 'n2');
    km.replicate('e1', 'n2');
    expect(km.getReplicas('e1')).toHaveLength(1);
  });

  it('throws on replicate for missing entry', () => {
    expect(() => km.replicate('missing', 'n1')).toThrow('not found');
  });

  it('returns empty replicas for unknown entry', () => {
    expect(km.getReplicas('missing')).toEqual([]);
  });
});

// ============================================================================
// Knowledge Synchronization Engine
// ============================================================================
describe('KnowledgeSynchronizationEngine', () => {
  let sync: KnowledgeSynchronizationEngine;
  beforeEach(() => {
    sync = new KnowledgeSynchronizationEngine();
  });

  it('syncs when local is newer', () => {
    const local = makeKnowledgeEntry('e1', 'k1', 2, 'n1');
    const remote = makeKnowledgeEntry('e1', 'k1', 1, 'n2');
    const result = sync.synchronize(local, remote);
    expect(result.status).toBe('SYNCED');
    expect(result.winningVersion).toBe(2);
  });

  it('syncs when remote is newer', () => {
    const local = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    const remote = makeKnowledgeEntry('e1', 'k1', 3, 'n2');
    const result = sync.synchronize(local, remote);
    expect(result.status).toBe('SYNCED');
    expect(result.winningVersion).toBe(3);
  });

  it('merges when versions are equal', () => {
    const local = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    const remote = makeKnowledgeEntry('e1', 'k1', 1, 'n2');
    const result = sync.synchronize(local, remote);
    expect(result.status).toBe('MERGED');
    expect(sync.getSyncHistory()).toHaveLength(1);
  });

  it('detects conflict', () => {
    const local = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    const remote: KnowledgeEntry = { ...local, checksum: 'different' };
    expect(sync.detectConflict(local, remote)).toBe(true);
    expect(sync.detectConflict(local, local)).toBe(false);
  });

  it('merges entries', () => {
    const local = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    const remote = makeKnowledgeEntry('e1', 'k1', 3, 'n2');
    const merged = sync.merge(local, remote);
    expect(merged.version).toBe(3);
    expect(sync.getSyncHistory()).toHaveLength(1);
  });
});

// ============================================================================
// Distributed Memory Coordinator
// ============================================================================
describe('DistributedMemoryCoordinator', () => {
  let mem: DistributedMemoryCoordinator;
  beforeEach(() => {
    mem = new DistributedMemoryCoordinator();
  });

  it('sets and gets values', () => {
    mem.set('k1', { data: 1 }, 'n1');
    const entry = mem.get('k1');
    expect(entry).toBeDefined();
    expect(entry?.value).toEqual({ data: 1 });
  });

  it('returns undefined for expired entries', () => {
    mem.set('k1', 'v1', 'n1', 0);
    expect(mem.get('k1')).toBeUndefined();
  });

  it('deletes values', () => {
    mem.set('k1', 'v1', 'n1');
    expect(mem.delete('k1')).toBe(true);
    expect(mem.get('k1')).toBeUndefined();
  });

  it('returns false for deleting missing key', () => {
    expect(mem.delete('missing')).toBe(false);
  });

  it('creates snapshot', () => {
    mem.set('k1', 'v1', 'n1');
    const snap = mem.snapshot('n1');
    expect(snap.entries).toHaveLength(1);
    expect(snap.nodeId).toBe('n1');
    expect(snap.checksum).toBeDefined();
  });

  it('restores from snapshot', () => {
    mem.set('k1', 'v1', 'n1');
    const snap = mem.snapshot('n1');
    mem.delete('k1');
    mem.restore(snap);
    expect(mem.get('k1')).toBeDefined();
  });

  it('returns all entries', () => {
    mem.set('k1', 'v1', 'n1');
    mem.set('k2', 'v2', 'n2');
    expect(mem.getAll()).toHaveLength(2);
  });
});

// ============================================================================
// Inter-Node Message Bus
// ============================================================================
describe('InterNodeMessageBus', () => {
  let bus: InterNodeMessageBus;
  beforeEach(() => {
    bus = new InterNodeMessageBus();
  });

  it('publishes to subscribers', () => {
    const fn = vi.fn();
    bus.subscribe('n1', fn);
    bus.publish(makeCollabMessage('m1', 'n2', 'n1'));
    expect(fn).toHaveBeenCalled();
  });

  it('adds to dead letter queue when no subscribers', () => {
    bus.publish(makeCollabMessage('m1', 'n1', 'n2'));
    expect(bus.getDeadLetterQueue()).toHaveLength(1);
  });

  it('unsubscribes', () => {
    const fn = vi.fn();
    bus.subscribe('n1', fn);
    bus.unsubscribe('n1');
    bus.publish(makeCollabMessage('m1', 'n2', 'n1'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('clears dead letter queue', () => {
    bus.publish(makeCollabMessage('m1', 'n1', 'n2'));
    bus.clearDeadLetterQueue();
    expect(bus.getDeadLetterQueue()).toHaveLength(0);
  });

  it('gets subscriber count', () => {
    bus.subscribe('n1', vi.fn());
    expect(bus.getSubscribers('n1')).toBe(1);
    expect(bus.getSubscribers('n2')).toBe(0);
  });
});

// ============================================================================
// Reliable Message Queue
// ============================================================================
describe('ReliableMessageQueue', () => {
  let queue: ReliableMessageQueue;
  beforeEach(() => {
    queue = new ReliableMessageQueue(2);
  });

  it('enqueues and dequeues', () => {
    queue.enqueue(makeCollabMessage('m1', 'n1', 'n2'));
    expect(queue.size()).toBe(1);
    const msg = queue.dequeue();
    expect(msg?.message.messageId).toBe('m1');
    expect(queue.size()).toBe(0);
  });

  it('acknowledges messages', () => {
    queue.enqueue(makeCollabMessage('m1', 'n1', 'n2'));
    queue.acknowledge('m1');
    expect(queue.size()).toBe(0);
    expect(queue.getProcessed()).toHaveLength(1);
  });

  it('acknowledges missing message gracefully', () => {
    queue.acknowledge('missing');
    expect(queue.size()).toBe(0);
  });

  it('requeues messages within limit', () => {
    queue.enqueue(makeCollabMessage('m1', 'n1', 'n2'));
    expect(queue.requeue('m1')).toBe(true);
    expect(queue.getAll()[0].attempts).toBe(1);
  });

  it('drops messages exceeding max attempts', () => {
    queue.enqueue(makeCollabMessage('m1', 'n1', 'n2'));
    queue.requeue('m1');
    queue.requeue('m1');
    expect(queue.requeue('m1')).toBe(false);
    expect(queue.size()).toBe(0);
  });

  it('returns false for requeue of missing message', () => {
    expect(queue.requeue('missing')).toBe(false);
  });
});

// ============================================================================
// Distributed Event Bus
// ============================================================================
describe('DistributedEventBus', () => {
  let eventBus: DistributedEventBus;
  beforeEach(() => {
    eventBus = new DistributedEventBus();
  });

  it('publishes and subscribes', () => {
    const fn = vi.fn();
    eventBus.subscribe('test', fn);
    const event: DistributedEvent = {
      eventType: 'test',
      sourceNode: 'n1',
      payload: {},
      timestamp: new Date(),
      checksum: 'c',
    };
    eventBus.publish(event);
    expect(fn).toHaveBeenCalled();
  });

  it('logs events', () => {
    const event: DistributedEvent = {
      eventType: 'test',
      sourceNode: 'n1',
      payload: {},
      timestamp: new Date(),
      checksum: 'c',
    };
    eventBus.publish(event);
    expect(eventBus.getEventLog()).toHaveLength(1);
  });

  it('unsubscribes', () => {
    const fn = vi.fn();
    eventBus.subscribe('test', fn);
    eventBus.unsubscribe('test');
    const event: DistributedEvent = {
      eventType: 'test',
      sourceNode: 'n1',
      payload: {},
      timestamp: new Date(),
      checksum: 'c',
    };
    eventBus.publish(event);
    expect(fn).not.toHaveBeenCalled();
  });

  it('gets listeners', () => {
    eventBus.subscribe('test', vi.fn());
    expect(eventBus.getListeners('test')).toHaveLength(1);
    expect(eventBus.getListeners('other')).toHaveLength(0);
  });

  it('clears', () => {
    eventBus.subscribe('test', vi.fn());
    eventBus.clear();
    expect(eventBus.getListeners('test')).toHaveLength(0);
  });
});

// ============================================================================
// Distributed Checkpoint Manager
// ============================================================================
describe('DistributedCheckpointManager', () => {
  let cm: DistributedCheckpointManager;
  beforeEach(() => {
    cm = new DistributedCheckpointManager();
  });

  it('saves and loads checkpoints', () => {
    const cp = cm.save('n1', 's1', { data: 1 }, 1);
    expect(cp.nodeId).toBe('n1');
    expect(cp.checksum).toBeDefined();
    const loaded = cm.load('s1');
    expect(loaded).toBeDefined();
    expect(loaded?.checkpointId).toBe(cp.checkpointId);
  });

  it('loads latest checkpoint for node', () => {
    cm.save('n1', 's1', { v: 1 }, 1);
    cm.save('n1', 's1', { v: 2 }, 2);
    const loaded = cm.load('s1', 'n1');
    expect(loaded?.version).toBe(2);
  });

  it('returns undefined for missing session', () => {
    expect(cm.load('missing')).toBeUndefined();
  });

  it('validates checkpoint integrity', () => {
    const cp = cm.save('n1', 's1', { data: 1 }, 1);
    expect(cm.validate(cp)).toBe(true);
  });

  it('lists checkpoints', () => {
    cm.save('n1', 's1', {}, 1);
    cm.save('n2', 's1', {}, 2);
    expect(cm.list('s1')).toHaveLength(2);
  });

  it('removes checkpoint', () => {
    const cp = cm.save('n1', 's1', {}, 1);
    expect(cm.remove('s1', cp.checkpointId)).toBe(true);
    expect(cm.list('s1')).toHaveLength(0);
  });

  it('returns false for removing missing checkpoint', () => {
    expect(cm.remove('s1', 'missing')).toBe(false);
  });
});

// ============================================================================
// Distributed Recovery Manager
// ============================================================================
describe('DistributedRecoveryManager', () => {
  let cm: DistributedCheckpointManager;
  let rm: DistributedRecoveryManager;
  beforeEach(() => {
    cm = new DistributedCheckpointManager();
    rm = new DistributedRecoveryManager(cm);
  });

  it('plans recovery', () => {
    cm.save('n1', 's1', { data: 1 }, 1);
    const plan = rm.planRecovery('s1', 'n2');
    expect(plan.targetNodeId).toBe('n2');
    expect(plan.state).toEqual({ data: 1 });
  });

  it('throws on plan for missing checkpoint', () => {
    expect(() => rm.planRecovery('missing', 'n1')).toThrow('No checkpoint');
  });

  it('executes recovery', () => {
    cm.save('n1', 's1', { data: 1 }, 1);
    rm.planRecovery('s1', 'n2');
    const state = rm.executeRecovery('s1');
    expect(state).toEqual({ data: 1 });
  });

  it('returns undefined for execute without plan', () => {
    expect(rm.executeRecovery('missing')).toBeUndefined();
  });

  it('gets plan', () => {
    cm.save('n1', 's1', {}, 1);
    rm.planRecovery('s1', 'n2');
    expect(rm.getPlan('s1')).toBeDefined();
    expect(rm.getPlan('missing')).toBeUndefined();
  });

  it('cancels recovery', () => {
    cm.save('n1', 's1', {}, 1);
    rm.planRecovery('s1', 'n2');
    expect(rm.cancelRecovery('s1')).toBe(true);
    expect(rm.cancelRecovery('missing')).toBe(false);
  });
});

// ============================================================================
// Distributed Replay Engine
// ============================================================================
describe('DistributedReplayEngine', () => {
  let replay: DistributedReplayEngine;
  beforeEach(() => {
    replay = new DistributedReplayEngine();
  });

  it('records entries', () => {
    const entry = replay.record('s1', 'n1', 'action1', { data: 1 });
    expect(entry.sessionId).toBe('s1');
    expect(entry.checksum).toBeDefined();
  });

  it('gets entries', () => {
    replay.record('s1', 'n1', 'a1', {});
    replay.record('s1', 'n2', 'a2', {});
    expect(replay.getEntries('s1')).toHaveLength(2);
  });

  it('validates replay integrity', () => {
    replay.record('s1', 'n1', 'a1', { data: 1 });
    expect(replay.validate('s1')).toBe(true);
  });

  it('returns empty entries for missing session', () => {
    expect(replay.getEntries('missing')).toEqual([]);
  });

  it('gets sessions', () => {
    replay.record('s1', 'n1', 'a1', {});
    replay.record('s2', 'n1', 'a2', {});
    expect(replay.getSessions()).toEqual(['s1', 's2']);
  });
});

// ============================================================================
// Distributed Audit Manager
// ============================================================================
describe('DistributedAuditManager', () => {
  let audit: DistributedAuditManager;
  beforeEach(() => {
    audit = new DistributedAuditManager();
  });

  it('logs entries', () => {
    const entry = audit.log('t1', 'n1', 's1', 'action', { data: 1 });
    expect(entry.checksum).toBeDefined();
    expect(entry.nodeId).toBe('n1');
  });

  it('verifies integrity', () => {
    audit.log('t1', 'n1', 's1', 'action', {});
    expect(audit.verifyIntegrity('s1')).toBe(true);
  });

  it('returns true for empty session integrity', () => {
    expect(audit.verifyIntegrity('empty')).toBe(true);
  });

  it('gets entries by session', () => {
    audit.log('t1', 'n1', 's1', 'a1', {});
    audit.log('t2', 'n1', 's2', 'a2', {});
    expect(audit.getEntries('s1')).toHaveLength(1);
  });

  it('gets all entries', () => {
    audit.log('t1', 'n1', 's1', 'a1', {});
    expect(audit.getEntries()).toHaveLength(1);
  });
});

// ============================================================================
// Distributed Metrics Collector
// ============================================================================
describe('DistributedMetricsCollector', () => {
  let metrics: DistributedMetricsCollector;
  beforeEach(() => {
    metrics = new DistributedMetricsCollector();
  });

  it('records metrics', () => {
    metrics.record('cpu', 0.5, 'n1');
    expect(metrics.getAll()).toHaveLength(1);
  });

  it('queries metrics', () => {
    metrics.record('cpu', 0.5, 'n1');
    metrics.record('cpu', 0.7, 'n2');
    expect(metrics.query('cpu', 'n1')).toHaveLength(1);
    expect(metrics.query('mem')).toHaveLength(0);
  });

  it('aggregates metrics', () => {
    metrics.record('cpu', 0.5, 'n1');
    metrics.record('cpu', 0.7, 'n1');
    const agg = metrics.aggregate('cpu', 'n1');
    expect(agg.count).toBe(2);
    expect(agg.sum).toBe(1.2);
    expect(agg.avg).toBe(0.6);
    expect(agg.max).toBe(0.7);
    expect(agg.min).toBe(0.5);
  });

  it('returns zero aggregate for empty', () => {
    const agg = metrics.aggregate('cpu', 'n1');
    expect(agg.count).toBe(0);
    expect(agg.sum).toBe(0);
  });

  it('clears', () => {
    metrics.record('cpu', 0.5, 'n1');
    metrics.clear();
    expect(metrics.getAll()).toHaveLength(0);
  });
});

// ============================================================================
// Distributed Trace Manager
// ============================================================================
describe('DistributedTraceManager', () => {
  let trace: DistributedTraceManager;
  beforeEach(() => {
    trace = new DistributedTraceManager();
  });

  it('starts and finishes spans', () => {
    const spanId = trace.startSpan('t1', 'n1', 'op1');
    const span = trace.finishSpan(
      spanId,
      't1',
      'n1',
      'op1',
      new Date(Date.now() - 100),
      null,
      'OK',
    );
    expect(span.spanId).toBe(spanId);
    expect(span.durationMs).toBeGreaterThanOrEqual(100);
    expect(span.checksum).toBeDefined();
  });

  it('gets spans by trace', () => {
    const spanId = trace.startSpan('t1', 'n1', 'op1');
    trace.finishSpan(spanId, 't1', 'n1', 'op1', new Date(), null, 'OK');
    expect(trace.getSpans('t1')).toHaveLength(1);
  });

  it('gets spans by node', () => {
    const spanId = trace.startSpan('t1', 'n1', 'op1');
    trace.finishSpan(spanId, 't1', 'n1', 'op1', new Date(), null, 'OK');
    expect(trace.getSpansByNode('n1')).toHaveLength(1);
    expect(trace.getSpansByNode('n2')).toHaveLength(0);
  });

  it('validates trace integrity', () => {
    const spanId = trace.startSpan('t1', 'n1', 'op1');
    trace.finishSpan(spanId, 't1', 'n1', 'op1', new Date(), null, 'OK');
    expect(trace.validateTrace('t1')).toBe(true);
  });

  it('gets trace ids', () => {
    const s1 = trace.startSpan('t1', 'n1', 'op1');
    trace.finishSpan(s1, 't1', 'n1', 'op1', new Date(), null, 'OK');
    const s2 = trace.startSpan('t2', 'n1', 'op2');
    trace.finishSpan(s2, 't2', 'n1', 'op2', new Date(), null, 'OK');
    expect(trace.getTraceIds()).toEqual(['t1', 't2']);
  });
});

// ============================================================================
// Distributed Configuration Manager
// ============================================================================
describe('DistributedConfigurationManager', () => {
  let config: DistributedConfigurationManager;
  beforeEach(() => {
    config = new DistributedConfigurationManager();
  });

  it('sets and gets config', () => {
    config.set('k1', { value: 1 }, 'n1');
    expect(config.get('k1')).toBeDefined();
    expect(config.getValue('k1')).toEqual({ value: 1 });
    expect(config.get('missing')).toBeUndefined();
    expect(config.getValue('missing')).toBeUndefined();
  });

  it('syncs configs', () => {
    const entry = config.set('k1', 'v1', 'n1');
    const newConfig = new DistributedConfigurationManager();
    newConfig.sync([entry]);
    expect(newConfig.getValue('k1')).toBe('v1');
  });

  it('does not sync older versions', () => {
    config.set('k1', 'v1', 'n1');
    const entry = config.set('k1', 'v2', 'n1');
    const newConfig = new DistributedConfigurationManager();
    newConfig.set('k1', 'v3', 'n2');
    const v3 = newConfig.set('k1', 'v3', 'n2');
    newConfig.sync([entry]);
    expect(newConfig.getValue('k1')).toBe('v3');
  });

  it('deletes config', () => {
    config.set('k1', 'v1', 'n1');
    expect(config.delete('k1')).toBe(true);
    expect(config.get('k1')).toBeUndefined();
    expect(config.delete('missing')).toBe(false);
  });

  it('validates config integrity', () => {
    config.set('k1', 'v1', 'n1');
    expect(config.validate('k1')).toBe(true);
    expect(config.validate('missing')).toBe(false);
  });

  it('gets all', () => {
    config.set('k1', 'v1', 'n1');
    config.set('k2', 'v2', 'n1');
    expect(config.getAll()).toHaveLength(2);
  });
});

// ============================================================================
// Distributed Security Validator
// ============================================================================
describe('DistributedSecurityValidator', () => {
  let sec: DistributedSecurityValidator;
  beforeEach(() => {
    sec = new DistributedSecurityValidator();
  });

  it('issues and validates tokens', () => {
    const token = sec.issueToken('n1', ['read', 'write']);
    expect(sec.validateToken(token.tokenId)).toBe(true);
  });

  it('rejects expired tokens', () => {
    const token = sec.issueToken('n1', ['read'], -1);
    expect(sec.validateToken(token.tokenId)).toBe(false);
  });

  it('checks permissions', () => {
    const token = sec.issueToken('n1', ['read']);
    expect(sec.hasPermission(token.tokenId, 'read')).toBe(true);
    expect(sec.hasPermission(token.tokenId, 'write')).toBe(false);
  });

  it('checks permissions for invalid token', () => {
    expect(sec.hasPermission('missing', 'read')).toBe(false);
  });

  it('revokes tokens', () => {
    const token = sec.issueToken('n1', ['read']);
    expect(sec.revokeToken(token.tokenId)).toBe(true);
    expect(sec.validateToken(token.tokenId)).toBe(false);
    expect(sec.revokeToken('missing')).toBe(false);
  });

  it('gets token', () => {
    const token = sec.issueToken('n1', ['read']);
    expect(sec.getToken(token.tokenId)).toBeDefined();
    expect(sec.getToken('missing')).toBeUndefined();
  });

  it('gets tokens by node', () => {
    sec.issueToken('n1', ['read']);
    sec.issueToken('n2', ['write']);
    expect(sec.getTokensByNode('n1')).toHaveLength(1);
    expect(sec.getTokensByNode('n3')).toHaveLength(0);
  });
});

// ============================================================================
// Distributed Integrity Validator
// ============================================================================
describe('DistributedIntegrityValidator', () => {
  let iv: DistributedIntegrityValidator;
  beforeEach(() => {
    iv = new DistributedIntegrityValidator();
  });

  it('validates integrity', () => {
    const record = iv.validate('task', 't1', { data: 1 });
    expect(record.checksum).toBeDefined();
  });

  it('verifies integrity', () => {
    iv.validate('task', 't1', { data: 1 });
    expect(iv.verify('task', 't1', { data: 1 })).toBe(true);
  });

  it('fails verification for wrong data', () => {
    iv.validate('task', 't1', { data: 1 });
    expect(iv.verify('task', 't1', { data: 2 })).toBe(false);
  });

  it('fails verification for unknown entity', () => {
    expect(iv.verify('task', 'missing', {})).toBe(false);
  });

  it('gets records', () => {
    iv.validate('task', 't1', {});
    expect(iv.getRecords('task')).toHaveLength(1);
    expect(iv.getRecords('other')).toHaveLength(0);
  });

  it('clears', () => {
    iv.validate('task', 't1', {});
    iv.clear();
    expect(iv.getRecords('task')).toHaveLength(0);
  });
});

// ============================================================================
// Distributed Version Manager
// ============================================================================
describe('DistributedVersionManager', () => {
  let vm: DistributedVersionManager;
  beforeEach(() => {
    vm = new DistributedVersionManager();
  });

  it('registers versions', () => {
    vm.register({
      packageName: 'pkg',
      version: '1.0.0',
      compatibleVersions: ['0.9.0'],
      deprecatedVersions: [],
    });
    expect(vm.getVersion('pkg')).toBeDefined();
  });

  it('validates compatible version', () => {
    vm.register({
      packageName: 'pkg',
      version: '1.0.0',
      compatibleVersions: ['0.9.0'],
      deprecatedVersions: [],
    });
    expect(vm.isCompatible('pkg', '1.0.0')).toBe(true);
    expect(vm.isCompatible('pkg', '0.9.0')).toBe(true);
    expect(vm.isCompatible('pkg', '0.8.0')).toBe(false);
    expect(vm.isCompatible('missing', '1.0.0')).toBe(false);
  });

  it('rejects deprecated versions', () => {
    vm.register({
      packageName: 'pkg',
      version: '1.0.0',
      compatibleVersions: ['0.9.0'],
      deprecatedVersions: ['0.9.0'],
    });
    expect(vm.isCompatible('pkg', '0.9.0')).toBe(false);
  });

  it('deprecates versions', () => {
    vm.register({
      packageName: 'pkg',
      version: '1.0.0',
      compatibleVersions: ['0.9.0'],
      deprecatedVersions: [],
    });
    vm.deprecate('pkg', '0.9.0');
    expect(vm.isCompatible('pkg', '0.9.0')).toBe(false);
  });

  it('deprecate on missing package does nothing', () => {
    vm.deprecate('missing', '1.0.0');
  });

  it('gets all versions', () => {
    vm.register({
      packageName: 'a',
      version: '1.0.0',
      compatibleVersions: [],
      deprecatedVersions: [],
    });
    vm.register({
      packageName: 'b',
      version: '2.0.0',
      compatibleVersions: [],
      deprecatedVersions: [],
    });
    expect(vm.getAll()).toHaveLength(2);
  });
});

// ============================================================================
// Distributed Compatibility Validator
// ============================================================================
describe('DistributedCompatibilityValidator', () => {
  let cv: DistributedCompatibilityValidator;
  let vm: DistributedVersionManager;
  beforeEach(() => {
    vm = new DistributedVersionManager();
    cv = new DistributedCompatibilityValidator(vm);
  });

  it('validates compatible version', () => {
    vm.register({
      packageName: 'pkg',
      version: '1.0.0',
      compatibleVersions: ['0.9.0'],
      deprecatedVersions: [],
    });
    const check = cv.validate('pkg', '0.9.0');
    expect(check.compatible).toBe(true);
  });

  it('validates all versions', () => {
    vm.register({
      packageName: 'pkg',
      version: '1.0.0',
      compatibleVersions: ['0.9.0'],
      deprecatedVersions: [],
    });
    const checks = cv.validateAll();
    expect(checks.length).toBeGreaterThanOrEqual(1);
  });

  it('gets checks', () => {
    vm.register({
      packageName: 'pkg',
      version: '1.0.0',
      compatibleVersions: [],
      deprecatedVersions: [],
    });
    cv.validate('pkg', '1.0.0');
    expect(cv.getChecks()).toHaveLength(1);
  });

  it('gets failures', () => {
    vm.register({
      packageName: 'pkg',
      version: '1.0.0',
      compatibleVersions: ['0.8.0'],
      deprecatedVersions: ['0.8.0'],
    });
    cv.validate('pkg', '0.8.0');
    expect(cv.getFailures()).toHaveLength(1);
  });
});

// ============================================================================
// Distributed Workflow Coordinator
// ============================================================================
describe('DistributedWorkflowCoordinator', () => {
  let registry: NodeRegistry;
  let scheduler: DistributedScheduler;
  let dispatcher: DistributedTaskDispatcher;
  let coordinator: DistributedWorkflowCoordinator;
  beforeEach(() => {
    registry = new NodeRegistry();
    scheduler = new DistributedScheduler();
    dispatcher = new DistributedTaskDispatcher(scheduler);
    coordinator = new DistributedWorkflowCoordinator(scheduler, dispatcher, registry);
  });

  it('plans workflow', () => {
    const plan = coordinator.plan('g1', 5);
    expect(plan.taskCount).toBe(5);
    expect(plan.estimatedNodes).toBe(0);
    expect(plan.checksum).toBeDefined();
  });

  it('schedules tasks', () => {
    const tasks = coordinator.scheduleTasks('g1', 3);
    expect(tasks).toHaveLength(3);
  });

  it('assigns tasks', () => {
    const tasks = coordinator.scheduleTasks('g1', 2);
    coordinator.assignTasks(
      tasks.map((t) => t.taskId),
      'n1',
    );
    expect(scheduler.getTasksByNode('n1')).toHaveLength(2);
  });

  it('completes tasks', () => {
    const tasks = coordinator.scheduleTasks('g1', 1);
    coordinator.assignTasks([tasks[0]!.taskId], 'n1');
    coordinator.completeTasks([tasks[0]!.taskId]);
    expect(scheduler.getTask(tasks[0]!.taskId)?.state).toBe('COMPLETED');
  });

  it('fails tasks', () => {
    const tasks = coordinator.scheduleTasks('g1', 1);
    coordinator.assignTasks([tasks[0]!.taskId], 'n1');
    coordinator.failTasks([tasks[0]!.taskId]);
    expect(scheduler.getTask(tasks[0]!.taskId)?.state).toBe('FAILED');
  });
});

// ============================================================================
// Distributed Goal Coordinator
// ============================================================================
describe('DistributedGoalCoordinator', () => {
  let registry: NodeRegistry;
  let scheduler: DistributedScheduler;
  let gc: DistributedGoalCoordinator;
  beforeEach(() => {
    registry = new NodeRegistry();
    scheduler = new DistributedScheduler();
    gc = new DistributedGoalCoordinator(registry);
  });

  it('assigns goal to available nodes', () => {
    registry.register(makeNodeMeta('n1'));
    registry.register(makeNodeMeta('n2'));
    const plan = gc.assignGoal('g1', 5);
    expect(plan.assignedNodes).toHaveLength(2);
    expect(plan.checksum).toBeDefined();
  });

  it('assigns goal to preferred nodes', () => {
    registry.register(makeNodeMeta('n1'));
    registry.register(makeNodeMeta('n2'));
    const plan = gc.assignGoal('g1', 5, ['n1']);
    expect(plan.assignedNodes).toEqual(['n1']);
  });

  it('filters invalid preferred nodes', () => {
    registry.register(makeNodeMeta('n1'));
    const plan = gc.assignGoal('g1', 5, ['n1', 'nonexistent']);
    expect(plan.assignedNodes).toEqual(['n1']);
  });

  it('gets plan', () => {
    gc.assignGoal('g1', 5);
    expect(gc.getPlan('g1')).toBeDefined();
    expect(gc.getPlan('missing')).toBeUndefined();
  });

  it('completes goal', () => {
    gc.assignGoal('g1', 5);
    gc.completeGoal('g1');
    expect(gc.getPlan('g1')).toBeUndefined();
  });

  it('gets all plans', () => {
    gc.assignGoal('g1', 5);
    gc.assignGoal('g2', 3);
    expect(gc.getAllPlans()).toHaveLength(2);
  });
});

// ============================================================================
// Distributed Learning Synchronizer
// ============================================================================
describe('DistributedLearningSynchronizer', () => {
  let km: KnowledgeReplicationManager;
  let sync: DistributedLearningSynchronizer;
  beforeEach(() => {
    km = new KnowledgeReplicationManager();
    sync = new DistributedLearningSynchronizer(km);
  });

  it('synchronizes new entries', () => {
    const result = sync.synchronize('s1', [makeKnowledgeEntry('e1', 'k1', 1, 'n1')]);
    expect(result.syncedEntries).toBe(1);
    expect(result.conflictsResolved).toBe(0);
  });

  it('synchronizes with version conflict resolution', () => {
    km.store(makeKnowledgeEntry('e1', 'k1', 1, 'n1'));
    const result = sync.synchronize('s1', [makeKnowledgeEntry('e1', 'k1', 3, 'n2')]);
    expect(result.syncedEntries).toBe(1);
    expect(result.conflictsResolved).toBe(1);
  });

  it('does not sync when local is newer', () => {
    km.store(makeKnowledgeEntry('e1', 'k1', 5, 'n1'));
    const result = sync.synchronize('s1', [makeKnowledgeEntry('e1', 'k1', 1, 'n2')]);
    expect(result.syncedEntries).toBe(0);
  });

  it('gets results', () => {
    sync.synchronize('s1', []);
    expect(sync.getResults()).toHaveLength(1);
  });
});

// ============================================================================
// Distributed Planning Coordinator
// ============================================================================
describe('DistributedPlanningCoordinator', () => {
  let registry: NodeRegistry;
  let pc: DistributedPlanningCoordinator;
  beforeEach(() => {
    registry = new NodeRegistry();
    pc = new DistributedPlanningCoordinator(registry);
  });

  it('creates plan with matching capabilities', () => {
    registry.register(makeNodeMeta('n1', 'us-east', ['compute']));
    registry.register(makeNodeMeta('n2', 'us-east', ['storage']));
    const plan = pc.createPlan('g1', ['compute']);
    expect(plan.nodes).toHaveLength(1);
    expect(plan.estimatedDuration).toBeGreaterThan(0);
    expect(plan.checksum).toBeDefined();
  });

  it('creates plan with no matches', () => {
    registry.register(makeNodeMeta('n1', 'us-east', ['compute']));
    const plan = pc.createPlan('g1', ['storage']);
    expect(plan.nodes).toHaveLength(0);
  });

  it('gets plans', () => {
    pc.createPlan('g1', ['compute']);
    expect(pc.getPlans()).toHaveLength(1);
  });
});

// ============================================================================
// Distributed Resource Allocator
// ============================================================================
describe('DistributedResourceAllocator', () => {
  let registry: NodeRegistry;
  let ra: DistributedResourceAllocator;
  beforeEach(() => {
    registry = new NodeRegistry();
    registry.register(makeNodeMeta('n1'));
    ra = new DistributedResourceAllocator(registry);
  });

  it('allocates resources', () => {
    const alloc = ra.allocate('n1', 'cpu', 4);
    expect(alloc.nodeId).toBe('n1');
    expect(alloc.amount).toBe(4);
    expect(alloc.checksum).toBeDefined();
  });

  it('throws on allocate for missing node', () => {
    expect(() => ra.allocate('missing', 'cpu', 4)).toThrow('not found');
  });

  it('gets allocations', () => {
    ra.allocate('n1', 'cpu', 4);
    expect(ra.getAllocations('n1')).toHaveLength(1);
    expect(ra.getAllocations('n2')).toHaveLength(0);
  });

  it('releases resources', () => {
    const alloc = ra.allocate('n1', 'cpu', 4);
    expect(ra.release(alloc.allocationId, 'n1')).toBe(true);
    expect(ra.getAllocations('n1')).toHaveLength(0);
  });

  it('returns false for releasing missing allocation', () => {
    expect(ra.release('missing', 'n1')).toBe(false);
    expect(ra.release('missing', 'missing')).toBe(false);
  });

  it('calculates total allocated', () => {
    ra.allocate('n1', 'cpu', 2);
    ra.allocate('n1', 'cpu', 3);
    expect(ra.getTotalAllocated('n1', 'cpu')).toBe(5);
    expect(ra.getTotalAllocated('n1', 'mem')).toBe(0);
  });
});

// ============================================================================
// Distributed Conflict Resolver
// ============================================================================
describe('DistributedConflictResolver', () => {
  let cr: DistributedConflictResolver;
  beforeEach(() => {
    cr = new DistributedConflictResolver();
  });

  it('detects conflicts', () => {
    expect(cr.detect('k1', 'n1', 'a', 'n2', 'b')).toBe(true);
    expect(cr.detect('k1', 'n1', 'a', 'n2', 'a')).toBe(false);
  });

  it('resolves conflicts', () => {
    const entry = cr.resolve('k1', 'n1', 'a', 'n2', 'b', 'NODE_A_WINS');
    expect(entry.resolution).toBe('NODE_A_WINS');
    expect(entry.checksum).toBeDefined();
  });

  it('gets all conflicts', () => {
    cr.resolve('k1', 'n1', 'a', 'n2', 'b', 'MERGED');
    expect(cr.getConflicts()).toHaveLength(1);
  });

  it('gets conflicts by node', () => {
    cr.resolve('k1', 'n1', 'a', 'n2', 'b', 'NODE_A_WINS');
    cr.resolve('k2', 'n3', 'c', 'n4', 'd', 'NODE_B_WINS');
    expect(cr.getConflictsByNode('n1')).toHaveLength(1);
    expect(cr.getConflictsByNode('n5')).toHaveLength(0);
  });
});

// ============================================================================
// Integration Test - Full Distributed Pipeline
// ============================================================================
describe('Distributed Cognition Integration', () => {
  it('full pipeline: register nodes, create cluster, schedule, checkpoint, recover', () => {
    const registry = new NodeRegistry();
    const scheduler = new DistributedScheduler();
    const dispatcher = new DistributedTaskDispatcher(scheduler);
    const checkpointMgr = new DistributedCheckpointManager();
    const recoveryMgr = new DistributedRecoveryManager(checkpointMgr);
    const auditMgr = new DistributedAuditManager();

    registry.register(makeNodeMeta('n1'));
    registry.register(makeNodeMeta('n2'));

    const coordinator = new DistributedWorkflowCoordinator(scheduler, dispatcher, registry);
    const plan = coordinator.plan('goal-1', 3);
    expect(plan.taskCount).toBe(3);

    const tasks = coordinator.scheduleTasks('goal-1', 3);
    coordinator.assignTasks(
      tasks.map((t) => t.taskId),
      'n1',
    );

    checkpointMgr.save('n1', 'session-1', { progress: 50 }, 1);
    const checkpoint = checkpointMgr.load('session-1');
    expect(checkpoint).toBeDefined();
    expect(checkpointMgr.validate(checkpoint!)).toBe(true);

    auditMgr.log('trace-1', 'n1', 'session-1', 'task.assigned', { tasks: 3 });
    expect(auditMgr.verifyIntegrity('session-1')).toBe(true);

    const plan2 = recoveryMgr.planRecovery('session-1', 'n2');
    const state = recoveryMgr.executeRecovery('session-1');
    expect(state).toEqual({ progress: 50 });
  });
});

// ============================================================================
// Branch Coverage Edge Cases
// ============================================================================
describe('Branch Coverage Edge Cases', () => {
  it('DistributedResourceAllocator: release non-existent allocation for existing node', () => {
    const registry = new NodeRegistry();
    registry.register(makeNodeMeta('n1'));
    const ra = new DistributedResourceAllocator(registry);
    expect(ra.release('missing', 'n1')).toBe(false);
  });

  it('ClusterMembershipManager: memberships undefined for cluster', () => {
    const cmm = new ClusterMembershipManager();
    cmm.createCluster({
      clusterId: 'c1',
      name: 'T',
      minNodes: 1,
      maxNodes: 5,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    });
    cmm.leaveCluster('c1', 'nonexistent');
    expect(cmm.getMembers('c1')).toHaveLength(0);
  });

  it('DistributedConsensusEngine: getProposal returns value', () => {
    const engine = new DistributedConsensusEngine();
    const proposal = engine.propose('n1', { data: 1 });
    expect(engine.getProposal(proposal.proposalId)).toBeDefined();
  });

  it('DistributedConsensusEngine: getVotes returns value', () => {
    const engine = new DistributedConsensusEngine();
    const proposal = engine.propose('n1', {});
    engine.castVote(proposal.proposalId, 'n1', true, 'r');
    expect(engine.getVotes(proposal.proposalId)).toHaveLength(1);
  });

  it('KnowledgeSynchronizationEngine: merge where remote is newer', () => {
    const sync = new KnowledgeSynchronizationEngine();
    const local = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    const remote = makeKnowledgeEntry('e1', 'k1', 3, 'n2');
    const merged = sync.merge(local, remote);
    expect(merged.version).toBe(3);
  });

  it('NodeDiscoveryEngine: getKnownNodes returns values', () => {
    const registry = new NodeRegistry();
    const discovery = new NodeDiscoveryEngine(registry);
    discovery.registerDiscovered(makeNodeMeta('n1'));
    expect(discovery.getKnownNodes()).toHaveLength(1);
  });

  it('NodeHealthMonitor: truncates history exceeding maxHistory', () => {
    const monitor = new NodeHealthMonitor();
    for (let i = 0; i < 105; i++) {
      monitor.recordHealth({
        nodeId: 'n1',
        cpuUsage: 0.5,
        memoryUsage: 0.5,
        latencyMs: 10,
        errorRate: 0,
        lastCheck: new Date(),
        status: 'HEALTHY',
      });
    }
    expect(monitor.getHealthHistory('n1')).toHaveLength(100);
  });

  it('DistributedScheduler: getAll returns tasks', () => {
    const scheduler = new DistributedScheduler();
    scheduler.enqueue('g1', 1);
    scheduler.enqueue('g2', 2);
    expect(scheduler.getAll()).toHaveLength(2);
  });

  it('DistributedCheckpointManager: list for missing session', () => {
    const cm = new DistributedCheckpointManager();
    expect(cm.list('missing')).toEqual([]);
  });

  it('DistributedReplayEngine: replay for missing session', () => {
    const replay = new DistributedReplayEngine();
    expect(replay.replay('missing')).toEqual([]);
  });

  it('DistributedReplayEngine: validate returns true for valid entries', () => {
    const replay = new DistributedReplayEngine();
    replay.record('s1', 'n1', 'a1', { data: 1 });
    expect(replay.validate('s1')).toBe(true);
  });

  it('DistributedConsensusEngine: rejects on quorum with majority disapproval', () => {
    const engine = new DistributedConsensusEngine();
    const p = engine.propose('n1', {});
    engine.castVote(p.proposalId, 'n1', true, 'r1');
    engine.castVote(p.proposalId, 'n2', false, 'r2');
    engine.castVote(p.proposalId, 'n3', false, 'r3');
    const result = engine.resolve(p.proposalId, 3);
    expect(result.accepted).toBe(false);
  });

  it('ClusterMembershipManager: joinCluster with no existing members array', () => {
    const cmm = new ClusterMembershipManager();
    cmm.createCluster({
      clusterId: 'c1',
      name: 'T',
      minNodes: 1,
      maxNodes: 5,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    });
    const membership = cmm.joinCluster('c1', 'n1');
    expect(membership.status).toBe('ACTIVE');
  });

  it('DistributedResourceAllocator: release with non-existent ID on node with allocations', () => {
    const registry = new NodeRegistry();
    registry.register(makeNodeMeta('n1'));
    const ra = new DistributedResourceAllocator(registry);
    ra.allocate('n1', 'cpu', 4);
    expect(ra.release('nonexistent-id', 'n1')).toBe(false);
  });

  it('NodeHealthMonitor: evaluateStatus with healthy low values', () => {
    const monitor = new NodeHealthMonitor();
    monitor.recordHealth({
      nodeId: 'n1',
      cpuUsage: 0.3,
      memoryUsage: 0.3,
      latencyMs: 5,
      errorRate: 0,
      lastCheck: new Date(),
      status: 'HEALTHY',
    });
    expect(monitor.evaluateStatus('n1')).toBe('HEALTHY');
  });

  it('KnowledgeSynchronizationEngine: detectConflict with same version and checksum', () => {
    const sync = new KnowledgeSynchronizationEngine();
    const entry = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    expect(sync.detectConflict(entry, entry)).toBe(false);
  });

  it('DistributedCheckpointManager: validate with checksum mismatch', () => {
    const cm = new DistributedCheckpointManager();
    const cp = cm.save('n1', 's1', { data: 1 }, 1);
    const tampered = { ...cp, checksum: 'wrong' };
    expect(cm.validate(tampered)).toBe(false);
  });

  it('DistributedReplayEngine: validate returns true for empty session', () => {
    const replay = new DistributedReplayEngine();
    expect(replay.validate('missing')).toBe(true);
  });

  it('NodeHealthMonitor: getHealthHistory for missing node returns empty', () => {
    const monitor = new NodeHealthMonitor();
    expect(monitor.getHealthHistory('missing')).toEqual([]);
  });

  it('DistributedResourceAllocator: getTotalAllocated for node with no allocations', () => {
    const registry = new NodeRegistry();
    registry.register(makeNodeMeta('n1'));
    const ra = new DistributedResourceAllocator(registry);
    expect(ra.getTotalAllocated('n1', 'cpu')).toBe(0);
  });

  it('ClusterMembershipManager: joinCluster triggers memberships.get || [] branch', () => {
    const cmm = new ClusterMembershipManager();
    cmm.createCluster({
      clusterId: 'c1',
      name: 'T',
      minNodes: 1,
      maxNodes: 5,
      heartbeatIntervalMs: 1000,
      failureThreshold: 3,
    });
    cmm.joinCluster('c1', 'n1');
    cmm.leaveCluster('c1', 'n1');
    expect(cmm.getMembers('c1')).toHaveLength(0);
  });

  it('ClusterMembershipManager: leaveCluster for nonexistent cluster', () => {
    const cmm = new ClusterMembershipManager();
    cmm.leaveCluster('nonexistent', 'n1');
  });

  it('DistributedConsensusEngine: castVote with no existing votes array', () => {
    const engine = new DistributedConsensusEngine();
    const p = engine.propose('n1', {});
    engine.castVote(p.proposalId, 'n1', true, 'r');
    expect(engine.getVotes(p.proposalId)).toHaveLength(1);
  });

  it('DistributedConsensusEngine: getVotes for proposal with no votes', () => {
    const engine = new DistributedConsensusEngine();
    const p = engine.propose('n1', {});
    expect(engine.getVotes(p.proposalId)).toHaveLength(0);
  });

  it('DistributedConsensusEngine: resolve rejects with majority false', () => {
    const engine = new DistributedConsensusEngine();
    const p = engine.propose('n1', {});
    engine.castVote(p.proposalId, 'n1', false, 'r1');
    engine.castVote(p.proposalId, 'n2', false, 'r2');
    const result = engine.resolve(p.proposalId, 2);
    expect(result.accepted).toBe(false);
  });

  it('KnowledgeSynchronizationEngine: merge when remote is strictly newer', () => {
    const sync = new KnowledgeSynchronizationEngine();
    const local = makeKnowledgeEntry('e1', 'k1', 1, 'n1');
    const remote = makeKnowledgeEntry('e1', 'k1', 5, 'n2');
    const merged = sync.merge(local, remote);
    expect(merged.version).toBe(5);
  });

  it('KnowledgeSynchronizationEngine: merge when local is newer', () => {
    const sync = new KnowledgeSynchronizationEngine();
    const local = makeKnowledgeEntry('e1', 'k1', 5, 'n1');
    const remote = makeKnowledgeEntry('e1', 'k1', 1, 'n2');
    const merged = sync.merge(local, remote);
    expect(merged.version).toBe(5);
  });
});

// ============================================================================
// Invariant Violation Tests
// ============================================================================
describe('Invariant Violation Errors', () => {
  it('ClusterMembershipManager: getMembersInvariant throws on uninitialized memberships', () => {
    const cmm = new ClusterMembershipManager();
    expect(() => cmm.getMembers('nonexistent')).toThrow('Invariant violated');
  });

  it('DistributedConsensusEngine: getVotesInvariant throws on uninitialized votes', () => {
    const engine = new DistributedConsensusEngine();
    expect(() => engine.getVotes('nonexistent')).toThrow('Invariant violated');
  });

  it('ReliableMessageQueue: requeue returns false for nonexistent message', () => {
    const queue = new ReliableMessageQueue();
    expect(queue.requeue('nonexistent')).toBe(false);
  });

  it('InvariantViolationError has correct properties', async () => {
    const mod = await import('../src/domain/shared/errors.js');
    const err = new mod.InvariantViolationError('test', 'TEST_CODE', 'TestSource');
    expect(err.message).toBe('test');
    expect(err.code).toBe('TEST_CODE');
    expect(err.source).toBe('TestSource');
    expect(err.name).toBe('InvariantViolationError');
    expect(err).toBeInstanceOf(Error);
  });
});
