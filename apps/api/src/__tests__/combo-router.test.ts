import { describe, it, expect } from 'vitest';

process.env.ENABLE_MOCK_PROVIDER = 'true';
delete process.env.DATABASE_URL;
const { executeRoute, isRetryableError } = await import('../combo-router.js');
const { createGroup } = await import('../provider-group-store.js');
const { LLMRouter, MockProvider } = await import('@agent-xai/llm-router');
const { upsertProvider, listProviders } = await import('../llm-provider-store.js');

// MockProvider with a knob: throw when failMode is on.
class FlakyProvider extends MockProvider {
  fail = false;
  override async generate(
    model: string,
    prompt: string,
    opts?: object,
  ): Promise<{
    message: string;
    provider: string;
    model: string;
    usage: { inputTokens: number; outputTokens: number; totalTokens: number };
    cost: number;
    latencyMs: number;
    cached: boolean;
  }> {
    if (this.fail) throw new Error('fetch failed: ECONNREFUSED 127.0.0.1:1');
    return super.generate(model, prompt, opts as never);
  }
}

// Seed mock providers into the in-memory store (used by combo resolve).
const mockProviderDefs = [
  {
    name: 'openai',
    type: 'openai-compatible' as const,
    baseUrl: 'http://localhost',
    apiKey: 'test-openai',
    models: [
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        inputCostPerMillion: 2.5,
        outputCostPerMillion: 10,
        capabilities: ['reasoning'],
        complexityRating: 'medium',
      },
    ],
    enabled: true,
    provider: 'openai',
  },
  {
    name: 'deepseek',
    type: 'openai-compatible' as const,
    baseUrl: 'http://localhost',
    apiKey: 'test-deepseek',
    models: [
      {
        id: 'deepseek-chat',
        name: 'deepseek-chat',
        inputCostPerMillion: 0.27,
        outputCostPerMillion: 1.1,
        capabilities: ['reasoning'],
        complexityRating: 'medium',
      },
    ],
    enabled: true,
    provider: 'deepseek',
  },
];

function makeRouter(): {
  router: InstanceType<typeof LLMRouter>;
  openai: FlakyProvider;
  deepseek: FlakyProvider;
} {
  const openai = new FlakyProvider('openai', {
    'gpt-4o': {
      name: 'gpt-4o',
      provider: 'openai',
      pricing: { inputCostPerMillion: 2.5, outputCostPerMillion: 10 },
      capabilities: ['reasoning'],
      complexityRating: 'medium',
    },
  });
  const deepseek = new FlakyProvider('deepseek', {
    'deepseek-chat': {
      name: 'deepseek-chat',
      provider: 'deepseek',
      pricing: { inputCostPerMillion: 0.27, outputCostPerMillion: 1.1 },
      capabilities: ['reasoning'],
      complexityRating: 'medium',
    },
  });
  const router = new LLMRouter();
  router.registerProvider(openai);
  router.registerProvider(deepseek);
  return { router, openai, deepseek };
}

// Ensure mock providers are in the in-memory store before tests run.
for (const def of mockProviderDefs) {
  const existing = (await listProviders()).find((p) => p.name === def.name);
  if (!existing) await upsertProvider(def);
}

describe('combo-router executeRoute', () => {
  it('passes through when no provider is pinned', async () => {
    const { router } = makeRouter();
    const res = await executeRoute(router, { taskId: 't1', description: 'x' }, 'hello');
    expect(res.message.length).toBeGreaterThan(0);
  });

  it('fails over to the next member when the first is down (priority)', async () => {
    const { router, openai, deepseek } = makeRouter();
    openai.fail = true;
    await createGroup({
      name: 'combo-failover',
      strategy: 'priority',
      members: [{ provider: 'openai' }, { provider: 'deepseek' }],
    });
    const res = await executeRoute(
      router,
      { taskId: 't2', description: 'x', provider: 'combo-failover' },
      'hello',
    );
    expect(res.provider).toBe('deepseek');
    expect(deepseek.fail).toBe(false);
  });

  it('exhausts all members and throws a combo error', async () => {
    const { router, openai, deepseek } = makeRouter();
    openai.fail = true;
    deepseek.fail = true;
    await createGroup({
      name: 'combo-alldown',
      strategy: 'priority',
      members: [{ provider: 'openai' }, { provider: 'deepseek' }],
    });
    await expect(
      executeRoute(router, { taskId: 't3', description: 'x', provider: 'combo-alldown' }, 'hello'),
    ).rejects.toThrow(/exhausted 2 member/);
  });

  it('fails fast on non-retryable errors (400 invalid request)', async () => {
    const { router } = makeRouter();
    class BadProvider extends MockProvider {
      override async generate(): Promise<{
        message: string;
        provider: string;
        model: string;
        usage: { inputTokens: number; outputTokens: number; totalTokens: number };
        cost: number;
        latencyMs: number;
        cached: boolean;
      }> {
        throw new Error('400 Bad Request: invalid api key');
      }
    }
    const bad = new BadProvider('bad-prov', {
      m1: {
        name: 'm1',
        provider: 'bad-prov',
        pricing: { inputCostPerMillion: 1, outputCostPerMillion: 1 },
        capabilities: ['reasoning'],
        complexityRating: 'medium',
      },
    });
    router.registerProvider(bad);
    await createGroup({
      name: 'combo-badreq',
      strategy: 'priority',
      members: [{ provider: 'bad-prov' }, { provider: 'openai' }],
    });
    await expect(
      executeRoute(router, { taskId: 't4', description: 'x', provider: 'combo-badreq' }, 'hello'),
    ).rejects.toThrow(/400 Bad Request/);
  });

  it('round-robin rotates the starting member', async () => {
    const { router } = makeRouter();
    await createGroup({
      name: 'combo-rr-test',
      strategy: 'round-robin',
      members: [{ provider: 'openai' }, { provider: 'deepseek' }],
    });
    const first = await executeRoute(
      router,
      { taskId: 'rr1', description: 'x', provider: 'combo-rr-test' },
      'hello',
    );
    const second = await executeRoute(
      router,
      { taskId: 'rr2', description: 'x', provider: 'combo-rr-test' },
      'hello',
    );
    expect(first.provider).not.toBe(second.provider);
  });
});

describe('isRetryableError', () => {
  it('classifies retryable errors', () => {
    expect(isRetryableError(new Error('HTTP 429 Too Many Requests'))).toBe(true);
    expect(isRetryableError(new Error('HTTP 503 Service Unavailable'))).toBe(true);
    expect(isRetryableError(new Error('fetch failed: ETIMEDOUT'))).toBe(true);
    expect(isRetryableError(new Error('ECONNREFUSED'))).toBe(true);
  });
  it('classifies non-retryable errors', () => {
    expect(isRetryableError(new Error('400 Bad Request: invalid api key'))).toBe(false);
    expect(isRetryableError(new Error('401 Unauthorized'))).toBe(false);
  });
});
