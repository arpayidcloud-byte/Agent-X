import { describe, it, expect, vi } from 'vitest';
import { RequestBatcher } from '../src/batcher.js';

describe('RequestBatcher', () => {
  it('batches requests and processes them', async () => {
    const processor = vi
      .fn()
      .mockImplementation((batch: number[]) => Promise.resolve(batch.map((x) => x * 2)));

    const batcher = new RequestBatcher<number, number>(processor, {
      maxBatchSize: 3,
      delayMs: 10,
    });

    const results = await Promise.all([batcher.add(1), batcher.add(2), batcher.add(3)]);

    expect(results).toEqual([2, 4, 6]);
    expect(processor).toHaveBeenCalledOnce();
    expect(processor).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('flushes on delay timeout', async () => {
    const processor = vi
      .fn()
      .mockImplementation((batch: number[]) => Promise.resolve(batch.map((x) => x * 10)));

    const batcher = new RequestBatcher<number, number>(processor, {
      maxBatchSize: 5,
      delayMs: 5,
    });

    const result = await batcher.add(1);
    expect(result).toBe(10);
    expect(processor).toHaveBeenCalledOnce();
  });

  it('rejects on processor error', async () => {
    const processor = vi.fn().mockRejectedValue(new Error('batch failed'));
    const batcher = new RequestBatcher<number, number>(processor, {
      maxBatchSize: 2,
      delayMs: 5,
    });

    await expect(Promise.all([batcher.add(1), batcher.add(2)])).rejects.toThrow('batch failed');
  });
});
