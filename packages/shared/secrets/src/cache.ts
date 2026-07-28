import { LRUCache } from 'lru-cache';

interface SecretCacheConfig {
  ttlMs?: number;
  maxSize?: number;
  negativeTtlMs?: number;
}

export class SecretCache {
  private positiveCache: LRUCache<string, string>;
  private negativeCache: LRUCache<string, boolean>;

  constructor(config: SecretCacheConfig = {}) {
    this.positiveCache = new LRUCache<string, string>({
      max: config.maxSize || 100,
      ttl: config.ttlMs || 1000 * 60 * 5,
      ttlAutopurge: true,
    });
    this.negativeCache = new LRUCache<string, boolean>({
      ttl: config.negativeTtlMs || 1000 * 60 * 5,
      ttlAutopurge: true,
    });
  }

  set(key: string, value: string): void {
    this.negativeCache.delete(key);
    this.positiveCache.set(key, value);
  }

  setNegative(key: string): void {
    this.positiveCache.delete(key);
    this.negativeCache.set(key, true);
  }

  get(key: string): string | undefined {
    return this.positiveCache.get(key);
  }

  has(key: string): boolean {
    return this.positiveCache.has(key) || this.negativeCache.has(key);
  }

  hasPositive(key: string): boolean {
    return this.positiveCache.has(key);
  }

  hasNegative(key: string): boolean {
    return this.negativeCache.has(key);
  }

  delete(key: string): void {
    this.positiveCache.delete(key);
    this.negativeCache.delete(key);
  }

  clear(): void {
    this.positiveCache.clear();
    this.negativeCache.clear();
  }
}

const globalCache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 5,
  ttlAutopurge: true,
});

export const getCache = (key: string): string | undefined => globalCache.get(key);
export const setCache = (key: string, value: string) => globalCache.set(key, value);
export const deleteCache = (key: string) => globalCache.delete(key);
export const clearCache = () => globalCache.clear();
