import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ContextEngine,
  SimpleTokenEstimator,
  ContextWindowManager,
  ContextCompressor,
} from '../src/index.js';
import { InMemoryEventBus } from '@agentx-fast/core-runtime';

describe('Context Engine', () => {
  let eventBus: InMemoryEventBus;
  let estimator: SimpleTokenEstimator;
  let compressor: ContextCompressor;
  let windowManager: ContextWindowManager;
  let engine: ContextEngine;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
    estimator = new SimpleTokenEstimator();
    compressor = new ContextCompressor();
    windowManager = new ContextWindowManager(estimator);
    engine = new ContextEngine(eventBus, estimator, compressor);
  });

  it('creates and updates contexts correctly', async () => {
    const ctx = await engine.createContext('global', { foo: 'bar' });
    expect(ctx.id).toBeDefined();
    expect(ctx.scope).toBe('global');
    expect(ctx.data.foo).toBe('bar');

    const updated = await engine.updateContext(ctx.id, { hello: 'world' });
    expect(updated.version).toBe(2);
    expect(updated.data.hello).toBe('world');
    expect(updated.data.foo).toBe('bar');
  });

  it('retrieves and validates context successfully', async () => {
    const ctx = await engine.createContext('task', { abc: 123 });
    const retrieved = await engine.getContext(ctx.id);
    expect(retrieved?.id).toBe(ctx.id);

    const isValid = await engine.validateContext(ctx.id);
    expect(isValid).toBe(true);

    const invalidValid = await engine.validateContext('nonexistent');
    expect(invalidValid).toBe(false);
  });

  it('merges multiple contexts', async () => {
    const ctx1 = await engine.createContext('task', { a: 1 });
    const ctx2 = await engine.createContext('task', { b: 2 });
    const merged = await engine.mergeContexts([ctx1.id, ctx2.id], 'workflow');

    expect(merged.data.a).toBe(1);
    expect(merged.data.b).toBe(2);
  });

  it('compress contexts correctly based on token target', async () => {
    const ctx = await engine.createContext('conversation', {
      text: 'a'.repeat(200), // ~50 tokens
      arr: [1, 2, 3],
      nested: { obj: 'val' },
      empty: null,
      num: 1,
    });
    expect(ctx.tokenEstimate).toBeGreaterThan(45);

    const compressed = await engine.compressContext(ctx.id, 10);
    expect(compressed.tokenEstimate).toBeLessThanOrEqual(25);

    // Also test early exit when targetTokens is >= estimate
    const uncompressed = await engine.compressContext(ctx.id, 100);
    // Since ctx was updated by the first compress, we should compare to compressed.version
    expect(uncompressed.version).toBe(compressed.version); // No update
  });

  it('gets metrics', () => {
    const metrics = engine.getMetrics();
    expect(metrics.totalContexts).toBeGreaterThanOrEqual(0);
  });

  it('trims context windows using window manager', () => {
    const data = { a: 'a'.repeat(100), b: 'b'.repeat(100) };
    const trimmed = windowManager.trim(data, 30);
    expect(trimmed).toHaveProperty('a');
    expect(trimmed).not.toHaveProperty('b');

    const history = ['a'.repeat(50), 'b'.repeat(50), 'c'.repeat(50)];
    const slided = windowManager.slideWindow(history, 25);
    expect(slided).toHaveLength(1);
    expect(slided[0]).toBe('c'.repeat(50));
  });

  it('throws on missing context', async () => {
    await expect(engine.updateContext('missing', {})).rejects.toThrow();
    await expect(engine.compressContext('missing', 10)).rejects.toThrow();
  });
});
