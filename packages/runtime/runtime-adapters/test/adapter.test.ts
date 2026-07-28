/**
 * @module runtime-adapters/adapter.test
 * @description Comprehensive unit tests matching >99% coverage targets (M4.2.5).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ProviderRegistry,
  ProviderCapabilityResolver,
  ProviderHealthMonitor,
  ProviderFailoverManager,
  MemoryQueueProvider,
  MemoryLockProvider,
  MemoryStorageProvider,
  MemoryTelemetryProvider,
  MemorySecretProvider,
  MemoryWorkerDiscoveryProvider,
  ProviderResolutionError,
  ProviderUnavailableError,
  AdapterError,
  UnsupportedProviderCapabilityError,
} from '../src/index.js';

describe('Provider Registry', () => {
  let registry: ProviderRegistry;

  beforeEach(() => {
    registry = new ProviderRegistry();
  });

  it('registers, resolves, and lists providers', async () => {
    const queueProvider = new MemoryQueueProvider();
    registry.registerProvider('queue', queueProvider);

    expect(registry.resolve('queue')).toBeDefined();
    expect(registry.listProviders()).toHaveLength(1);

    registry.unregisterProvider('queue');
    expect(() => registry.resolve('queue')).toThrow(ProviderResolutionError);
  });

  it('resolves by type', () => {
    const lockProvider = new MemoryLockProvider();
    registry.registerProvider('lock', lockProvider);
    expect(registry.resolveByType('lock')).toBeDefined();
    expect(() => registry.resolveByType('queue')).toThrow(ProviderResolutionError);
  });

  it('resolves by capability', () => {
    const queueProvider = new MemoryQueueProvider();
    registry.registerProvider('queue', queueProvider);
    const providers = registry.resolveByCapability({ priorityQueue: true });
    expect(providers).toHaveLength(1);
  });

  it('fails health check if any provider is unhealthy', async () => {
    // register a mock unhealthy provider
    const mockProvider = {
      getMetadata: () => ({ id: 'mock', name: 'Mock', type: 'queue' as const, version: '1.0' }),
      getCapabilities: () => ({}),
      healthCheck: async () => ({
        healthy: false,
        latencyMs: 0,
        lastChecked: new Date(),
        status: 'DOWN' as const,
      }),
      getMetrics: () => ({
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageLatencyMs: 0,
      }),
    };
    registry.registerProvider('mock', mockProvider);
    await expect(registry.healthCheck()).rejects.toThrow(ProviderUnavailableError);
  });
});

describe('Provider Capability Resolver', () => {
  it('validates capabilities correctly', () => {
    const resolver = new ProviderCapabilityResolver();
    const actual = { transactions: true, priorityQueue: true };
    expect(() => resolver.validateCapabilities({ transactions: true }, actual)).not.toThrow();
    expect(() =>
      resolver.validateCapabilities({ transactions: true, leaderElection: true }, actual),
    ).toThrow();

    expect(resolver.supportsTransactions(actual)).toBe(true);
    expect(resolver.supportsPriorityQueue(actual)).toBe(true);
    expect(resolver.supportsDistributedLocks(actual)).toBe(false);
    expect(resolver.supportsLeaderElection(actual)).toBe(false);
    expect(resolver.supportsTelemetry(actual)).toBe(false);
    expect(resolver.supportsSecretRotation(actual)).toBe(false);
  });
});

describe('Provider Health Monitor', () => {
  it('monitors health, computes latency, and availability', async () => {
    const monitor = new ProviderHealthMonitor();
    const provider = new MemoryQueueProvider();

    await monitor.health(provider);
    const latency = await monitor.ping(provider);
    expect(latency).toBeGreaterThanOrEqual(0);

    expect(monitor.availability('memory-queue')).toBe(100);
    expect(monitor.failureCount('memory-queue')).toBe(0);
    expect(monitor.lastFailure('memory-queue')).toBeUndefined();
    expect(monitor.getHistory('memory-queue')).toHaveLength(1);
  });
});

describe('Provider Failover Manager', () => {
  it('manages failover and promotion of secondary provider', async () => {
    const manager = new ProviderFailoverManager();
    const primary = new MemoryQueueProvider();
    const secondary = new MemoryLockProvider();

    manager.monitorPrimary(primary);
    manager.monitorSecondary(secondary);

    expect(manager.getPrimary()).toBe(primary);
    expect(manager.getSecondary()).toBe(secondary);

    const switched = await manager.switchProvider();
    expect(switched).toBe(secondary); // Since it was swapped, primary is now secondary, and it returns the new primary which is secondary

    // Now primary is secondary (MemoryLockProvider), secondary is primary (MemoryQueueProvider)
    await manager.promoteSecondary(); // Promotes current secondary (MemoryQueueProvider) to primary
    expect(manager.getPrimary()).toBe(primary); // Should be MemoryQueueProvider
    expect(manager.getSecondary()).toBeNull();
  });
});

describe('Memory Queue Provider', () => {
  let provider: MemoryQueueProvider;

  beforeEach(() => {
    provider = new MemoryQueueProvider();
  });

  it('manages queues by priority and depth', async () => {
    await provider.enqueue('topic', { msg: '1' }, 1);
    await provider.enqueue('topic', { msg: '2' }, 10);

    expect(await provider.getDepth('topic')).toBe(2);
    expect(await provider.peek('topic')).toEqual({ msg: '2' });

    const msg = await provider.dequeue('topic');
    expect(msg).toEqual({ msg: '2' });

    await provider.ack('topic', '1');
    await provider.purge('topic');
    expect(await provider.getDepth('topic')).toBe(0);

    expect(provider.getMetrics()).toBeDefined();
  });
});

describe('Memory Lock Provider', () => {
  let provider: MemoryLockProvider;

  beforeEach(() => {
    provider = new MemoryLockProvider();
  });

  it('manages acquisition, renewal, and locking state', async () => {
    const lockId = await provider.acquire('res-1', 10000);
    expect(lockId).toBeDefined();
    expect(await provider.isLocked('res-1')).toBe(true);

    await provider.renew('res-1', lockId, 20000);
    await provider.release('res-1', lockId);

    await provider.acquire('res-1', 10000);
    await provider.expire('res-1');
    expect(await provider.isLocked('res-1')).toBe(false);
  });
});

describe('Memory Storage Provider', () => {
  let provider: MemoryStorageProvider;

  beforeEach(() => {
    provider = new MemoryStorageProvider();
  });

  it('manages storage operations and transactions', async () => {
    await provider.put('bucket', 'key1', 'value1');
    expect(await provider.exists('bucket', 'key1')).toBe(true);
    expect(await provider.get('bucket', 'key1')).toBe('value1');

    const list = await provider.list('bucket', 'key');
    expect(list).toContain('key1');

    await provider.delete('bucket', 'key1');
    expect(await provider.exists('bucket', 'key1')).toBe(false);

    await provider.transaction(async () => {
      await provider.put('bucket', 'key2', 'value2');
    });
    expect(await provider.get('bucket', 'key2')).toBe('value2');
  });
});

describe('Memory Telemetry Provider', () => {
  let provider: MemoryTelemetryProvider;

  beforeEach(() => {
    provider = new MemoryTelemetryProvider();
  });

  it('manages spans, counters, and flush', async () => {
    const spanId = provider.startSpan('op-1', { traceId: 't1' });
    provider.endSpan(spanId, 'OK');
    expect(provider.getSpans().get(spanId)?.status).toBe('OK');

    provider.recordCounter('count', 10);
    provider.recordGauge('gauge', 50);
    provider.recordHistogram('hist', 100);

    expect(provider.getGauges().get('count')).toBe(10);
    expect(provider.getGauges().get('gauge')).toBe(50);
    await provider.flush();
  });
});

describe('Memory Secret Provider', () => {
  let provider: MemorySecretProvider;

  beforeEach(() => {
    provider = new MemorySecretProvider();
  });

  it('manages secrets and rotation', async () => {
    await provider.putSecret('api_key', '123');
    expect(await provider.getSecret('api_key')).toBe('123');

    expect(await provider.listSecrets()).toContain('api_key');

    await provider.rotateSecret('api_key', '456');
    expect(await provider.getSecret('api_key')).toBe('456');

    await provider.deleteSecret('api_key');
    expect(await provider.getSecret('api_key')).toBeUndefined();
  });
});

describe('Memory Worker Discovery Provider', () => {
  let provider: MemoryWorkerDiscoveryProvider;

  beforeEach(() => {
    provider = new MemoryWorkerDiscoveryProvider();
  });

  it('manages worker registration, heartbeats, and discovery', async () => {
    await provider.registerWorker('worker-1', { capabilities: ['gpu'] });
    expect((await provider.listWorkers()).length).toBe(1);

    await provider.heartbeat('worker-1');
    expect((await provider.discover('gpu')).length).toBe(1);
    expect((await provider.discover('cpu')).length).toBe(0);

    await provider.removeWorker('worker-1');
    expect((await provider.listWorkers()).length).toBe(0);
  });
});

describe('Memory Queue Provider coverage', () => {
  it('covers retry, deadLetter, capabilities, metrics, health, metadata', async () => {
    const provider = new MemoryQueueProvider();
    expect(provider.getMetadata().id).toBe('memory-queue');
    expect(provider.getCapabilities().priorityQueue).toBe(true);
    expect((await provider.healthCheck()).healthy).toBe(true);
    expect(provider.getMetrics().totalRequests).toBe(0);

    await provider.retry('topic', '1');
    await provider.deadLetter('topic', '1');
  });
});

describe('Memory Lock Provider coverage', () => {
  it('covers capabilities, metrics, health, metadata', async () => {
    const provider = new MemoryLockProvider();
    expect(provider.getMetadata().id).toBe('memory-lock');
    expect(provider.getCapabilities().distributedLocks).toBe(true);
    expect((await provider.healthCheck()).healthy).toBe(true);
    expect(provider.getMetrics().totalRequests).toBe(0);
  });
});

describe('Memory Storage Provider coverage', () => {
  it('covers capabilities, metrics, health, metadata', async () => {
    const provider = new MemoryStorageProvider();
    expect(provider.getMetadata().id).toBe('memory-storage');
    expect(provider.getCapabilities().transactions).toBe(true);
    expect((await provider.healthCheck()).healthy).toBe(true);
    expect(provider.getMetrics().totalRequests).toBe(0);
  });
});

describe('Memory Telemetry Provider coverage', () => {
  it('covers capabilities, metrics, health, metadata', async () => {
    const provider = new MemoryTelemetryProvider();
    expect(provider.getMetadata().id).toBe('memory-telemetry');
    expect(provider.getCapabilities().telemetry).toBe(true);
    expect((await provider.healthCheck()).healthy).toBe(true);
    expect(provider.getMetrics().totalRequests).toBe(0);
  });
});

describe('Memory Secret Provider coverage', () => {
  it('covers capabilities, metrics, health, metadata', async () => {
    const provider = new MemorySecretProvider();
    expect(provider.getMetadata().id).toBe('memory-secret');
    expect(provider.getCapabilities().secretRotation).toBe(true);
    expect((await provider.healthCheck()).healthy).toBe(true);
    expect(provider.getMetrics().totalRequests).toBe(0);
  });
});

describe('Memory Worker Discovery Provider coverage', () => {
  it('covers capabilities, metrics, health, metadata', async () => {
    const provider = new MemoryWorkerDiscoveryProvider();
    expect(provider.getMetadata().id).toBe('memory-worker-discovery');
    expect(provider.getCapabilities().leaderElection).toBe(true);
    expect((await provider.healthCheck()).healthy).toBe(true);
    expect(provider.getMetrics().totalRequests).toBe(0);
  });
});

describe('Provider Failover Manager coverage', () => {
  it('covers recover and rollback', async () => {
    const manager = new ProviderFailoverManager();
    await manager.rollback();
    await manager.recover();
    await expect(manager.switchProvider()).rejects.toThrow();
  });
});

describe('Provider Capability Resolver coverage', () => {
  it('covers throwing missing capabilities', () => {
    const resolver = new ProviderCapabilityResolver();
    const caps = {
      transactions: false,
      priorityQueue: false,
      distributedLocks: false,
      leaderElection: false,
      telemetry: false,
      secretRotation: false,
    };

    expect(() => resolver.validateCapabilities({ transactions: true }, caps)).toThrow();
    expect(() => resolver.validateCapabilities({ priorityQueue: true }, caps)).toThrow();
    expect(() => resolver.validateCapabilities({ distributedLocks: true }, caps)).toThrow();
    expect(() => resolver.validateCapabilities({ leaderElection: true }, caps)).toThrow();
    expect(() => resolver.validateCapabilities({ telemetry: true }, caps)).toThrow();
    expect(() => resolver.validateCapabilities({ secretRotation: true }, caps)).toThrow();
  });
});

describe('Provider Health Monitor coverage', () => {
  it('covers edge cases with zero history', async () => {
    const monitor = new ProviderHealthMonitor();
    expect(monitor.latency('missing')).toBe(0);
    expect(monitor.availability('missing')).toBe(100);
    expect(monitor.failureCount('missing')).toBe(0);
    expect(monitor.lastFailure('missing')).toBeUndefined();
  });
});

describe('UnsupportedProviderCapabilityError coverage', () => {
  it('can be instantiated', () => {
    const err = new UnsupportedProviderCapabilityError('msg', 'src');
    expect(err.message).toBe('msg');
    expect(err.code).toBe('UNSUPPORTED_PROVIDER_CAPABILITY_ERROR');
    expect(err.source).toBe('src');
  });
});
