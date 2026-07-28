import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AnthropicProvider } from '../src/providers/anthropic/index.js';
import { OpenAIProvider } from '../src/providers/openai/index.js';

describe('Provider Integration Tests', () => {
  describe('AnthropicProvider', () => {
    let provider: AnthropicProvider;

    beforeAll(async () => {
      provider = new AnthropicProvider();
      await provider.initialize();
    });

    afterAll(async () => {
      if (provider.isConnected()) {
        await provider.disconnect();
      }
    });

    it('should initialize successfully', async () => {
      expect(provider).toBeDefined();
    });

    it('should connect to Anthropic API', async () => {
      await provider.connect();
      expect(provider.isConnected()).toBe(true);
    });

    it('should complete a simple prompt', async () => {
      if (!provider.isConnected()) {
        await provider.connect();
      }

      const result = await provider.complete({
        prompt: 'Say hello in one word',
        modelId: 'claude-sonnet-4-20250514',
        maxTokens: 10,
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.usage).toBeDefined();
      expect(result.usage.inputTokens).toBeGreaterThanOrEqual(0);
      expect(result.usage.outputTokens).toBeGreaterThanOrEqual(0);
    }, 30000);

    it('should handle different temperatures', async () => {
      if (!provider.isConnected()) {
        await provider.connect();
      }

      const result1 = await provider.complete({
        prompt: 'Name a color',
        temperature: 0.1,
        maxTokens: 10,
      });

      const result2 = await provider.complete({
        prompt: 'Name a color',
        temperature: 0.9,
        maxTokens: 10,
      });

      expect(result1.content).toBeDefined();
      expect(result2.content).toBeDefined();
    }, 30000);

    it('should get health status', () => {
      const health = provider.getHealth();
      expect(health).toBeDefined();
      expect(typeof health.connected).toBe('boolean');
    });

    it('should get metadata', () => {
      const metadata = provider.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata.provider).toBe('anthropic');
    });
  });

  describe('OpenAIProvider', () => {
    let provider: OpenAIProvider;

    beforeAll(async () => {
      provider = new OpenAIProvider();
      await provider.initialize();
    });

    afterAll(async () => {
      if (provider.isConnected()) {
        await provider.disconnect();
      }
    });

    it('should initialize successfully', async () => {
      expect(provider).toBeDefined();
    });

    it('should connect to OpenAI API', async () => {
      await provider.connect();
      expect(provider.isConnected()).toBe(true);
    });

    it('should complete a simple prompt', async () => {
      if (!provider.isConnected()) {
        await provider.connect();
      }

      const result = await provider.complete({
        prompt: 'Say hello in one word',
        modelId: 'gpt-4o',
        maxTokens: 10,
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.usage).toBeDefined();
    }, 30000);

    it('should get health status', () => {
      const health = provider.getHealth();
      expect(health).toBeDefined();
      expect(typeof health.connected).toBe('boolean');
    });

    it('should get metadata', () => {
      const metadata = provider.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata.provider).toBe('openai');
    });
  });
});
