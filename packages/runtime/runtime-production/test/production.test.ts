/**
 * @module runtime-production/production.test
 * @description Comprehensive unit tests matching >98% coverage targets (M4.2).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  MemoryLockProvider,
  RedisLockProvider,
  PostgresAdvisoryLockProvider,
  IdempotencyManager,
  MemoryQueue,
  BullMQAdapter,
  NATSAdapter,
  TemporalAdapter,
  ExecutionLeaseManager,
  WorkerRegistry,
  ClusterMembership,
  BackpressureController,
  CircuitBreaker,
  GracefulShutdownManager,
  DeadLetterQueue,
  ExecutionDeduplicator,
  ProductionTelemetry,
  DistributedLockError,
  IdempotencyError,
  QueueError,
  LeaseError,
  WorkerRegistryError,
  ClusterError,
  BackpressureError,
  CircuitOpenError,
  ShutdownError,
  ProductionError,
} from '../src/index.js';

describe('Production Error Classes', () => {
  it('covers all error types and properties', () => {
    const errorTypes = [
      DistributedLockError,
      IdempotencyError,
      QueueError,
      LeaseError,
      WorkerRegistryError,
      ClusterError,
      BackpressureError,
      CircuitOpenError,
      ShutdownError,
    ];

    for (const Err of errorTypes) {
      const err = new Err('test msg', 'test src');
      expect(err.message).toBe('test msg');
      expect(err.source).toBe('test src');
      expect(err.code).toBeDefined();
    }

    const baseErr = new ProductionError('msg', 'CODE', 'src');
    expect(baseErr.message).toBe('msg');
    expect(baseErr.code).toBe('CODE');
    expect(baseErr.source).toBe('src');
  });
});

describe('MemoryLockProvider', () => {
  let provider: MemoryLockProvider;

  beforeEach(() => {
    provider = new MemoryLockProvider();
  });

  it('acquires and releases locks', async () => {
    const lock = await provider.acquire('resource-1', { ttlMs: 1000 });
    expect(lock.key).toBe('resource-1');
    await provider.release(lock.id);
  });

  it('fails to acquire lock when already held', async () => {
    await provider.acquire('resource-1', { ttlMs: 1000 });
    await expect(provider.acquire('resource-1', { ttlMs: 1000 })).rejects.toThrow(
      DistributedLockError,
    );
  });

  it('renews locks', async () => {
    const lock = await provider.acquire('resource-1', { ttlMs: 1000 });
    await provider.renew(lock.id, 2000);
    const renewed = (provider as any).locks.get('resource-1');
    expect(renewed.expiresAt.getTime()).toBeGreaterThan(Date.now() + 1000);
  });

  it('expires locks', async () => {
    await provider.acquire('resource-1', { ttlMs: 1000 });
    await provider.expire('resource-1');
    const lock = await provider.acquire('resource-1', { ttlMs: 1000 });
    expect(lock).toBeDefined();
  });

  it('throws when releasing or renewing non-existent lock', async () => {
    await expect(provider.release('non-existent')).rejects.toThrow(DistributedLockError);
    await expect(provider.renew('non-existent', 1000)).rejects.toThrow(DistributedLockError);
  });
});

describe('Lock Providers', () => {
  it('RedisLockProvider acquires and releases locks', async () => {
    const provider = new RedisLockProvider();
    const lock = await provider.acquire('key', { ttlMs: 5000 });
    expect(lock).toBeDefined();
    expect(lock.id).toBeDefined();
    await expect(provider.release(lock.id)).resolves.not.toThrow();
  });

  it('PostgresAdvisoryLockProvider acquires and releases locks', async () => {
    const provider = new PostgresAdvisoryLockProvider();
    const lock = await provider.acquire('key', { ttlMs: 5000 });
    expect(lock).toBeDefined();
    expect(lock.id).toBeDefined();
    await expect(provider.release(lock.id)).resolves.not.toThrow();
  });
});

describe('IdempotencyManager', () => {
  let manager: IdempotencyManager;

  beforeEach(() => {
    manager = new IdempotencyManager();
  });

  it('stores and checks idempotency keys', () => {
    const key = manager.generateKey('t1', 'w1', 'r1', 'h1');
    expect(manager.isExecuted(key)).toBe(false);
    manager.checkAndStore(key);
    expect(manager.isExecuted(key)).toBe(true);
    expect(() => manager.checkAndStore(key)).toThrow(IdempotencyError);
    manager.clear();
    expect(manager.isExecuted(key)).toBe(false);
  });
});

describe('MemoryQueue', () => {
  let queue: MemoryQueue;

  beforeEach(() => {
    queue = new MemoryQueue();
  });

  it('enqueues and dequeues messages by priority', async () => {
    await queue.enqueue({
      id: '1',
      traceId: 't',
      workflowId: 'w',
      payload: {},
      priority: 1,
      retryCount: 0,
      status: 'PENDING',
      createdAt: new Date(),
    });
    await queue.enqueue({
      id: '2',
      traceId: 't',
      workflowId: 'w',
      payload: {},
      priority: 10,
      retryCount: 0,
      status: 'PENDING',
      createdAt: new Date(),
    });

    const first = await queue.dequeue();
    expect(first?.id).toBe('2');

    await queue.ack('2');
    const second = await queue.dequeue();
    expect(second?.id).toBe('1');
  });

  it('handles retries and DLQ integration', async () => {
    await queue.enqueue({
      id: '1',
      traceId: 't',
      workflowId: 'w',
      payload: {},
      priority: 1,
      retryCount: 0,
      status: 'PENDING',
      createdAt: new Date(),
    });

    await queue.retry('1');
    await queue.retry('1');
    await queue.retry('1');
    await queue.retry('1'); // 4th time triggers DLQ

    expect(queue.getDlq()).toHaveLength(1);
    expect(queue.getDlq()[0].id).toBe('1');

    const result = await queue.dequeue();
    expect(result).toBeUndefined();
  });
});

describe('Queue Providers', () => {
  it('BullMQAdapter enqueues and dequeues tasks', async () => {
    const adapter = new BullMQAdapter();
    await adapter.enqueue({ taskId: 't1', payload: {} } as any);
    const task = await adapter.dequeue();
    expect(task).toBeDefined();
  });

  it('NATSAdapter enqueues and dequeues tasks', async () => {
    const adapter = new NATSAdapter();
    await adapter.enqueue({ taskId: 't1', payload: {} } as any);
    const task = await adapter.dequeue();
    expect(task).toBeDefined();
  });

  it('TemporalAdapter enqueues and dequeues tasks', async () => {
    const adapter = new TemporalAdapter();
    await adapter.enqueue({ taskId: 't1', payload: {} } as any);
    const task = await adapter.dequeue();
    expect(task).toBeDefined();
  });
});

describe('ExecutionLeaseManager', () => {
  let manager: ExecutionLeaseManager;

  beforeEach(() => {
    manager = new ExecutionLeaseManager();
  });

  it('manages resource leases', () => {
    const lease = manager.acquireLease('w1', 'workflow', 'wf-1', 1000);
    expect(lease.workerId).toBe('w1');
    expect(manager.isLeased('workflow', 'wf-1')).toBe(true);

    manager.renewLease('w1', 'workflow', 'wf-1');
    expect(manager.isLeased('workflow', 'wf-1')).toBe(true);

    manager.releaseLease('w1', 'workflow', 'wf-1');
    expect(manager.isLeased('workflow', 'wf-1')).toBe(false);
  });

  it('prevents leasing already leased resource', () => {
    manager.acquireLease('w1', 'workflow', 'wf-1', 1000);
    expect(() => manager.acquireLease('w2', 'workflow', 'wf-1', 1000)).toThrow(LeaseError);
  });

  it('throws renew lease when not found or owned by different worker', () => {
    expect(() => manager.renewLease('w1', 'workflow', 'wf-1')).toThrow(LeaseError);
    manager.acquireLease('w1', 'workflow', 'wf-1', 1000);
    expect(() => manager.renewLease('w2', 'workflow', 'wf-1')).toThrow(LeaseError);
  });

  it('handles lease takeovers', () => {
    manager.acquireLease('w1', 'workflow', 'wf-1', -100); // already expired
    const takeover = manager.takeoverLease('w2', 'workflow', 'wf-1', 1000);
    expect(takeover.workerId).toBe('w2');

    // Trying to takeover active lease throws
    expect(() => manager.takeoverLease('w1', 'workflow', 'wf-1', 1000)).toThrow(LeaseError);
  });

  it('clears all leases', () => {
    manager.acquireLease('w1', 'workflow', 'wf-1', 1000);
    manager.clear();
    expect(manager.isLeased('workflow', 'wf-1')).toBe(false);
  });
});

describe('WorkerRegistry', () => {
  let registry: WorkerRegistry;

  beforeEach(() => {
    registry = new WorkerRegistry();
  });

  it('registers and listings active workers', () => {
    const worker = {
      id: 'w1',
      hostname: 'host',
      capabilities: [],
      maxMemoryMb: 1024,
      maxCpu: 4,
      registeredAt: new Date(),
      lastHeartbeat: new Date(),
    };
    registry.register(worker);
    expect(registry.getWorker('w1')).toBeDefined();

    registry.heartbeat('w1');

    expect(registry.listWorkers()).toHaveLength(1);

    registry.unregister('w1');
    expect(registry.getWorker('w1')).toBeUndefined();
  });

  it('throws when registering existing worker or heartbeat of missing worker', () => {
    const worker = {
      id: 'w1',
      hostname: 'host',
      capabilities: [],
      maxMemoryMb: 1024,
      maxCpu: 4,
      registeredAt: new Date(),
      lastHeartbeat: new Date(),
    };
    registry.register(worker);
    expect(() => registry.register(worker)).toThrow(WorkerRegistryError);
    expect(() => registry.heartbeat('w2')).toThrow(WorkerRegistryError);
  });

  it('lists workers', () => {
    const worker1 = {
      id: 'w1',
      hostname: 'host',
      capabilities: [],
      maxMemoryMb: 1024,
      maxCpu: 4,
      registeredAt: new Date(),
      lastHeartbeat: new Date(),
    };
    const worker2 = {
      id: 'w2',
      hostname: 'host',
      capabilities: [],
      maxMemoryMb: 1024,
      maxCpu: 4,
      registeredAt: new Date(),
      lastHeartbeat: new Date(Date.now() - 20000),
    };

    registry.register(worker1);
    registry.register(worker2);

    const active = registry.listWorkers();
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe('w1');
  });

  it('clears all workers', () => {
    const worker = {
      id: 'w1',
      hostname: 'host',
      capabilities: [],
      maxMemoryMb: 1024,
      maxCpu: 4,
      registeredAt: new Date(),
      lastHeartbeat: new Date(),
    };
    registry.register(worker);
    registry.clear();
    expect(registry.listWorkers()).toHaveLength(0);
  });
});

describe('ClusterMembership', () => {
  let cluster: ClusterMembership;

  beforeEach(() => {
    cluster = new ClusterMembership();
  });

  it('manages node joins, heartbeats, and leader election', () => {
    const node1 = {
      id: 'node-1',
      address: '127.0.0.1',
      status: 'ACTIVE' as const,
      lastHeartbeat: new Date(),
    };
    const node2 = {
      id: 'node-2',
      address: '127.0.0.2',
      status: 'ACTIVE' as const,
      lastHeartbeat: new Date(),
    };
    const node3 = {
      id: 'node-3',
      address: '127.0.0.3',
      status: 'ACTIVE' as const,
      lastHeartbeat: new Date(Date.now() - 30000),
    };

    cluster.join(node1);
    cluster.join(node2);
    cluster.join(node3);
    cluster.heartbeat('node-1');

    expect(cluster.electLeader()).toBe('node-1');
    expect(cluster.getLeader()).toBe('node-1');

    expect(cluster.listNodes().find((n) => n.id === 'node-3')?.status).toBe('DOWN');

    cluster.leave('node-1');
    expect(cluster.getLeader()).toBe('node-2');
  });

  it('throws on duplicate node join, missing node heartbeat, or no active nodes leadership', () => {
    const node1 = {
      id: 'node-1',
      address: '127.0.0.1',
      status: 'ACTIVE' as const,
      lastHeartbeat: new Date(),
    };
    cluster.join(node1);
    expect(() => cluster.join(node1)).toThrow(ClusterError);
    expect(() => cluster.heartbeat('node-2')).toThrow(ClusterError);

    cluster.leave('node-1');
    expect(() => cluster.electLeader()).toThrow(ClusterError);
  });

  it('clears cluster state', () => {
    const node1 = {
      id: 'node-1',
      address: '127.0.0.1',
      status: 'ACTIVE' as const,
      lastHeartbeat: new Date(),
    };
    cluster.join(node1);
    cluster.clear();
    expect(cluster.getLeader()).toBeNull();
  });
});

describe('BackpressureController', () => {
  it('flags limits based on threshold configs', () => {
    const controller = new BackpressureController({
      cpuThreshold: 80,
      memoryThreshold: 80,
      queueLengthThreshold: 100,
      tokenThreshold: 500000,
      costThreshold: 100,
    });

    expect(controller.getConfig()).toBeDefined();

    expect(() =>
      controller.checkLimits({ cpu: 90, memory: 50, queueLength: 10, tokens: 1000, cost: 5 }),
    ).toThrow(BackpressureError);
    expect(() =>
      controller.checkLimits({ cpu: 50, memory: 90, queueLength: 10, tokens: 1000, cost: 5 }),
    ).toThrow(BackpressureError);
    expect(() =>
      controller.checkLimits({ cpu: 50, memory: 50, queueLength: 110, tokens: 1000, cost: 5 }),
    ).toThrow(BackpressureError);
    expect(() =>
      controller.checkLimits({ cpu: 50, memory: 50, queueLength: 10, tokens: 600000, cost: 5 }),
    ).toThrow(BackpressureError);
    expect(() =>
      controller.checkLimits({ cpu: 50, memory: 50, queueLength: 10, tokens: 1000, cost: 120 }),
    ).toThrow(BackpressureError);

    expect(() =>
      controller.checkLimits({ cpu: 50, memory: 50, queueLength: 10, tokens: 1000, cost: 5 }),
    ).not.toThrow();
  });
});

describe('CircuitBreaker', () => {
  let cb: CircuitBreaker;

  beforeEach(() => {
    cb = new CircuitBreaker({ failureThreshold: 2, recoveryTimeoutMs: 50 });
  });

  it('transitions state based on errors and successes', async () => {
    const opSuccess = () => Promise.resolve('ok');
    const opFail = () => Promise.reject(new Error('fail'));

    expect(await cb.execute(opSuccess)).toBe('ok');

    // First fail
    try {
      await cb.execute(opFail);
    } catch (e) {}
    // Second fail -> OPEN
    try {
      await cb.execute(opFail);
    } catch (e) {}

    expect(cb.getMetrics().state).toBe('OPEN');
    await expect(cb.execute(opSuccess)).rejects.toThrow(CircuitOpenError);

    // Wait for recovery timeout
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Success transitions from HALF_OPEN back to CLOSED
    expect(await cb.execute(opSuccess)).toBe('ok');
    expect(cb.getMetrics().state).toBe('CLOSED');
  });

  it('resets circuit breaker state', async () => {
    const opFail = () => Promise.reject(new Error('fail'));
    try {
      await cb.execute(opFail);
    } catch (e) {}
    try {
      await cb.execute(opFail);
    } catch (e) {}
    cb.reset();
    expect(cb.getMetrics().state).toBe('CLOSED');
  });
});

describe('GracefulShutdownManager', () => {
  let manager: GracefulShutdownManager;

  beforeEach(() => {
    manager = new GracefulShutdownManager();
  });

  it('runs hooks gracefully during shutdown process', async () => {
    const hook = vi.fn().mockResolvedValue(undefined);
    manager.registerHook(hook);
    await manager.initiateShutdown('sigterm');
    expect(hook).toHaveBeenCalled();
    expect(manager.isShutdown()).toBe(true);

    // Second call does nothing
    await manager.initiateShutdown('sigterm');
  });

  it('continues shutdown when hook fails (logs error)', async () => {
    manager.registerHook(() => Promise.reject(new Error('failure')));
    // Shutdown should complete even if hook fails
    await expect(manager.initiateShutdown('sigterm')).resolves.toBeUndefined();
    expect(manager.isShutdown()).toBe(true);
  });

  it('clears hook registry', () => {
    manager.registerHook(() => Promise.resolve());
    manager.clear();
    expect(manager.isShutdown()).toBe(false);
  });
});

describe('DeadLetterQueue', () => {
  it('receives and lists dead messages', () => {
    const dlq = new DeadLetterQueue();
    const msg = {
      id: '1',
      traceId: 't',
      workflowId: 'w',
      payload: {},
      priority: 1,
      retryCount: 0,
      status: 'FAILED' as const,
      createdAt: new Date(),
    };
    dlq.send(msg);
    expect(dlq.size()).toBe(1);
    expect(dlq.list()).toHaveLength(1);
    dlq.clear();
    expect(dlq.size()).toBe(0);
  });
});

describe('ExecutionDeduplicator', () => {
  it('deduplicates concurrent active workflows', () => {
    const dedup = new ExecutionDeduplicator();
    expect(dedup.isDuplicate('wf-1')).toBe(false);
    dedup.register('wf-1');
    expect(dedup.isDuplicate('wf-1')).toBe(true);
    dedup.deregister('wf-1');
    expect(dedup.isDuplicate('wf-1')).toBe(false);

    dedup.register('wf-2');
    dedup.clear();
    expect(dedup.isDuplicate('wf-2')).toBe(false);
  });
});

describe('ProductionTelemetry', () => {
  let telemetry: ProductionTelemetry;

  beforeEach(() => {
    telemetry = new ProductionTelemetry();
  });

  it('creates spans and increments counters/metrics', () => {
    const span = telemetry.startSpan('span-1', 'trace-1');
    expect(span.name).toBe('span-1');
    telemetry.endSpan(span.spanId);
    expect(telemetry.getSpans()).toHaveLength(1);

    telemetry.incrementCounter('counter-1', 1);
    telemetry.setGauge('gauge-1', 10);
    telemetry.recordHistogram('histogram-1', 5);

    const metrics = telemetry.getMetrics();
    expect(metrics.counters['counter-1']).toBe(1);
    expect(metrics.gauges['gauge-1']).toBe(10);
    expect(metrics.histograms['histogram-1']).toHaveLength(1);

    telemetry.clear();
    expect(telemetry.getSpans()).toHaveLength(0);
  });
});
