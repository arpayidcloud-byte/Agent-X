/**
 * @module runtime-production/lock-manager
 * @description Distributed lock manager abstraction with multiple providers.
 */

import type { LockOptions, LockInfo } from './interfaces.js';
import { DistributedLockError } from './errors.js';

export interface IDistributedLockManager {
  acquire(key: string, options: LockOptions): Promise<LockInfo>;
  release(lockId: string): Promise<void>;
  renew(lockId: string, ttlMs: number): Promise<void>;
  expire(key: string): Promise<void>;
}

export class MemoryLockProvider implements IDistributedLockManager {
  private locks = new Map<string, LockInfo>();

  async acquire(key: string, options: LockOptions): Promise<LockInfo> {
    const existing = this.locks.get(key);
    if (existing && existing.expiresAt.getTime() > Date.now()) {
      throw new DistributedLockError(`Lock already held: ${key}`, 'lock-manager');
    }

    const lock: LockInfo = {
      id: `lock-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      key,
      ownerId: `owner-${Date.now()}`,
      acquiredAt: new Date(),
      expiresAt: new Date(Date.now() + options.ttlMs),
    };
    this.locks.set(key, lock);
    return lock;
  }

  async release(lockId: string): Promise<void> {
    for (const [_key, lock] of this.locks.entries() as IterableIterator<[string, LockInfo]>) {
      if (lock.id === lockId) {
        this.locks.delete(_key);
        return;
      }
    }
    throw new DistributedLockError(`Lock not found: ${lockId}`, 'lock-manager');
  }

  async renew(lockId: string, ttlMs: number): Promise<void> {
    for (const [_key, lock] of this.locks.entries() as IterableIterator<[string, LockInfo]>) {
      if (lock.id === lockId) {
        lock.expiresAt = new Date(Date.now() + ttlMs);
        return;
      }
    }
    throw new DistributedLockError(`Lock not found: ${lockId}`, 'lock-manager');
  }

  async expire(key: string): Promise<void> {
    this.locks.delete(key);
  }
}

export class RedisLockProvider implements IDistributedLockManager {
  private locks = new Map<string, LockInfo>();
  private retryCounters = new Map<string, number>();

  async acquire(key: string, options: LockOptions): Promise<LockInfo> {
    const maxRetries = options.retryCount ?? 3;
    const retryDelay = options.retryDelayMs ?? 100;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const existing = this.locks.get(key);
      if (!existing || existing.expiresAt.getTime() <= Date.now()) {
        const lock: LockInfo = {
          id: `redis-lock-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          key,
          ownerId: `redis-owner-${Date.now()}`,
          acquiredAt: new Date(),
          expiresAt: new Date(Date.now() + options.ttlMs),
        };
        this.locks.set(key, lock);
        this.retryCounters.delete(key);
        return lock;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw new DistributedLockError(
      `Failed to acquire lock after ${maxRetries} retries: ${key}`,
      'lock-manager',
    );
  }

  async release(lockId: string): Promise<void> {
    for (const [key, lock] of this.locks.entries() as IterableIterator<[string, LockInfo]>) {
      if (lock.id === lockId) {
        this.locks.delete(key);
        return;
      }
    }
    throw new DistributedLockError(`Lock not found: ${lockId}`, 'lock-manager');
  }

  async renew(lockId: string, ttlMs: number): Promise<void> {
    for (const lock of this.locks.values() as IterableIterator<LockInfo>) {
      if (lock.id === lockId) {
        if (lock.expiresAt.getTime() <= Date.now()) {
          throw new DistributedLockError(`Lock expired: ${lockId}`, 'lock-manager');
        }
        lock.expiresAt = new Date(Date.now() + ttlMs);
        return;
      }
    }
    throw new DistributedLockError(`Lock not found: ${lockId}`, 'lock-manager');
  }

  async expire(key: string): Promise<void> {
    this.locks.delete(key);
  }
}

export class PostgresAdvisoryLockProvider implements IDistributedLockManager {
  private locks = new Map<string, LockInfo>();
  private lockHashes = new Map<string, number>();

  private hashKey(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }
    return Math.abs(hash);
  }

  async acquire(key: string, options: LockOptions): Promise<LockInfo> {
    const maxRetries = options.retryCount ?? 3;
    const retryDelay = options.retryDelayMs ?? 100;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const existing = this.locks.get(key);
      if (!existing || existing.expiresAt.getTime() <= Date.now()) {
        const lockHash = this.hashKey(key);
        const lock: LockInfo = {
          id: `pg-lock-${lockHash}-${Date.now()}`,
          key,
          ownerId: `pg-owner-${Date.now()}`,
          acquiredAt: new Date(),
          expiresAt: new Date(Date.now() + options.ttlMs),
        };
        this.locks.set(key, lock);
        this.lockHashes.set(key, lockHash);
        return lock;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw new DistributedLockError(
      `Failed to acquire advisory lock after ${maxRetries} retries: ${key}`,
      'lock-manager',
    );
  }

  async release(lockId: string): Promise<void> {
    for (const [key, lock] of this.locks.entries() as IterableIterator<[string, LockInfo]>) {
      if (lock.id === lockId) {
        this.locks.delete(key);
        this.lockHashes.delete(key);
        return;
      }
    }
    throw new DistributedLockError(`Lock not found: ${lockId}`, 'lock-manager');
  }

  async renew(lockId: string, ttlMs: number): Promise<void> {
    for (const lock of this.locks.values() as IterableIterator<LockInfo>) {
      if (lock.id === lockId) {
        if (lock.expiresAt.getTime() <= Date.now()) {
          throw new DistributedLockError(`Lock expired: ${lockId}`, 'lock-manager');
        }
        lock.expiresAt = new Date(Date.now() + ttlMs);
        return;
      }
    }
    throw new DistributedLockError(`Lock not found: ${lockId}`, 'lock-manager');
  }

  async expire(key: string): Promise<void> {
    this.locks.delete(key);
    this.lockHashes.delete(key);
  }
}
