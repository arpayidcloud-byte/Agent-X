import { RouteRequest, LLMProvider, ModelMetadata } from './types.js';

export class LLMRouter {
  private providers: Map<string, LLMProvider> = new Map();
  private models: Map<string, ModelMetadata> = new Map();

  registerProvider(provider: LLMProvider) {
    this.providers.set(provider.name, provider);
    for (const [modelId, metadata] of Object.entries(provider.models)) {
      this.models.set(`${provider.name}:${modelId}`, metadata);
    }
  }

  // Very basic smart routing logic based on the Startup-Book strategy.
  selectBestModel(req: RouteRequest): string {
    const complexity = req.complexity || 'medium';
    const budget = req.budget || 'medium';
    const type = req.type || 'reasoning';
    
    // Safety fallback
    if (req.security === 'confidential') {
      // Return a self-hosted or strictly confidential model if we had one
      // Defaulting to a placeholder for local architecture
      return 'local:llama-3-8b';
    }

    if (budget === 'low') {
      return 'deepseek:deepseek-v3';
    }

    if (type === 'code') {
      if (complexity === 'simple') return 'anthropic:claude-3-haiku-20240307';
      if (complexity === 'complex' || complexity === 'expert') return 'anthropic:claude-3-7-sonnet-20250219';
      return 'anthropic:claude-3-5-sonnet-20241022';
    }

    if (complexity === 'expert') {
      return 'openai:o1-preview';
    } else if (complexity === 'complex') {
      return 'openai:gpt-4o';
    } else if (complexity === 'simple') {
      return 'openai:gpt-4o-mini';
    }

    // Default middle-ground
    return 'deepseek:deepseek-v3'; 
  }

  async execute(req: RouteRequest, prompt: string): Promise<any> {
    const selectedModelStr = this.selectBestModel(req);
    const parts = selectedModelStr.split(':');
    const providerName = parts[0];
    const modelId = parts[1];

    if (!providerName || !modelId) {
      throw new Error(`Invalid model resolution result: ${selectedModelStr}`);
    }

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found or not registered.`);
    }

    return await provider.generate(modelId, prompt, req);
  }
}
