export type TaskComplexity = 'simple' | 'medium' | 'complex' | 'expert';
export type TaskType = 'code' | 'reasoning' | 'creative' | 'analysis';
export type UserBudget = 'low' | 'medium' | 'high' | 'unlimited';
export type LatencyPreference = 'fast' | 'normal' | 'slow-ok';
export type SecurityLevel = 'public' | 'internal' | 'confidential';

export interface RouteRequest {
  taskId: string;
  description: string;
  complexity?: TaskComplexity;
  type?: TaskType;
  budget?: UserBudget;
  latency?: LatencyPreference;
  security?: SecurityLevel;
  context?: Record<string, any>;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface LLMResponse {
  message: string;
  provider: string;
  model: string;
  usage: TokenUsage;
  cost: number;
  latencyMs: number;
  cached: boolean;
}

export interface ModelPricing {
  inputCostPerMillion: number;
  outputCostPerMillion: number;
}

export interface ModelMetadata {
  name: string;
  provider: string;
  pricing: ModelPricing;
  capabilities: ('code' | 'reasoning' | 'vision' | 'fast')[];
  complexityRating: TaskComplexity;
}

export interface LLMProvider {
  name: string;
  models: Record<string, ModelMetadata>;
  generate(model: string, prompt: string, options?: any): Promise<LLMResponse>;
}
