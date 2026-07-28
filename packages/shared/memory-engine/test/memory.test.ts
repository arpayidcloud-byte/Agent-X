import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryEngine, InMemoryStore } from '../src/index.js';
import { InMemoryEventBus } from '@agentx-fast/core-runtime';

describe('Memory Engine', () => {
  let eventBus: InMemoryEventBus;
  let store: InMemoryStore;
  let engine: MemoryEngine;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
    store = new InMemoryStore();
    engine = new MemoryEngine(store, eventBus);
  });

  it('stores and retrieves memory', async () => {
    const mem = await engine.store({ content: 'test content', importance: 5 });
    expect(mem.id).toBeDefined();
    expect(mem.content).toBe('test content');

    const results = await engine.retrieve('test');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(mem.id);
  });

  it('filters by options', async () => {
    await engine.store({ content: 'A', importance: 1, type: 'working' });
    await engine.store({ content: 'B', importance: 9, type: 'long_term' });

    const highImp = await engine.retrieve('', { minImportance: 5 });
    expect(highImp).toHaveLength(1);
    expect(highImp[0].content).toBe('B');

    const longTerm = await engine.retrieve('', { type: 'long_term' });
    expect(longTerm).toHaveLength(1);
    expect(longTerm[0].content).toBe('B');
  });

  it('forgets memory', async () => {
    const mem = await engine.store({ content: 'delete me' });
    await engine.forget(mem.id);
    const results = await engine.retrieve('delete');
    expect(results).toHaveLength(0);

    // Ignore non-existent
    await expect(engine.forget('missing')).resolves.not.toThrow();
  });

  it('cleans up expired memory', async () => {
    vi.useFakeTimers();
    await engine.store({ content: 'temp', ttl: 1 });

    vi.advanceTimersByTime(2000); // 2 seconds
    const results = await engine.retrieve('temp');
    expect(results).toHaveLength(0);
    vi.useRealTimers();
  });

  it('compacts memory by removing low importance working memory', async () => {
    await engine.store({ content: 'low', importance: 1, type: 'working' });
    await engine.store({ content: 'high', importance: 8, type: 'working' });

    await engine.compact();

    const results = await engine.retrieve('');
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('high');
  });

  it('provides metrics', async () => {
    await engine.store({ content: 'A', importance: 4 });
    await engine.store({ content: 'B', importance: 8 });

    const metrics = engine.getMetrics();
    expect(metrics.totalMemories).toBe(2);
    expect(metrics.averageImportance).toBe(6);
  });
});
