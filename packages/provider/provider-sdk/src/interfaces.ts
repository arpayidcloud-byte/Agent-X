export type ProviderId = string;
export type ModelId = string;

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
}

export interface ModelMetadata {
  providerId: ProviderId;
  modelId: ModelId;
  contextWindow: number;
  maxOutputTokens: number;
  inputCostPer1k: number;
  outputCostPer1k: number;
}

export interface ProviderCapabilities {
  completion: boolean;
  chat: boolean;
  embedding: boolean;
  toolUse: boolean;
  streaming: boolean;
  vision: boolean;
}

export interface ProviderConfiguration {
  providerId: ProviderId;
  defaultModelId: ModelId;
  retryPolicy?: RetryPolicy;
  timeoutPolicy?: TimeoutPolicy;
  circuitBreaker?: CircuitBreakerConfig;
}

export interface RetryPolicy {
  maxAttempts: number;
  initialDelayMs: number;
  backoffMultiplier: number;
  maxDelayMs?: number;
}

export interface TimeoutPolicy {
  timeoutMs: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
}

export interface ProviderFailoverPolicy {
  primaryProviderId: ProviderId;
  secondaryProviderId: ProviderId;
  onCondition: 'timeout' | 'error' | 'rate_limit';
}

export interface ProviderStatus {
  providerId: ProviderId;
  health: ProviderHealth;
  lastCheckedAt: Date;
  activeCircuitBreaker: boolean;
}

export type ProviderHealth = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export interface ProviderMetrics {
  traceId?: string;
  requestId: string;
  providerId: ProviderId;
  modelId: ModelId;
  latencyMs: number;
  tokenUsage: TokenUsage;
  estimatedCostUsd: number;
}

export interface NormalizedToolSpec {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
}

export interface NormalizedToolCall {
  toolName: string;
  arguments: Record<string, unknown>;
  callId: string;
}

export interface ToolResult {
  callId: string;
  output: string;
  success: boolean;
  error?: string;
}

export interface CompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  context?: Array<{
    role: 'user' | 'assistant';
    content: string | ToolResult[] | NormalizedToolCall[];
  }>;
  tools?: NormalizedToolSpec[];
  maxTokens?: number;
  modelId?: ModelId;
  temperature?: number;
  traceId?: string;
  cancellationToken?: AbortSignal;
}

export interface CompletionResponse {
  text: string;
  toolCalls: NormalizedToolCall[];
  usage: TokenUsage;
  providerId: ProviderId;
  modelId: ModelId;
  latencyMs: number;
  metrics?: ProviderMetrics;
}

export interface StreamingResponse {
  stream: AsyncIterableIterator<string | NormalizedToolCall>;
  metrics: Promise<ProviderMetrics>;
}

export interface Provider {
  readonly id: ProviderId;
  readonly capabilities: ProviderCapabilities;

  complete(req: CompletionRequest): Promise<CompletionResponse>;
  stream?(req: CompletionRequest): Promise<StreamingResponse>;
  checkHealth(): Promise<ProviderStatus>;
}
