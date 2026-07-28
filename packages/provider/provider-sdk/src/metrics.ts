import type { ProviderMetrics, ModelMetadata, TokenUsage } from './interfaces.js';

const PRICING_TABLE: Record<string, ModelMetadata> = {
  'anthropic:claude-3-opus': {
    providerId: 'anthropic',
    modelId: 'claude-3-opus-20240229',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    inputCostPer1k: 0.015,
    outputCostPer1k: 0.075,
  },
  'anthropic:claude-3-sonnet': {
    providerId: 'anthropic',
    modelId: 'claude-3-sonnet-20240229',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    inputCostPer1k: 0.003,
    outputCostPer1k: 0.015,
  },
  'anthropic:claude-3-haiku': {
    providerId: 'anthropic',
    modelId: 'claude-3-haiku-20240307',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    inputCostPer1k: 0.00025,
    outputCostPer1k: 0.00125,
  },
  'google:gemini-pro': {
    providerId: 'google',
    modelId: 'gemini-pro',
    contextWindow: 32768,
    maxOutputTokens: 2048,
    inputCostPer1k: 0.00025,
    outputCostPer1k: 0.0005,
  },
  'google:gemini-1.5-pro': {
    providerId: 'google',
    modelId: 'gemini-1.5-pro',
    contextWindow: 2000000,
    maxOutputTokens: 8192,
    inputCostPer1k: 0.00125,
    outputCostPer1k: 0.005,
  },
};

export class CostCalculator {
  private pricingTable: Record<string, ModelMetadata>;

  constructor(customPricing?: Record<string, ModelMetadata>) {
    this.pricingTable = customPricing || PRICING_TABLE;
  }

  public getModelMetadata(providerId: string, modelId: string): ModelMetadata | undefined {
    const key = `${providerId}:${modelId}`;
    if (this.pricingTable[key]) {
      return this.pricingTable[key];
    }
    // Try to find any model for the provider
    for (const [k, v] of Object.entries(this.pricingTable)) {
      if (k.startsWith(`${providerId}:`) && v.modelId === modelId) {
        return v;
      }
    }
    return undefined;
  }

  public calculateCost(providerId: string, modelId: string, usage: TokenUsage): number {
    const meta = this.getModelMetadata(providerId, modelId);
    if (!meta) {
      return 0;
    }
    const inputCost = (usage.inputTokens / 1000) * meta.inputCostPer1k;
    const outputCost = (usage.outputTokens / 1000) * meta.outputCostPer1k;
    return Math.round((inputCost + outputCost) * 1000000) / 1000000; // 6 decimal places
  }

  public createMetrics(
    traceId: string | undefined,
    requestId: string,
    providerId: string,
    modelId: string,
    latencyMs: number,
    usage: TokenUsage,
  ): ProviderMetrics {
    return {
      traceId,
      requestId,
      providerId,
      modelId,
      latencyMs,
      tokenUsage: usage,
      estimatedCostUsd: this.calculateCost(providerId, modelId, usage),
    };
  }
}
