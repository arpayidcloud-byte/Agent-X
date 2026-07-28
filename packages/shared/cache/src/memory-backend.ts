import type { CacheBackend, CacheEntry, CacheOptions } from './interfaces.js';

export class MemoryCache<K, V> implements CacheBackend<K, V> {
  private store = new Map<string, CacheEntry<V>>();
  private maxEntries: number;
  private defaultTtlMs: number;

  constructor(options: CacheOptions = {}) {
    this.maxEntries = options.maxEntries ?? 1000;
    this.defaultTtlMs = options.defaultTtlMs ?? 300_000;
  }

  async get(key: K): Promise<V | undefined> {
    const entry = this.store.get(String(key));
    if (!entry) return undefined;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(String(key));
      return undefined;
    }
    return entry.value;
  }

  async set(key: K, value: V, ttlMs?: number): Promise<void> {
    if (this.store.size >= this.maxEntries) {
      this.evictOldest();
    }
    this.store.set(String(key), {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : Date.now() + this.defaultTtlMs,
    });
  }

  async delete(key: K): Promise<void> {
    this.store.delete(String(key));
  }

  async has(key: K): Promise<boolean> {
    const entry = this.store.get(String(key));
    if (!entry) return false;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(String(key));
      return false;
    }
    return true;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async size(): Promise<number> {
    return this.store.size;
  }

  private evictOldest(): void {
    const firstKey = this.store.keys().next().value;
    if (firstKey !== undefined) {
      this.store.delete(firstKey);
    }
  }
}
