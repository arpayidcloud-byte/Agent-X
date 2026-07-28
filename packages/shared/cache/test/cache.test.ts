import { describe, it, expect, vi } from 'vitest';
import { MemoryCache } from '../src/memory-backend.js';
import { CacheManager } from '../src/cache-manager.js';

describe('MemoryCache', () => {
  it('stores and retrieves values', async () => {
    const cache = new MemoryCache<string, number>();
    await cache.set('a', 42);
    expect(await cache.get('a')).toBe(42);
  });

  it('returns undefined for missing keys', async () => {
    const cache = new MemoryCache<string, number>();
    expect(await cache.get('missing')).toBeUndefined();
  });

  it('respects TTL expiry', async () => {
    const cache = new MemoryCache<string, number>();
    await cache.set('a', 42, 1);
    await new Promise((r) => setTimeout(r, 5));
    expect(await cache.get('a')).toBeUndefined();
  });

  it('evicts oldest when maxEntries reached', async () => {
    const cache = new MemoryCache<string, number>({ maxEntries: 3 });
    await cache.set('a', 1);
    await cache.set('b', 2);
    await cache.set('c', 3);
    await cache.set('d', 4);
    expect(await cache.get('a')).toBeUndefined();
    expect(await cache.size()).toBe(3);
  });

  it('deletes entries', async () => {
    const cache = new MemoryCache<string, number>();
    await cache.set('a', 1);
    await cache.delete('a');
    expect(await cache.get('a')).toBeUndefined();
  });

  it('clears all entries', async () => {
    const cache = new MemoryCache<string, number>();
    await cache.set('a', 1);
    await cache.set('b', 2);
    await cache.clear();
    expect(await cache.size()).toBe(0);
  });
});

describe('CacheManager', () => {
  it('getOrSet returns cached value', async () => {
    const manager = new CacheManager<string, number>();
    const factory = vi.fn().mockResolvedValue(42);
    const result = await manager.getOrSet('key', factory);
    expect(result).toBe(42);
    expect(factory).toHaveBeenCalledOnce();

    const result2 = await manager.getOrSet('key', factory);
    expect(result2).toBe(42);
    expect(factory).toHaveBeenCalledOnce();
  });
});
