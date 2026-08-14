import { describe, expect, it } from 'vitest';
import { LLMCacheManager } from '../cache-manager.js';
import type { LLMResponse, RouteRequest } from '../types.js';

const response: LLMResponse = {
  message: 'org-A response',
  provider: 'test',
  model: 'test-model',
  usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
  cost: 0.01,
  latencyMs: 10,
  cached: false,
};

const request = (orgId: string): RouteRequest => ({
  taskId: 'same-task',
  description: 'same task',
  context: { orgId },
});

describe('LLM cache tenant isolation', () => {
  it('does not share identical prompt and task inputs across organizations', async () => {
    const cache = new LLMCacheManager();
    const prompt = 'same prompt';

    await cache.setCache(request('org-A'), prompt, response);

    expect(await cache.getCached(request('org-A'), prompt)).toMatchObject({
      message: 'org-A response',
      cached: true,
    });
    expect(await cache.getCached(request('org-B'), prompt)).toBeNull();
  });
});
