import { describe, it, expect } from 'vitest';
import { LLMRouter, OpenAIMock, DeepSeekMock, AnthropicMock } from '@agent-xai/llm-router';

describe('Dev mock providers (ENABLE_MOCK_PROVIDER)', () => {
  it('should register all mock providers and serve a request end-to-end', async () => {
    const router = new LLMRouter();
    router.registerProvider(OpenAIMock);
    router.registerProvider(DeepSeekMock);
    router.registerProvider(AnthropicMock);

    const response = await router.execute(
      {
        taskId: 'dev-demo-1',
        description: 'Dev demo request',
        complexity: 'simple',
        type: 'reasoning',
        budget: 'medium',
      },
      'Hello from dev mode',
    );

    expect(response.message).toContain('[MOCK]');
    // Price-aware routing (PR #42): simple complexity picks the cheapest
    // adequate model — deepseek-v3 ($0.10/$0.10) beats gpt-4o-mini.
    expect(response.provider).toBe('deepseek');
    expect(response.model).toBe('deepseek-v3');
    expect(response.usage.totalTokens).toBeGreaterThan(0);
    expect(response.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('should fall back to deepseek when openai mock is not registered', async () => {
    const router = new LLMRouter();
    // Only deepseek registered — budget 'low' routes to deepseek anyway
    router.registerProvider(DeepSeekMock);

    const response = await router.execute(
      {
        taskId: 'dev-demo-2',
        description: 'Fallback demo',
        complexity: 'medium',
        type: 'reasoning',
        budget: 'low',
      },
      'Fallback test',
    );

    expect(response.provider).toBe('deepseek');
  });
});
