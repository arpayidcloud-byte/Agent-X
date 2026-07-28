/**
 * @module native-providers/interfaces
 * @description Abstractions for configuration injection and native provider contracts.
 */

export interface IConfigurationProvider {
  get(key: string): string;
  getOrDefault(key: string, defaultValue: string): string;
  has(key: string): boolean;
}

export interface INativeProvider {
  id: string;
  name: string;
  initialize(config: IConfigurationProvider): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getHealth(): Promise<{ status: 'UP' | 'DOWN' | 'DEGRADED'; latencyMs: number }>;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface ToolDefinition {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface CompletionOptions {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: ToolDefinition[];
}

export interface CompletionResponse {
  id: string;
  content: string;
  finishReason: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface EmbeddingRequest {
  input: string | string[];
  model: string;
}

export interface EmbeddingResponse {
  embeddings: number[][];
  model: string;
  usage: {
    promptTokens: number;
    totalTokens: number;
  };
}
