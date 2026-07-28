/**
 * @module runtime/m41.test
 * @description Tests for M4.1 Production Runtime Integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  InMemoryAuditStore,
  IAuditStore,
  AuditRecord,
  MemoryCheckpointStore,
  ICheckpointStore,
  Checkpoint,
  ExecutionPipeline,
  PipelineResult,
  ObservabilityManager,
  ObservabilityMetrics,
  RuntimeRecovery,
  RecoveryAction,
  RecoveryPolicy,
  RuntimeHealthService,
  RuntimeHealthReport,
  RuntimeSupervisorV2,
  RuntimeDI,
  RuntimeBootstrap,
  RuntimeIntegration,
  RuntimeConfig,
  PostgresAuditStore,
  createContext,
  extendContext,
  defaultHealthCheck,
} from '../src/index.js';
import { InMemoryEventBus } from '@agentx-fast/core-runtime';

// ============================================================
// TESTS: Audit Store
// ============================================================

describe('AuditStore', () => {
  let store: InMemoryAuditStore;

  beforeEach(() => {
    store = new InMemoryAuditStore();
  });

  it('records and retrieves audit entries', async () => {
    const record: AuditRecord = {
      id: 'audit-1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    };
    await store.record(record);
    const all = await store.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('audit-1');
  });

  it('filters by trace ID', async () => {
    await store.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await store.record({
      id: 'a2',
      traceId: 't2',
      correlationId: 'c2',
      sessionId: 's2',
      workflowId: 'w2',
      timestamp: new Date(),
      durationMs: 200,
      result: 'failure',
      metadata: {},
    });
    const t1 = await store.getByTraceId('t1');
    expect(t1).toHaveLength(1);
    expect(t1[0].id).toBe('a1');
  });

  it('filters by session ID', async () => {
    await store.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await store.record({
      id: 'a2',
      traceId: 't2',
      correlationId: 'c2',
      sessionId: 's2',
      workflowId: 'w2',
      timestamp: new Date(),
      durationMs: 200,
      result: 'failure',
      metadata: {},
    });
    const s1 = await store.getBySessionId('s1');
    expect(s1).toHaveLength(1);
  });

  it('filters by workflow ID', async () => {
    await store.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await store.record({
      id: 'a2',
      traceId: 't2',
      correlationId: 'c2',
      sessionId: 's2',
      workflowId: 'w2',
      timestamp: new Date(),
      durationMs: 200,
      result: 'failure',
      metadata: {},
    });
    const w1 = await store.getByWorkflowId('w1');
    expect(w1).toHaveLength(1);
  });

  it('deletes audit records', async () => {
    await store.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await store.delete('a1');
    const all = await store.getAll();
    expect(all).toHaveLength(0);
  });
});

// ============================================================
// TESTS: Checkpoint Store
// ============================================================

describe('CheckpointStore', () => {
  let store: MemoryCheckpointStore;

  beforeEach(() => {
    store = new MemoryCheckpointStore();
  });

  it('saves and loads checkpoints', async () => {
    const checkpoint: Checkpoint = {
      id: 'cp-1',
      workflowId: 'w1',
      snapshot: { data: 'test' },
      createdAt: new Date(),
      version: 1,
      checksum: 'abc',
      metadata: {},
    };
    await store.save(checkpoint);
    const loaded = await store.load('w1');
    expect(loaded?.id).toBe('cp-1');
  });

  it('lists checkpoints', async () => {
    await store.save({
      id: 'cp-1',
      workflowId: 'w1',
      snapshot: {},
      createdAt: new Date(),
      version: 1,
      checksum: 'a',
      metadata: {},
    });
    await store.save({
      id: 'cp-2',
      workflowId: 'w1',
      snapshot: {},
      createdAt: new Date(),
      version: 2,
      checksum: 'b',
      metadata: {},
    });
    const list = await store.list('w1');
    expect(list).toHaveLength(2);
  });

  it('returns undefined for missing workflow', async () => {
    const loaded = await store.load('missing');
    expect(loaded).toBeUndefined();
  });

  it('deletes checkpoints', async () => {
    await store.save({
      id: 'cp-1',
      workflowId: 'w1',
      snapshot: {},
      createdAt: new Date(),
      version: 1,
      checksum: 'a',
      metadata: {},
    });
    await store.delete('cp-1');
    const loaded = await store.load('w1');
    expect(loaded).toBeUndefined();
  });
});

// ============================================================
// TESTS: Execution Pipeline
// ============================================================

describe('ExecutionPipeline', () => {
  let auditStore: InMemoryAuditStore;
  let pipeline: ExecutionPipeline;
  const config: RuntimeConfig = {
    tokenBudget: 500000,
    costBudget: 100,
    maxParallelAgents: 10,
    maxWorkflows: 50,
    maxTools: 100,
    maxMemory: 1024 * 1024 * 100,
    maxContextTokens: 100000,
    defaultTimeoutMs: 60000,
    checkpointIntervalMs: 30000,
  };

  beforeEach(() => {
    auditStore = new InMemoryAuditStore();
    pipeline = new ExecutionPipeline(auditStore, config);
  });

  it('executes goal successfully and records audit', async () => {
    const result = await pipeline.execute({
      id: 'session-1',
      traceId: 'trace-1',
      goal: 'build feature',
    });
    expect(result.success).toBe(true);
    expect(result.metrics.executionTimeMs).toBeGreaterThanOrEqual(0);
    expect(result.audit.result).toBe('success');

    const records = await auditStore.getAll();
    expect(records).toHaveLength(1);
  });

  it('handles failures and records audit', async () => {
    const result = await pipeline.execute({ id: 's1', traceId: 't1', goal: 'fail' });
    expect(result.success).toBe(false);
    expect(result.audit.result).toBe('failure');
  });
});

// ============================================================
// TESTS: PostgresAuditStore (Mock)
// ============================================================

describe('PostgresAuditStore', () => {
  let store: PostgresAuditStore;

  beforeEach(() => {
    store = new PostgresAuditStore('postgres://localhost/test');
  });

  it('records and retrieves audit entries', async () => {
    const record: AuditRecord = {
      id: 'audit-1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    };
    await store.record(record);
    const all = await store.getAll();
    expect(all).toHaveLength(1);
  });

  it('filters by trace ID', async () => {
    await store.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await store.record({
      id: 'a2',
      traceId: 't2',
      correlationId: 'c2',
      sessionId: 's2',
      workflowId: 'w2',
      timestamp: new Date(),
      durationMs: 200,
      result: 'failure',
      metadata: {},
    });
    const t1 = await store.getByTraceId('t1');
    expect(t1).toHaveLength(1);
  });

  it('filters by session ID', async () => {
    await store.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await store.record({
      id: 'a2',
      traceId: 't2',
      correlationId: 'c2',
      sessionId: 's2',
      workflowId: 'w2',
      timestamp: new Date(),
      durationMs: 200,
      result: 'failure',
      metadata: {},
    });
    const s1 = await store.getBySessionId('s1');
    expect(s1).toHaveLength(1);
  });

  it('filters by workflow ID', async () => {
    await store.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await store.record({
      id: 'a2',
      traceId: 't2',
      correlationId: 'c2',
      sessionId: 's2',
      workflowId: 'w2',
      timestamp: new Date(),
      durationMs: 200,
      result: 'failure',
      metadata: {},
    });
    const w1 = await store.getByWorkflowId('w1');
    expect(w1).toHaveLength(1);
  });

  it('deletes audit records', async () => {
    await store.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await store.delete('a1');
    const all = await store.getAll();
    expect(all).toHaveLength(0);
  });
});

// ============================================================
// TESTS: Runtime Context
// ============================================================

describe('Runtime Context', () => {
  it('creates and extends context', () => {
    const ctx = createContext('t1', 's1');
    expect(ctx.traceId).toBe('t1');
    const ext = extendContext(ctx, { metadata: { a: 1 } });
    expect(ext.metadata.a).toBe(1);
  });
});

// ============================================================
// TESTS: Health Checker Legacy
// ============================================================

describe('HealthChecker Legacy', () => {
  it('creates default health check', () => {
    const status = defaultHealthCheck('test');
    expect(status.component).toBe('test');
    expect(status.healthy).toBe(true);
  });
});

// ============================================================
// TESTS: Observability Manager
// ============================================================

describe('ObservabilityManager', () => {
  let auditStore: InMemoryAuditStore;
  let manager: ObservabilityManager;

  beforeEach(() => {
    auditStore = new InMemoryAuditStore();
    manager = new ObservabilityManager(auditStore);
  });

  it('returns default metrics', async () => {
    const metrics = await manager.getAggregatedMetrics();
    expect(metrics.runtime.sessionCount).toBe(0);
    expect(metrics.workflow.totalWorkflows).toBe(0);
  });

  it('updates metrics', async () => {
    manager.updateRuntimeMetrics(100, 5, 3);
    manager.updateWorkflowMetrics(10, 8, 2);
    manager.updateToolMetrics(50, 45, 5, 200);
    manager.updateAgentMetrics(20, 10, 150);
    manager.updateApprovalMetrics(30, 25, 3, 2, 500);
    manager.updateHealthMetrics(true, 10, 0);

    const metrics = await manager.getAggregatedMetrics();
    expect(metrics.runtime.executionTimeMs).toBe(100);
    expect(metrics.runtime.sessionCount).toBe(5);
    expect(metrics.workflow.totalWorkflows).toBe(10);
    expect(metrics.tool.totalCalls).toBe(50);
    expect(metrics.health.overallHealthy).toBe(true);
  });

  it('aggregates metrics from audit store', async () => {
    await auditStore.record({
      id: 'a1',
      traceId: 't1',
      correlationId: 'c1',
      sessionId: 's1',
      workflowId: 'w1',
      timestamp: new Date(),
      durationMs: 100,
      result: 'success',
      metadata: {},
    });
    await auditStore.record({
      id: 'a2',
      traceId: 't2',
      correlationId: 'c2',
      sessionId: 's2',
      workflowId: 'w2',
      timestamp: new Date(),
      durationMs: 200,
      result: 'failure',
      metadata: {},
    });

    const metrics = await manager.getAggregatedMetrics();
    expect(metrics.runtime.sessionCount).toBe(2);
    expect(metrics.runtime.activeSessions).toBe(1);
  });
});

// ============================================================
// TESTS: Recovery
// ============================================================

describe('RuntimeRecovery', () => {
  let recovery: RuntimeRecovery;

  beforeEach(() => {
    recovery = new RuntimeRecovery();
  });

  it('handles agent crash recovery', async () => {
    const action = await recovery.handleAgentCrash('agent-1');
    expect(action.type).toBe('restart_agent');
    expect(action.targetId).toBe('agent-1');
    expect(action.reason).toBe('Agent crash detected');
  });

  it('handles tool timeout recovery', async () => {
    const action = await recovery.handleToolTimeout('tool-1');
    expect(action.type).toBe('retry_workflow');
    expect(action.targetId).toBe('tool-1');
  });

  it('handles workflow retry', async () => {
    const action = await recovery.handleWorkflowRetry('wf-1');
    expect(action.type).toBe('retry_workflow');
    expect(action.targetId).toBe('wf-1');
  });

  it('handles heartbeat loss', async () => {
    const action = await recovery.handleHeartbeatLoss('agent-2');
    expect(action.type).toBe('restart_agent');
    expect(action.targetId).toBe('agent-2');
  });

  it('handles approval timeout', async () => {
    const action = await recovery.handleApprovalTimeout('approval-1');
    expect(action.type).toBe('pause_runtime');
  });

  it('handles checkpoint recovery', async () => {
    const action = await recovery.handleCheckpointRecovery('wf-1');
    expect(action.type).toBe('restore_checkpoint');
  });

  it('tracks recovery history', async () => {
    await recovery.handleAgentCrash('a1');
    await recovery.handleToolTimeout('t1');
    const history = recovery.getRecoveryHistory();
    expect(history).toHaveLength(2);
  });

  it('returns policy', () => {
    const policy = recovery.getPolicy();
    expect(policy.maxRetries).toBe(3);
    expect(policy.retryDelayMs).toBe(5000);
  });
});

// ============================================================
// TESTS: Health Service
// ============================================================

describe('RuntimeHealthService', () => {
  let service: RuntimeHealthService;

  beforeEach(() => {
    service = new RuntimeHealthService();
  });

  it('checks registered components', async () => {
    service.registerCheck('test', async () => ({
      component: 'test',
      healthy: true,
      latencyMs: 10,
      lastChecked: new Date(),
    }));
    const result = await service.checkComponent('test');
    expect(result.healthy).toBe(true);
    expect(result.component).toBe('test');
  });

  it('returns unhealthy for unregistered component', async () => {
    const result = await service.checkComponent('missing');
    expect(result.healthy).toBe(false);
    expect(result.error).toBe('Component not registered');
  });

  it('checks all components', async () => {
    service.registerCheck('a', async () => ({
      component: 'a',
      healthy: true,
      latencyMs: 0,
      lastChecked: new Date(),
    }));
    service.registerCheck('b', async () => ({
      component: 'b',
      healthy: false,
      latencyMs: 0,
      lastChecked: new Date(),
    }));
    const report = await service.checkAll();
    expect(report.components).toHaveLength(2);
    expect(report.overall).toBe(false);
  });

  it('returns last results', async () => {
    service.registerCheck('test', async () => ({
      component: 'test',
      healthy: true,
      latencyMs: 0,
      lastChecked: new Date(),
    }));
    await service.checkComponent('test');
    const lastResults = service.getLastResults();
    expect(lastResults.has('test')).toBe(true);
  });
});

// ============================================================
// TESTS: Supervisor V2
// ============================================================

describe('RuntimeSupervisorV2', () => {
  let supervisor: RuntimeSupervisorV2;

  beforeEach(() => {
    supervisor = new RuntimeSupervisorV2();
  });

  it('starts and stops', async () => {
    await supervisor.start();
    expect(supervisor.isHealthy()).toBe(true);
    await supervisor.stop();
    expect(supervisor.isHealthy()).toBe(false);
  });

  it('pauses and resumes', async () => {
    await supervisor.start();
    supervisor.pause();
    expect(supervisor.isHealthy()).toBe(false);
    supervisor.resume();
    expect(supervisor.isHealthy()).toBe(true);
  });

  it('gets health report', async () => {
    await supervisor.start();
    const report = await supervisor.getHealthReport();
    expect(report.overall).toBe(true);
  });

  it('handles recovery actions', async () => {
    const action1 = await supervisor.handleAgentCrash('a1');
    expect(action1.type).toBe('restart_agent');

    const action2 = await supervisor.handleToolTimeout('t1');
    expect(action2.type).toBe('retry_workflow');

    const history = supervisor.getRecoveryHistory();
    expect(history).toHaveLength(2);
  });
});

// ============================================================
// TESTS: Dependency Injection
// ============================================================

describe('RuntimeDI', () => {
  let di: RuntimeDI;

  beforeEach(() => {
    di = new RuntimeDI();
  });

  it('registers and resolves services', () => {
    di.register('service', { name: 'test' });
    const result = di.resolve<{ name: string }>('service');
    expect(result.name).toBe('test');
  });

  it('registers and resolves factories', () => {
    di.registerFactory('service', () => ({ name: 'factory' }));
    const result = di.resolve<{ name: string }>('service');
    expect(result.name).toBe('factory');
  });

  it('throws for unregistered services', () => {
    expect(() => di.resolve('missing')).toThrow();
  });

  it('checks service existence', () => {
    di.register('service', { name: 'test' });
    expect(di.has('service')).toBe(true);
    expect(di.has('missing')).toBe(false);
  });

  it('removes services', () => {
    di.register('service', { name: 'test' });
    di.remove('service');
    expect(di.has('service')).toBe(false);
  });

  it('clears all services', () => {
    di.register('a', 1);
    di.register('b', 2);
    di.clear();
    expect(di.has('a')).toBe(false);
    expect(di.has('b')).toBe(false);
  });
});

// ============================================================
// TESTS: Bootstrap V2
// ============================================================

describe('RuntimeBootstrap V2', () => {
  it('bootstraps with default config', async () => {
    const bootstrap = new RuntimeBootstrap();
    const di = await bootstrap.bootstrap();
    expect(di.has('config')).toBe(true);
    expect(di.has('auditStore')).toBe(true);
    expect(di.has('checkpointStore')).toBe(true);
    expect(di.has('pipeline')).toBe(true);
    expect(di.has('supervisor')).toBe(true);
    expect(di.has('healthService')).toBe(true);
    expect(di.has('observability')).toBe(true);
    expect(di.has('recovery')).toBe(true);
  });

  it('bootstraps with custom config', async () => {
    const bootstrap = new RuntimeBootstrap();
    const di = await bootstrap.bootstrap({ config: { tokenBudget: 1000 } as any });
    expect(di.has('config')).toBe(true);
  });

  it('handles bootstrap failures', async () => {
    const bootstrap = new RuntimeBootstrap();
    const di = await bootstrap.bootstrap({
      auditStore: {} as any,
      checkpointStore: {} as any,
    } as any);
    expect(di.has('auditStore')).toBe(true);
    expect(bootstrap.getDI()).toBeDefined();
  });
});

// ============================================================
// TESTS: Runtime Integration
// ============================================================

describe('RuntimeIntegration', () => {
  let integration: RuntimeIntegration;

  beforeEach(() => {
    integration = new RuntimeIntegration({
      config: {
        tokenBudget: 500000,
        costBudget: 100,
        maxParallelAgents: 10,
        maxWorkflows: 50,
        maxTools: 100,
        maxMemory: 1024 * 1024 * 100,
        maxContextTokens: 100000,
        defaultTimeoutMs: 60000,
        checkpointIntervalMs: 30000,
      },
      auditStore: new InMemoryAuditStore(),
    });
  });

  it('executes goals', async () => {
    const result = await integration.executeGoal('s1', 'build feature');
    expect(result.success).toBe(true);
    expect(result.audit.result).toBe('success');
  });

  it('gets health report', async () => {
    const report = await integration.getHealthReport();
    expect(report.overall).toBe(true);
  });

  it('gets metrics', async () => {
    const metrics = await integration.getMetrics();
    expect(metrics).toBeDefined();
  });

  it('gets recovery history', () => {
    const history = integration.getRecoveryHistory();
    expect(Array.isArray(history)).toBe(true);
  });

  it('gets DI container', () => {
    const di = integration.getDI();
    expect(di).toBeDefined();
  });
});
