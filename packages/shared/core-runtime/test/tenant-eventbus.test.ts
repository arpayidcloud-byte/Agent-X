import { describe, expect, it, vi } from 'vitest';
import { InMemoryEventBus } from '../src/events/index.js';

describe('tenant-aware InMemoryEventBus', () => {
  it('delivers org-A events to org-A subscribers but not org-B subscribers', async () => {
    const bus = new InMemoryEventBus();
    const orgA = vi.fn();
    const orgB = vi.fn();
    await bus.subscribe('org-A', 'topic', orgA);
    await bus.subscribe('org-B', 'topic', orgB);
    await bus.publish('org-A', 'topic', { value: 1 }, 'trace');
    expect(orgA).toHaveBeenCalledTimes(1);
    expect(orgB).not.toHaveBeenCalled();
  });

  it('rejects publish and subscribe without an organization id', async () => {
    const bus = new InMemoryEventBus();
    await expect(bus.publish('', 'topic', {}, 'trace')).rejects.toThrow(
      'Organization context required',
    );
    await expect(bus.subscribe('', 'topic', async () => {})).rejects.toThrow(
      'Organization context required',
    );
  });
});
