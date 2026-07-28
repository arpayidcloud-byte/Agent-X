import type { CacheBackend } from './interfaces.js';
import { MemoryCache } from './memory-backend.js';

export class CacheManager<K, V> {
  private backend: CacheBackend<K, V>;

  constructor(backend?: CacheBackend<K, V>) {
    this.backend = backend ?? new MemoryCache<K, V>();
  }

  async get(key: K): Promise<V | undefined> {
    return this.backend.get(key);
  }

  async set(key: K, value: V, ttlMs?: number): Promise<void> {
    return this.backend.set(key, value, ttlMs);
  }

  async delete(key: K): Promise<void> {
    return this.backend.delete(key);
  }

  async has(key: K): Promise<boolean> {
    return this.backend.has(key);
  }

  async clear(): Promise<void> {
    return this.backend.clear();
  }

  async size(): Promise<number> {
    return this.backend.size();
  }

  async getOrSet(key: K, factory: () => Promise<V>, ttlMs?: number): Promise<V> {
    const existing = await this.get(key);
    if (existing !== undefined) return existing;
    const value = await factory();
    await this.set(key, value, ttlMs);
    return value;
  }
}
