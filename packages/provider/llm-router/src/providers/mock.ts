import type { LLMProvider, ModelMetadata, LLMResponse, RouteRequest } from '../types.js';

export class MockProvider implements LLMProvider {
  name: string;
  models: Record<string, ModelMetadata>;

  constructor(name: string, models: Record<string, ModelMetadata>) {
    this.name = name;
    this.models = models;
  }

  async generate(model: string, prompt: string, _options?: RouteRequest): Promise<LLMResponse> {
    const modelMeta = this.models[model];
    if (!modelMeta) {
      throw new Error(`Model ${model} not supported by provider ${this.name}`);
    }

    const inputTokens = Math.floor(prompt.length / 4);
    const outputTokens = 100; // mock
    const cost =
      (inputTokens / 1_000_000) * modelMeta.pricing.inputCostPerMillion +
      (outputTokens / 1_000_000) * modelMeta.pricing.outputCostPerMillion;

    return {
      message: `[MOCK] This is a response from ${this.name} using ${model}.`,
      provider: this.name,
      model,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
      cost,
      latencyMs: 500, // mock
      cached: false,
    };
  }
}

// Pre-configured mock instances matching our cost strategy

export const DeepSeekMock = new MockProvider('deepseek', {
  'deepseek-v3': {
    name: 'DeepSeek-V3',
    provider: 'deepseek',
    pricing: { inputCostPerMillion: 0.1, outputCostPerMillion: 0.1 },
    capabilities: ['code', 'reasoning', 'fast'],
    complexityRating: 'medium',
  },
});

export const OpenAIMock = new MockProvider('openai', {
  'gpt-4o': {
    name: 'GPT-4 Omni',
    provider: 'openai',
    pricing: { inputCostPerMillion: 5.0, outputCostPerMillion: 15.0 },
    capabilities: ['code', 'reasoning', 'vision'],
    complexityRating: 'complex',
  },
  'gpt-4o-mini': {
    name: 'GPT-4 Omni Mini',
    provider: 'openai',
    pricing: { inputCostPerMillion: 0.15, outputCostPerMillion: 0.6 },
    capabilities: ['reasoning', 'fast'],
    complexityRating: 'simple',
  },
  'o1-preview': {
    name: 'OpenAI o1 Preview',
    provider: 'openai',
    pricing: { inputCostPerMillion: 15.0, outputCostPerMillion: 60.0 },
    capabilities: ['reasoning'],
    complexityRating: 'expert',
  },
});

export const AnthropicMock = new MockProvider('anthropic', {
  'claude-3-7-sonnet-20250219': {
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    pricing: { inputCostPerMillion: 3.0, outputCostPerMillion: 15.0 },
    capabilities: ['code', 'reasoning', 'vision'],
    complexityRating: 'complex',
  },
  'claude-3-5-sonnet-20241022': {
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    pricing: { inputCostPerMillion: 3.0, outputCostPerMillion: 15.0 },
    capabilities: ['code', 'reasoning', 'vision'],
    complexityRating: 'medium',
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    pricing: { inputCostPerMillion: 0.25, outputCostPerMillion: 1.25 },
    capabilities: ['code', 'reasoning', 'fast'],
    complexityRating: 'simple',
  },
});

export const QwenMock = new MockProvider('qwen', {
  'qwen-max': {
    name: 'Qwen Max',
    provider: 'qwen',
    pricing: { inputCostPerMillion: 0.5, outputCostPerMillion: 1.0 },
    capabilities: ['code', 'reasoning'],
    complexityRating: 'complex',
  },
  'qwen-plus': {
    name: 'Qwen Plus',
    provider: 'qwen',
    pricing: { inputCostPerMillion: 0.2, outputCostPerMillion: 0.8 },
    capabilities: ['reasoning', 'fast'],
    complexityRating: 'medium',
  },
});
