import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  SubAgentFactory,
  AgentPool,
  ParallelRunner,
  MessageBus,
  ResourceManager,
  HeartbeatMonitor,
  MergeEngine,
  ConsensusEngine,
  MultiAgentOrchestrator,
  TaskSplitter,
  DependencyAnalyzer,
  ConflictResolver,
  createApprovalSession,
} from '../../src/sub-agents/index.js';
import {
  ResourceLimitExceededError,
  AgentHeartbeatLostError,
  DependencyGraphError,
  MergeConflictError,
  AgentTimeoutError,
  AgentFailureError,
} from '../../src/sub-agents/errors.js';
import { InMemoryEventBus } from '@agentx-fast/core-runtime';

// ============================================================
// DEFAULT CONFIGS & MOCKS
// ============================================================

const DEFAULT_BUDGET = {
  estimatedCpuTimeMs: 10000,
  estimatedMemoryBytes: 1024 * 1024 * 10,
  tokenBudget: 10000,
  costCeilingUsd: 1.0,
  maxConcurrentProviders: 2,
  maxConcurrentTools: 2,
};

describe('Errors', () => {
  it('instantiates all custom errors correctly', () => {
    expect(new ResourceLimitExceededError('limit')).toBeInstanceOf(Error);
    expect(new AgentHeartbeatLostError('agent-1')).toBeInstanceOf(Error);
    expect(new DependencyGraphError('cycle')).toBeInstanceOf(Error);
    expect(new MergeConflictError('conflict')).toBeInstanceOf(Error);
    expect(new AgentTimeoutError('agent-1')).toBeInstanceOf(Error);
    expect(new AgentFailureError('agent-1', 'reason')).toBeInstanceOf(Error);
  });
});

describe('SubAgentFactory', () => {
  it('creates agents for all roles', () => {
    const factory = new SubAgentFactory();
    expect(factory.createAgent('planner').role).toBe('planner');
    expect(factory.createAgent('architect').role).toBe('architect');
    expect(factory.createAgent('coder').role).toBe('coder');
    expect(factory.createAgent('reviewer').role).toBe('reviewer');
    expect(factory.createAgent('tester').role).toBe('tester');
    expect(factory.createAgent('security').role).toBe('security');
    expect(factory.createAgent('documentation').role).toBe('documentation');
    expect(factory.createAgent('qa').role).toBe('qa');
    expect(() => factory.createAgent('invalid' as any)).toThrow();
  });
});

describe('AgentPool', () => {
  let pool: AgentPool;

  beforeEach(() => {
    const factory = new SubAgentFactory();
    pool = new AgentPool(
      {
        minAgents: 1,
        maxAgents: 3,
        idleTimeoutMs: 5000,
        reuseIdleAgents: true,
        spawnStrategy: 'lazy',
      },
      factory,
    );
  });

  it('acquires and releases agents', () => {
    const agent = pool.acquire('coder');
    expect(agent.role).toBe('coder');
    expect(pool.getTotalAgentsCount()).toBe(1);

    pool.release(agent.id);
    // Releasing puts it back to idle since reuseIdleAgents is true
    expect(pool.getTotalAgentsCount()).toBe(1);

    // Acquiring again should reuse the idle agent
    const agent2 = pool.acquire('coder');
    expect(agent2.id).toBe(agent.id);
  });

  it('prewarms agents', () => {
    pool.prewarm('coder', 2);
    expect(pool.getTotalAgentsCount()).toBe(2);
  });

  it('enforces max agents limit', () => {
    pool.acquire('coder');
    pool.acquire('coder');
    pool.acquire('coder');
    expect(() => pool.acquire('coder')).toThrow('Max agents limit');
  });
});

describe('ParallelRunner', () => {
  it('runs sub-agents in parallel and publishes messages', async () => {
    const factory = new SubAgentFactory();
    const pool = new AgentPool(
      {
        minAgents: 1,
        maxAgents: 10,
        idleTimeoutMs: 1000,
        reuseIdleAgents: true,
        spawnStrategy: 'lazy',
      },
      factory,
    );
    const eventBus = new InMemoryEventBus();
    const bus = new MessageBus(eventBus);
    const runner = new ParallelRunner(pool, bus);

    const task = {
      id: 'task-1',
      goal: 'test',
      status: 'QUEUED' as any,
      priority: 1 as any,
      rootTaskId: 'task-1',
      dependsOn: [],
      traceId: 'tr-1',
      metadata: { retryCount: 0 },
      context: { variables: {}, history: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const handler = vi.fn();
    bus.subscribe('TaskAssigned', handler);
    bus.subscribe('TaskCompleted', handler);

    const result = await runner.runParallel(task, ['coder', 'reviewer'], {});
    expect(result.taskId).toBe('task-1');
    expect(Object.keys(result.results)).toHaveLength(2);
    expect(handler).toHaveBeenCalledTimes(4); // 2 assigned + 2 completed
  });
});

describe('ResourceManager', () => {
  it('registers agents and records usage', () => {
    const manager = new ResourceManager(DEFAULT_BUDGET);
    manager.registerAgent('agent-1', {
      estimatedCpuTimeMs: 100,
      estimatedMemoryBytes: 1024,
      tokenBudget: 50,
      costCeilingUsd: 0.1,
      maxConcurrentProviders: 1,
      maxConcurrentTools: 1,
    });

    expect(manager.getBusyAgentsCount()).toBe(1);
    expect(manager.getIdleAgentsCount(5)).toBe(4);

    manager.recordUsage({ costUsd: 0.2 });
    manager.unregisterAgent('agent-1');
    expect(manager.getBusyAgentsCount()).toBe(0);
  });

  it('rejects allocation when budget exceeded', () => {
    const manager = new ResourceManager({ ...DEFAULT_BUDGET, costCeilingUsd: 0.5 });
    manager.recordUsage({ costUsd: 0.4 });
    expect(() =>
      manager.registerAgent('agent-2', {
        estimatedCpuTimeMs: 100,
        estimatedMemoryBytes: 1024,
        tokenBudget: 50,
        costCeilingUsd: 0.2, // 0.4 + 0.2 > 0.5
        maxConcurrentProviders: 1,
        maxConcurrentTools: 1,
      }),
    ).toThrow(ResourceLimitExceededError);
  });
});

describe('HeartbeatMonitor', () => {
  it('records and returns heartbeat status', () => {
    const monitor = new HeartbeatMonitor(10);
    const hb = {
      agentId: 'agent-1',
      taskId: 'task-1',
      currentState: 'RUNNING' as any,
      timestamp: new Date(),
      memoryEstimateBytes: 1024,
    };
    monitor.recordHeartbeat(hb);
    expect(monitor.getStatus('agent-1')).toEqual(hb);
    expect(monitor.getStatus('agent-2')).toBeUndefined();
  });

  it('detects lost heartbeats and emits event', async () => {
    const monitor = new HeartbeatMonitor(10);
    const lostHandler = vi.fn();
    monitor.on('heartbeat_lost', lostHandler);

    monitor.recordHeartbeat({
      agentId: 'agent-1',
      taskId: 'task-1',
      currentState: 'RUNNING' as any,
      timestamp: new Date(),
      memoryEstimateBytes: 1024,
    });

    monitor.startMonitoring(5);
    await new Promise((r) => setTimeout(r, 20));
    expect(lostHandler).toHaveBeenCalled();
    monitor.stopMonitoring();
  });
});

// ============================================================
// TESTS: DependencyAnalyzer
// ============================================================

describe('DependencyAnalyzer', () => {
  const analyzer = new DependencyAnalyzer();

  it('validates a correct graph', () => {
    const node1 = { task: { id: 't1', dependsOn: [] } } as any;
    const node2 = { task: { id: 't2', dependsOn: ['t1'] } } as any;
    expect(() => analyzer.validateGraph([node1, node2])).not.toThrow();
  });

  it('throws on cycles', () => {
    const node1 = { task: { id: 't1', dependsOn: ['t2'] } } as any;
    const node2 = { task: { id: 't2', dependsOn: ['t1'] } } as any;
    expect(() => analyzer.validateGraph([node1, node2])).toThrow(DependencyGraphError);
  });

  it('throws on missing dependencies', () => {
    const node = { task: { id: 't1', dependsOn: ['t2'] } } as any;
    expect(() => analyzer.validateGraph([node])).toThrow(DependencyGraphError);
  });
});

describe('MergeEngine & ConflictResolver', () => {
  const mergeEngine = new MergeEngine();
  const resolver = new ConflictResolver();

  it('merges distinct outputs successfully', () => {
    const outputs = [{ file1: 'content1' }, { file2: 'content2' }];
    const result = mergeEngine.merge(outputs);
    expect(result.file1).toBe('content1');
    expect(result.file2).toBe('content2');
  });

  it('throws MergeConflictError on overlapping conflicts', () => {
    const outputs = [{ file1: 'content1' }, { file1: 'content2' }];
    expect(() => mergeEngine.merge(outputs)).toThrow(MergeConflictError);
  });

  it('resolves conflicts based on overrides and coverage criteria', () => {
    expect(resolver.resolveConflict('key', 'val1', 'val2', { architectOverride: true })).toBe(
      'val1',
    );
    expect(
      resolver.resolveConflict('key', 'val1', 'val2', { coverageScore1: 90, coverageScore2: 80 }),
    ).toBe('val1');
    expect(
      resolver.resolveConflict('key', 'val1', 'val2', { coverageScore1: 70, coverageScore2: 80 }),
    ).toBe('val2');
    expect(resolver.resolveConflict('key', 'val1', 'val2', {})).toBe('val1');
  });
});

describe('ConsensusEngine', () => {
  it('computes consensus using majority vote', () => {
    const engine = new ConsensusEngine('majority');
    const votes = [
      { agentRole: 'coder', value: 'option-a' },
      { agentRole: 'coder', value: 'option-b' },
      { agentRole: 'qa', value: 'option-a' },
    ];
    expect(engine.computeConsensus(votes)).toBe('option-a');
  });

  it('computes consensus using weighted strategy', () => {
    const engine = new ConsensusEngine('weighted');
    const votes = [
      { agentRole: 'coder', value: 'option-a', weight: 1 },
      { agentRole: 'architect', value: 'option-b', weight: 5 },
    ];
    expect(engine.computeConsensus(votes)).toBe('option-b');
  });

  it('computes consensus using reviewerOverride strategy', () => {
    const engine = new ConsensusEngine('reviewerOverride');
    const votes = [
      { agentRole: 'coder', value: 'option-a' },
      { agentRole: 'reviewer', value: 'option-b' },
    ];
    expect(engine.computeConsensus(votes)).toBe('option-b');
  });

  it('returns empty string for empty votes', () => {
    const engine = new ConsensusEngine('majority');
    expect(engine.computeConsensus([])).toBe('');
  });
});

describe('MessageBus', () => {
  it('broadcasts to global event bus', async () => {
    const globalBus = new InMemoryEventBus();
    const spy = vi.spyOn(globalBus, 'publish');
    const bus = new MessageBus(globalBus);

    await bus.broadcastToGlobalBus({
      id: 'msg-1',
      topic: 'TaskAssigned',
      senderId: 'orchestrator',
      taskId: 'task-1',
      payload: {},
      timestamp: new Date(),
    });

    expect(spy).toHaveBeenCalled();
  });
});

describe('MultiAgentOrchestrator', () => {
  let eventBus: InMemoryEventBus;
  let orchestrator: MultiAgentOrchestrator;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
    orchestrator = new MultiAgentOrchestrator(eventBus);
  });

  afterEach(async () => {
    await orchestrator.shutdown('wf-id');
  });

  it('coordinates a complete multi-agent workflow', async () => {
    const wfId = await orchestrator.createWorkflow('build feature', DEFAULT_BUDGET);
    expect(wfId).toBeDefined();

    await orchestrator.decomposeTask(wfId);
    await orchestrator.allocateAgents(wfId);
    orchestrator.supervise(wfId);

    const result = await orchestrator.execute(wfId);
    expect(result).toBeDefined();

    const merged = await orchestrator.merge(wfId);
    expect(merged).toBeDefined();

    await orchestrator.recover(wfId, 'agent-1');

    await orchestrator.shutdown(wfId);
  });
});
