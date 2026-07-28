import type { CompletionRequest, Provider } from '@agentx-fast/provider-sdk';
import { ProviderRegistry } from '@agentx-fast/provider-sdk';

export interface AgentInput {
  input: string;
  context?: Record<string, unknown>;
  traceId?: string;
}

export interface AgentOutput {
  output: string;
  tokens?: { input: number; output: number };
  model?: string;
}

export abstract class BaseAgent {
  protected providerRegistry: ProviderRegistry;
  protected defaultProviderId: string | null = null;

  constructor() {
    this.providerRegistry = new ProviderRegistry();
  }

  protected setProvider(provider: Provider): void {
    this.providerRegistry.register(provider);
    this.defaultProviderId = provider.id;
  }

  protected async callProvider(
    prompt: string,
    modelId?: string,
  ): Promise<string> {
    if (!this.defaultProviderId) {
      throw new Error('No provider configured');
    }

    const request: CompletionRequest = {
      systemPrompt: '',
      userPrompt: prompt,
      modelId: modelId || 'claude-sonnet-4-20250514',
    };

    const response = await this.providerRegistry.complete(this.defaultProviderId, request);
    return response.text;
  }

  abstract execute(input: AgentInput): Promise<AgentOutput>;
}