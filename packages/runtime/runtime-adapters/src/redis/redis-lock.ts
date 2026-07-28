import { Redis } from 'ioredis';
import type {
  ILockProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
} from '../interfaces.js';

export class RedisLockProvider implements ILockProvider {
  private redis: Redis;
  private total = 0;
  private successes = 0;
  private failures = 0;

  constructor(redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379') {
    this.redis = new Redis(redisUrl);
  }

  getMetadata(): ProviderMetadata {
    return {
      id: 'redis-lock',
      name: 'Redis Lock Provider',
      type: 'lock',
      version: '1.0.0',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return { distributedLocks: true };
  }

  async healthCheck(): Promise<ProviderHealth> {
    try {
      await this.redis.ping();
      return { healthy: true, latencyMs: 1, lastChecked: new Date(), status: 'ACTIVE' };
    } catch (e) {
      return {
        healthy: false,
        latencyMs: 0,
        lastChecked: new Date(),
        status: 'DEGRADED',
        details: { reason: String(e) },
      };
    }
  }

  getMetrics(): ProviderMetrics {
    return {
      totalRequests: this.total,
      successfulRequests: this.successes,
      failedRequests: this.failures,
      averageLatencyMs: 0,
    };
  }

  async acquire(key: string, ttlMs: number): Promise<string> {
    this.total++;
    const lockId = `lock-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Set IF NOT EXISTS with PX (milliseconds)
    const result = await this.redis.set(`lock:${key}`, lockId, 'PX', ttlMs, 'NX');

    if (result === 'OK') {
      this.successes++;
      return lockId;
    }

    this.failures++;
    throw new Error(`Lock already held: ${key}`);
  }

  async release(key: string, lockId: string): Promise<void> {
    // Use Lua script to ensure we only delete if we own the lock
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.redis.eval(script, 1, `lock:${key}`, lockId);
  }

  async renew(key: string, lockId: string, ttlMs: number): Promise<void> {
    // Use Lua script to ensure we only renew if we own the lock
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("pexpire", KEYS[1], ARGV[2])
      else
        return 0
      end
    `;
    await this.redis.eval(script, 1, `lock:${key}`, lockId, ttlMs);
  }

  async expire(key: string): Promise<void> {
    await this.redis.del(`lock:${key}`);
  }

  async isLocked(key: string): Promise<boolean> {
    const exists = await this.redis.exists(`lock:${key}`);
    return exists === 1;
  }
}
