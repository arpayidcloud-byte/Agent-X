export interface CacheBackend<K, V> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V, ttlMs?: number): Promise<void>;
  delete(key: K): Promise<void>;
  has(key: K): Promise<boolean>;
  clear(): Promise<void>;
  size(): Promise<number>;
}

export interface CacheOptions {
  maxEntries?: number;
  defaultTtlMs?: number;
}

export interface CacheEntry<V> {
  value: V;
  expiresAt?: number;
}
