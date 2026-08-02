import type { RouteRequest, LLMProvider, ModelMetadata, LLMResponse } from './types.js';
import { LLMCacheManager } from './cache-manager.js';
import { llmMetrics, alertManager, healthChecker } from '@agent-xai/observability';

export class LLMRouter {
  private providers: Map<string, LLMProvider> = new Map();
  private models: Map<string, ModelMetadata> = new Map();
  private cacheManager: LLMCacheManager;
  private fallbackChain: string[] = [];

  constructor() {
    this.cacheManager = new LLMCacheManager();
    // Build fallback chain from env vars
    const defaultProvider = process.env.LLM_PROVIDER_DEFAULT || 'openai';
    const fallbackProvider = process.env.LLM_PROVIDER_FALLBACK || 'deepseek';
    const backupProvider = process.env.LLM_PROVIDER_BACKUP || 'qwen';
    this.fallbackChain = [defaultProvider, fallbackProvider, backupProvider].filter(
      (v, i, arr) => arr.indexOf(v) === i,
    );

    // Track active providers
    llmMetrics.setActiveProviders(this.providers.size);
  }

  registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
    for (const [modelId, metadata] of Object.entries(provider.models)) {
      this.models.set(`${provider.name}:${modelId}`, metadata);
    }
    llmMetrics.setActiveProviders(this.providers.size);
    llmMetrics.setProviderHealth(provider.name, true);
    healthChecker.registerProvider(provider.name, 'healthy');
  }

  selectBestModel(req: RouteRequest): string {
    const complexity = req.complexity || 'medium';
    const budget = req.budget || 'medium';
    const type = req.type || 'reasoning';

    // Safety fallback
    if (req.security === 'confidential') {
      return 'local:llama-3-8b';
    }

    if (budget === 'low') {
      return 'deepseek:deepseek-v3';
    }

    if (type === 'code') {
      if (complexity === 'simple') return 'anthropic:claude-3-haiku-20240307';
      if (complexity === 'complex' || complexity === 'expert')
        return 'anthropic:claude-3-7-sonnet-20250219';
      return 'anthropic:claude-3-5-sonnet-20241022';
    }

    if (complexity === 'expert') {
      return 'openai:o1-preview';
    } else if (complexity === 'complex') {
      return 'openai:gpt-4o';
    } else if (complexity === 'simple') {
      return 'openai:gpt-4o-mini';
    }

    return 'deepseek:deepseek-v3';
  }

  async execute(req: RouteRequest, prompt: string): Promise<LLMResponse> {
    // 1. Check cache first
    const cachedResponse = await this.cacheManager.getCached(req, prompt);
    if (cachedResponse) {
      llmMetrics.recordCacheHit('cache', 'all');
      return cachedResponse;
    }

    // 2. Select Model
    const selectedModelStr = this.selectBestModel(req);
    const parts = selectedModelStr.split(':');
    if (parts.length < 2) {
      throw new Error(`Invalid model resolution result: ${selectedModelStr}`);
    }
    const providerName: string = parts[0] as string;
    const modelId: string = parts[1] as string;
    const complexity: string = req.complexity || 'medium';

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found or not registered.`);
    }

    // 3. Execute with metrics and auto-fallback
    const startTime = performance.now();

    try {
      const response = await provider.generate(modelId, prompt, req);
      const latency = (performance.now() - startTime) / 1000;

      // Record success metrics
      llmMetrics.recordRequest(providerName, modelId, complexity, 'success');
      llmMetrics.recordLatency(providerName, modelId, latency);
      llmMetrics.recordTokenUsage(providerName, modelId, 'input', response.usage.inputTokens);
      llmMetrics.recordTokenUsage(providerName, modelId, 'output', response.usage.outputTokens);
      llmMetrics.recordCost(providerName, modelId, response.cost);
      llmMetrics.setProviderHealth(providerName, true);

      // 4. Save to cache
      await this.cacheManager.setCache(req, prompt, response);

      return response;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      // Record error metric
      llmMetrics.recordRequest(providerName, modelId, complexity, 'error');
      llmMetrics.recordError(providerName, modelId, errorMsg.slice(0, 50));
      llmMetrics.setProviderHealth(providerName, false);
      healthChecker.registerProvider(providerName, 'unhealthy');

      // Send alert for provider failure
      await alertManager.sendAlert(
        'warning',
        `Provider ${providerName} failed: ${errorMsg.slice(0, 80)}`,
        {
          provider: providerName,
          model: modelId,
          error: errorMsg,
        },
      );

      // Auto-fallback via fallback chain
      const fallbackIndex = this.fallbackChain.indexOf(providerName);
      for (let i = fallbackIndex + 1; i < this.fallbackChain.length; i++) {
        const fallbackName: string = this.fallbackChain[i] as string;
        const fallbackProvider = this.providers.get(fallbackName);
        if (!fallbackProvider) continue;

        // Pick the cheapest model the fallback provider actually offers.
        // (selectBestModel resolves to a GLOBAL provider:model string that may
        // not exist on the fallback provider — resolve per-provider instead.)
        const fbCandidate = Object.entries(fallbackProvider.models).sort(
          (a, b) =>
            a[1].pricing.inputCostPerMillion +
            a[1].pricing.outputCostPerMillion -
            (b[1].pricing.inputCostPerMillion + b[1].pricing.outputCostPerMillion),
        )[0];
        const fbModel: string = fbCandidate?.[0] ?? 'default';

        try {
          const fbStart = performance.now();
          const fbResponse = await fallbackProvider.generate(fbModel, prompt, req);
          const fbLatency = (performance.now() - fbStart) / 1000;

          llmMetrics.recordFallback(providerName, fallbackName, errorMsg.slice(0, 40));
          llmMetrics.recordRequest(fallbackName, fbModel, complexity, 'success');
          llmMetrics.recordLatency(fallbackName, fbModel, fbLatency);
          llmMetrics.setProviderHealth(fallbackName, true);

          await this.cacheManager.setCache(req, prompt, fbResponse);
          return fbResponse;
        } catch {
          llmMetrics.recordError(fallbackName, fbModel, 'fallback_failed');
          llmMetrics.setProviderHealth(fallbackName, false);
          continue;
        }
      }

      // All fallbacks exhausted — re-throw original error
      throw err;
    }
  }
}
