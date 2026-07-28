/**
 * @module native-providers/providers/ollama-provider
 * @description Native Ollama local model provider integration adapter.
 */

import type {
  IConfigurationProvider,
  INativeProvider,
  CompletionOptions,
  CompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
} from '../interfaces.js';
import { ConfigurationError } from '../errors.js';

export class OllamaProvider implements INativeProvider {
  id = 'ollama';
  name = 'Ollama Local Provider';
  private connected = false;
  private config!: IConfigurationProvider;

  async initialize(config: IConfigurationProvider): Promise<void> {
    this.config = config;
    if (!this.config.has('OLLAMA_BASE_URL')) {
      throw new ConfigurationError('OLLAMA_BASE_URL is required', this.id);
    }
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getHealth(): Promise<{ status: 'UP' | 'DOWN' | 'DEGRADED'; latencyMs: number }> {
    return { status: this.connected ? 'UP' : 'DOWN', latencyMs: 5 };
  }

  getMetadata() {
    return { id: this.id, name: this.name, type: 'llm' as const, version: '1.0.0' };
  }

  async complete(options: CompletionOptions): Promise<CompletionResponse> {
    if (!this.connected) throw new Error('Not connected');
    return {
      id: `ollama-${Date.now()}`,
      content: `Stub response for ${options.model}`,
      finishReason: 'stop',
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    };
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return {
      embeddings: Array.isArray(request.input)
        ? request.input.map(() => Array(384).fill(0) as number[])
        : [Array(384).fill(0) as number[]],
      model: request.model,
      usage: { promptTokens: 10, totalTokens: 10 },
    };
  }
}
