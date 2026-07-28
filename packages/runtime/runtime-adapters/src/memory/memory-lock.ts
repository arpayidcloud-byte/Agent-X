/**
 * @module runtime-adapters/memory/memory-lock
 * @description Reference in-memory distributed lock provider.
 */

import type {
  ILockProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
} from '../interfaces.js';

export class MemoryLockProvider implements ILockProvider {
  private locks = new Map<string, { id: string; expiresAt: number }>();
  private total = 0;
  private successes = 0;

  getMetadata(): ProviderMetadata {
    return {
      id: 'memory-lock',
      name: 'Memory Lock Provider',
      type: 'lock',
      version: '0.1.0',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return { distributedLocks: true };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
  }

  getMetrics(): ProviderMetrics {
    return {
      totalRequests: this.total,
      successfulRequests: this.successes,
      failedRequests: 0,
      averageLatencyMs: 0,
    };
  }

  async acquire(key: string, ttlMs: number): Promise<string> {
    this.total++;
    const existing = this.locks.get(key);
    if (existing && existing.expiresAt > Date.now()) {
      throw new Error(`Lock already held: ${key}`);
    }
    const id = `lock-${Date.now()}-${Math.random()}`;
    this.locks.set(key, { id, expiresAt: Date.now() + ttlMs });
    this.successes++;
    return id;
  }

  async release(key: string, lockId: string): Promise<void> {
    const existing = this.locks.get(key);
    if (existing && existing.id === lockId) {
      this.locks.delete(key);
    }
  }

  async renew(key: string, lockId: string, ttlMs: number): Promise<void> {
    const existing = this.locks.get(key);
    if (existing && existing.id === lockId) {
      existing.expiresAt = Date.now() + ttlMs;
    }
  }

  async expire(key: string): Promise<void> {
    this.locks.delete(key);
  }

  async isLocked(key: string): Promise<boolean> {
    const existing = this.locks.get(key);
    return !!existing && existing.expiresAt > Date.now();
  }
}
