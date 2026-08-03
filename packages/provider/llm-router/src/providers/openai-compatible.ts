import type { LLMProvider, ModelMetadata, LLMResponse, RouteRequest } from '../types.js';

// ─── OpenAI-Compatible HTTP Provider ────
export class OpenAICompatibleProvider implements LLMProvider {
  name: string;
  models: Record<string, ModelMetadata>;
  private apiKey: string;
  private endpoint: string;

  constructor(
    name: string,
    models: Record<string, ModelMetadata>,
    config?: { apiKey?: string; endpoint?: string },
  ) {
    this.name = name;
    this.models = models;

    // Read from env vars with fallback (config override wins for
    // admin-managed providers registered at runtime from the DB).
    this.apiKey =
      config?.apiKey ||
      process.env[
        `${name.toUpperCase()}${name === 'openai' ? '_API_KEY' : '_COMPATIBLE_API_KEY'}`
      ] ||
      process.env.OPENAI_COMPATIBLE_API_KEY ||
      'sk-mock-key';

    this.endpoint =
      config?.endpoint ||
      process.env[
        `${name.toUpperCase()}${name === 'openai' ? '_ENDPOINT' : '_COMPATIBLE_ENDPOINT'}`
      ] ||
      process.env.OPENAI_COMPATIBLE_ENDPOINT ||
      'https://api.openai.com/v1';
  }

  async generate(model: string, prompt: string, _options?: RouteRequest): Promise<LLMResponse> {
    const modelMeta = this.models[model];
    if (!modelMeta) {
      throw new Error(`Model ${model} not supported by provider ${this.name}`);
    }

    // Mock fallback if no real API key set
    if (!this.apiKey || this.apiKey === 'sk-mock-key') {
      return this.mockGenerate(model, modelMeta, prompt);
    }

    try {
      const response = await fetch(`${this.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
        choices: { message: { content: string } }[];
      };

      const inputTokens = data.usage.prompt_tokens || Math.floor(prompt.length / 4);
      const outputTokens = data.usage.completion_tokens || 100;
      const cost =
        (inputTokens / 1_000_000) * modelMeta.pricing.inputCostPerMillion +
        (outputTokens / 1_000_000) * modelMeta.pricing.outputCostPerMillion;

      return {
        message: data.choices[0]?.message?.content || '[EMPTY]',
        provider: this.name,
        model,
        usage: { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens },
        cost,
        latencyMs: 0,
        cached: false,
      };
    } catch (error) {
      // Fallback to mock on any network error
      return this.mockGenerate(model, modelMeta, prompt);
    }
  }

  private mockGenerate(model: string, modelMeta: ModelMetadata, prompt: string): LLMResponse {
    const inputTokens = Math.floor(prompt.length / 4);
    const outputTokens = 100;
    const cost =
      (inputTokens / 1_000_000) * modelMeta.pricing.inputCostPerMillion +
      (outputTokens / 1_000_000) * modelMeta.pricing.outputCostPerMillion;

    return {
      message: `[MOCK] ${this.name} via ${this.endpoint} using ${model}.`,
      provider: this.name,
      model,
      usage: { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens },
      cost,
      latencyMs: 500,
      cached: false,
    };
  }
}

// ─── Anthropic-Compatible HTTP Provider ────
export class AnthropicCompatibleProvider implements LLMProvider {
  name: string;
  models: Record<string, ModelMetadata>;
  private apiKey: string;
  private endpoint: string;

  constructor(
    name: string,
    models: Record<string, ModelMetadata>,
    config?: { apiKey?: string; endpoint?: string },
  ) {
    this.name = name;
    this.models = models;

    this.apiKey =
      config?.apiKey ||
      process.env[
        `${name.toUpperCase()}${name === 'anthropic' ? '_API_KEY' : '_COMPATIBLE_API_KEY'}`
      ] ||
      process.env.ANTHROPIC_COMPATIBLE_API_KEY ||
      'sk-ant-mock-key';

    this.endpoint =
      config?.endpoint ||
      process.env[
        `${name.toUpperCase()}${name === 'anthropic' ? '_ENDPOINT' : '_COMPATIBLE_ENDPOINT'}`
      ] ||
      process.env.ANTHROPIC_COMPATIBLE_ENDPOINT ||
      'https://api.anthropic.com/v1';
  }

  async generate(model: string, prompt: string, _options?: RouteRequest): Promise<LLMResponse> {
    const modelMeta = this.models[model];
    if (!modelMeta) {
      throw new Error(`Model ${model} not supported by provider ${this.name}`);
    }

    if (!this.apiKey || this.apiKey === 'sk-ant-mock-key') {
      return this.mockGenerate(model, modelMeta, prompt);
    }

    try {
      const response = await fetch(`${this.endpoint}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        usage: { input_tokens: number; output_tokens: number };
        content: { text: string }[];
      };

      const inputTokens = data.usage.input_tokens || Math.floor(prompt.length / 4);
      const outputTokens = data.usage.output_tokens || 100;
      const cost =
        (inputTokens / 1_000_000) * modelMeta.pricing.inputCostPerMillion +
        (outputTokens / 1_000_000) * modelMeta.pricing.outputCostPerMillion;

      return {
        message: data.content[0]?.text || '[EMPTY]',
        provider: this.name,
        model,
        usage: { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens },
        cost,
        latencyMs: 0,
        cached: false,
      };
    } catch (_error) {
      return this.mockGenerate(model, modelMeta, prompt);
    }
  }

  private mockGenerate(model: string, modelMeta: ModelMetadata, prompt: string): LLMResponse {
    const inputTokens = Math.floor(prompt.length / 4);
    const outputTokens = 100;
    const cost =
      (inputTokens / 1_000_000) * modelMeta.pricing.inputCostPerMillion +
      (outputTokens / 1_000_000) * modelMeta.pricing.outputCostPerMillion;

    return {
      message: `[MOCK] ${this.name} via ${this.endpoint} using ${model}.`,
      provider: this.name,
      model,
      usage: { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens },
      cost,
      latencyMs: 500,
      cached: false,
    };
  }
}

// ─── Pre-configured instances ────

export const DeepSeekProvider = new OpenAICompatibleProvider('deepseek', {
  'deepseek-v3': {
    name: 'DeepSeek-V3',
    provider: 'deepseek',
    pricing: { inputCostPerMillion: 0.1, outputCostPerMillion: 0.1 },
    capabilities: ['code', 'reasoning', 'fast'],
    complexityRating: 'medium',
    apiKeyEnvVar: 'DEEPSEEK_API_KEY',
  },
});

export const OpenAIProvider = new OpenAICompatibleProvider('openai', {
  'gpt-4o': {
    name: 'GPT-4 Omni',
    provider: 'openai',
    pricing: { inputCostPerMillion: 5.0, outputCostPerMillion: 15.0 },
    capabilities: ['code', 'reasoning', 'vision'],
    complexityRating: 'complex',
    apiKeyEnvVar: 'OPENAI_API_KEY',
  },
  'gpt-4o-mini': {
    name: 'GPT-4 Omni Mini',
    provider: 'openai',
    pricing: { inputCostPerMillion: 0.15, outputCostPerMillion: 0.6 },
    capabilities: ['reasoning', 'fast'],
    complexityRating: 'simple',
    apiKeyEnvVar: 'OPENAI_API_KEY',
  },
});

export const AnthropicProvider = new AnthropicCompatibleProvider('anthropic', {
  'claude-3-7-sonnet-20250219': {
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    pricing: { inputCostPerMillion: 3.0, outputCostPerMillion: 15.0 },
    capabilities: ['code', 'reasoning', 'vision'],
    complexityRating: 'complex',
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    pricing: { inputCostPerMillion: 0.25, outputCostPerMillion: 1.25 },
    capabilities: ['code', 'reasoning', 'fast'],
    complexityRating: 'simple',
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
  },
});

export const QwenProvider = new OpenAICompatibleProvider('qwen', {
  'qwen-max': {
    name: 'Qwen Max',
    provider: 'qwen',
    pricing: { inputCostPerMillion: 0.5, outputCostPerMillion: 1.0 },
    capabilities: ['code', 'reasoning'],
    complexityRating: 'complex',
    apiKeyEnvVar: 'QWEN_API_KEY',
  },
  'qwen-plus': {
    name: 'Qwen Plus',
    provider: 'qwen',
    pricing: { inputCostPerMillion: 0.2, outputCostPerMillion: 0.8 },
    capabilities: ['reasoning', 'fast'],
    complexityRating: 'medium',
    apiKeyEnvVar: 'QWEN_API_KEY',
  },
});

// ─── OpenRouter (Generic OpenAI-Compatible) ────
export const OpenRouterProvider = new OpenAICompatibleProvider('openrouter', {
  'openrouter/auto': {
    name: 'OpenRouter Auto',
    provider: 'openrouter',
    pricing: { inputCostPerMillion: 0, outputCostPerMillion: 0 },
    capabilities: ['code', 'reasoning'],
    complexityRating: 'medium',
    apiKeyEnvVar: 'OPENAI_COMPATIBLE_API_KEY',
    endpoint: process.env.OPENAI_COMPATIBLE_ENDPOINT || 'https://api.openrouter.ai/v1',
  },
});
