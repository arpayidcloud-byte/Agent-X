/**
 * @module llm-router/router-resilience.test
 * @description Regression tests for behaviors uncovered by the performance
 * benchmark (2026-07-31):
 *   1. Fallback chain actually produces a response when the primary provider
 *      is DOWN (previously broken: fallback model was resolved globally).
 *   2. expert complexity resolves to o1-preview (mock completeness).
 *   3. code type resolves to models that exist on AnthropicMock.
 */

import { describe, it, expect } from 'vitest';
import { LLMRouter, MockProvider, DeepSeekMock, OpenAIMock, AnthropicMock } from '../index.js';
import type { LLMResponse, RouteRequest } from '../types.js';

class FailingProvider extends MockProvider {
  constructor(name: string, models: MockProvider['models']) {
    super(name, models);
  }
  override async generate(): Promise<LLMResponse> {
    throw new Error(`[test] ${this.name} is DOWN`);
  }
}

const PROMPT = 'Write a TypeScript CSV parser. '.repeat(60);

describe('Router resilience (benchmark findings)', () => {
  it('falls back to another provider when the primary is DOWN', async () => {
    const down = new FailingProvider('openai', OpenAIMock.models);
    const router = new LLMRouter();
    router.registerProvider(down);
    router.registerProvider(DeepSeekMock);
    router.registerProvider(AnthropicMock);

    // complexity=complex routes to openai:gpt-4o (primary, DOWN) → must fall back.
    const res = await router.execute(
      { taskId: 'r1', description: 'x', complexity: 'complex' },
      PROMPT,
    );

    expect(res.provider).not.toBe('openai');
    expect(res.message.length).toBeGreaterThan(0);
  });

  it('falls back with a model that exists on the fallback provider', async () => {
    const down = new FailingProvider('openai', OpenAIMock.models);
    const router = new LLMRouter();
    router.registerProvider(down);
    router.registerProvider(DeepSeekMock);

    const res = await router.execute(
      { taskId: 'r2', description: 'x', complexity: 'complex' },
      PROMPT,
    );

    expect(res.provider).toBe('deepseek');
    expect(res.model).toBe('deepseek-v3'); // cheapest model deepseek offers
  });

  it('fails through the whole chain only when every provider is DOWN', async () => {
    const down1 = new FailingProvider('openai', OpenAIMock.models);
    const down2 = new FailingProvider('deepseek', DeepSeekMock.models);
    const router = new LLMRouter();
    router.registerProvider(down1);
    router.registerProvider(down2);

    await expect(
      router.execute({ taskId: 'r3', description: 'x', complexity: 'complex' }, PROMPT),
    ).rejects.toThrow(/DOWN/);
  });

  it('resolves expert complexity to an existing model (o1-preview)', async () => {
    const router = new LLMRouter();
    router.registerProvider(OpenAIMock);
    router.registerProvider(DeepSeekMock);

    const model = router.selectBestModel({
      taskId: 'r4',
      description: 'x',
      complexity: 'expert',
    });
    expect(model).toBe('openai:o1-preview');

    const res = await router.execute(
      { taskId: 'r5', description: 'x', complexity: 'expert' },
      PROMPT,
    );
    expect(res.model).toBe('o1-preview');
  });

  it('resolves code-type requests to models present on AnthropicMock', async () => {
    const router = new LLMRouter();
    router.registerProvider(OpenAIMock);
    router.registerProvider(AnthropicMock);

    const tiers: Array<{ complexity: RouteRequest['complexity']; expected: string }> = [
      { complexity: 'simple', expected: 'claude-3-haiku-20240307' },
      { complexity: 'medium', expected: 'claude-3-5-sonnet-20241022' },
      { complexity: 'complex', expected: 'claude-3-7-sonnet-20250219' },
    ];
    for (const { complexity, expected } of tiers) {
      const model = router.selectBestModel({
        taskId: 'r6',
        description: 'x',
        type: 'code',
        complexity,
      });
      expect(model).toBe(`anthropic:${expected}`);

      const res = await router.execute(
        { taskId: `r6-${complexity}`, description: 'x', type: 'code', complexity },
        PROMPT,
      );
      expect(res.model).toBe(expected);
    }
  });
});
