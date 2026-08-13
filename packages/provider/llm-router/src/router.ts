import type { RouteRequest, LLMProvider, ModelMetadata, LLMResponse } from './types.js';
import { LLMCacheManager } from './cache-manager.js';
import { llmMetrics, alertManager, healthChecker } from '@agent-xai/observability';
import {
  pickCheapestAdequate,
  pickCheapestOverall,
  requiredCapabilities,
  resolveComplexityFloor,
} from './cost-model.js';

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

  /** Return a registered provider by name (undefined if not registered). */
  getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  /** Names of all registered providers (for combo member validation). */
  listProviderNames(): string[] {
    return [...this.providers.keys()];
  }

  /**
   * Cost-aware model selection (roadmap OKR: 70% cost reduction).
   *
   * Strategy — pick the CHEAPEST ADEQUATE model across every registered
   * provider instead of hard-coded provider:model strings:
   * - `security: confidential` → local model when a `local` provider is
   *   registered, otherwise the cheapest registered model (data never
   *   leaves the box only when a local provider exists; cheapest otherwise).
   * - `budget: low` → cheapest registered model overall.
   * - otherwise → cheapest model meeting the complexity floor (expert maps
   *   to the strongest tier that exists) + capabilities required by `type`
   *   (code → `code`, reasoning/analysis → `reasoning`).
   * - `budget: high`/`unlimited` → strongest tier (complex), still cheapest
   *   within it.
   */
  selectBestModel(req: RouteRequest): string {
    // Explicit pinning: req.provider (or req.model "provider:model") wins.
    // Combo providers rely on this — the combo layer resolves a group name
    // to a concrete member and pins it per attempt.
    if (req.model) {
      if (!req.model.includes(':')) {
        throw new Error(
          `Invalid model resolution result: ${req.model} — expected "provider:model"`,
        );
      }
      const [p, m] = req.model.split(':') as [string, string];
      if (this.providers.has(p) && this.providers.get(p)!.models[m]) {
        return req.model;
      }
      throw new Error(`Model ${req.model} not registered.`);
    }
    if (req.provider) {
      const pinned = this.providers.get(req.provider);
      if (!pinned) {
        throw new Error(`Provider ${req.provider} not found or not registered.`);
      }
      const pinnedModels = new Map<string, ModelMetadata>(
        Object.entries(pinned.models).map(([modelId, meta]) => [`${pinned.name}:${modelId}`, meta]),
      );
      const floor = resolveComplexityFloor(req);
      const caps = requiredCapabilities(req.type);
      const cheapest = pickCheapestAdequate(pinnedModels, {
        complexityFloor: floor,
        capabilities: caps,
      });
      if (cheapest) return `${cheapest.provider}:${cheapest.model}`;
      // Provider has no adequate model — fall back to its cheapest any.
      const any = pickCheapestOverall(pinnedModels);
      if (any) return `${any.provider}:${any.model}`;
      throw new Error(`Provider ${req.provider} has no registered models.`);
    }

    // Confidential data: prefer on-device inference; fall back to the
    // cheapest registered model if no local provider is available.
    if (req.security === 'confidential') {
      if (this.providers.has('local')) return 'local:llama-3-8b';
      const cheapest = pickCheapestOverall(this.models);
      if (cheapest) return `${cheapest.provider}:${cheapest.model}`;
      return 'deepseek:deepseek-v3';
    }

    if (req.budget === 'low') {
      const cheapest = pickCheapestOverall(this.models);
      if (cheapest) return `${cheapest.provider}:${cheapest.model}`;
      return 'deepseek:deepseek-v3';
    }

    const floor = resolveComplexityFloor(req);
    const caps = requiredCapabilities(req.type);
    const chosen = pickCheapestAdequate(this.models, {
      complexityFloor: floor,
      capabilities: caps,
    });
    if (chosen) return `${chosen.provider}:${chosen.model}`;

    // No model meets the floor/capabilities — last resort: cheapest overall.
    const any = pickCheapestOverall(this.models);
    return any ? `${any.provider}:${any.model}` : 'deepseek:deepseek-v3';
  }

  async execute(req: RouteRequest, prompt: string): Promise<LLMResponse> {
    // 1. Check cache first
    const cachedResponse = await this.cacheManager.getCached(req, prompt);
    if (cachedResponse) {
      llmMetrics.recordCacheHit('cache', 'all', req.context?.orgId);
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
    const orgId = req.context?.orgId;
    llmMetrics.setActiveProviders(this.providers.size, orgId);

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
      llmMetrics.recordRequest(providerName, modelId, complexity, 'success', orgId);
      llmMetrics.recordLatency(providerName, modelId, latency, orgId);
      llmMetrics.recordTokenUsage(
        providerName,
        modelId,
        'input',
        response.usage.inputTokens,
        orgId,
      );
      llmMetrics.recordTokenUsage(
        providerName,
        modelId,
        'output',
        response.usage.outputTokens,
        orgId,
      );
      llmMetrics.recordCost(providerName, modelId, response.cost, orgId);
      llmMetrics.setProviderHealth(providerName, true, orgId);

      // 4. Save to cache
      await this.cacheManager.setCache(req, prompt, response);

      return response;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      // Record error metric
      llmMetrics.recordRequest(providerName, modelId, complexity, 'error', orgId);
      llmMetrics.recordError(providerName, modelId, errorMsg.slice(0, 50), orgId);
      llmMetrics.setProviderHealth(providerName, false, orgId);
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

      // Auto-fallback via fallback chain (skip when _noFallback — combo layer handles failover)
      const fallbackIndex = (req as { _noFallback?: boolean })._noFallback
        ? this.fallbackChain.length // skip: effectively "no fallbacks available"
        : this.fallbackChain.indexOf(providerName);
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

          llmMetrics.recordFallback(providerName, fallbackName, errorMsg.slice(0, 40), orgId);
          llmMetrics.recordRequest(fallbackName, fbModel, complexity, 'success', orgId);
          llmMetrics.recordLatency(fallbackName, fbModel, fbLatency, orgId);
          llmMetrics.setProviderHealth(fallbackName, true, orgId);

          await this.cacheManager.setCache(req, prompt, fbResponse);
          return fbResponse;
        } catch {
          llmMetrics.recordError(fallbackName, fbModel, 'fallback_failed', orgId);
          llmMetrics.setProviderHealth(fallbackName, false, orgId);
          continue;
        }
      }

      // All fallbacks exhausted — re-throw original error
      throw err;
    }
  }
}
