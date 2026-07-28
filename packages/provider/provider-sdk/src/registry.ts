import type {
  Provider,
  ProviderFailoverPolicy,
  CompletionRequest,
  CompletionResponse,
} from './interfaces.js';
import {
  CircuitBreakerOpenError,
  ProviderError,
  ProviderTimeoutError,
  ProviderRateLimitError,
} from './errors.js';

export class ProviderRegistry {
  private providers = new Map<string, Provider>();
  private failoverPolicies: ProviderFailoverPolicy[] = [];

  public register(provider: Provider): void {
    this.providers.set(provider.id, provider);
  }

  public registerFailoverPolicy(policy: ProviderFailoverPolicy): void {
    this.failoverPolicies.push(policy);
  }

  public get(providerId: string): Provider | undefined {
    return this.providers.get(providerId);
  }

  public list(): Provider[] {
    return Array.from(this.providers.values());
  }

  public async complete(providerId: string, req: CompletionRequest): Promise<CompletionResponse> {
    const provider = this.get(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }

    try {
      return await provider.complete(req);
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));

      // Check failover
      const policy = this.failoverPolicies.find((p) => p.primaryProviderId === providerId);
      if (policy) {
        let shouldFailover = false;
        if (policy.onCondition === 'timeout' && error instanceof ProviderTimeoutError)
          shouldFailover = true;
        if (policy.onCondition === 'rate_limit' && error instanceof ProviderRateLimitError)
          shouldFailover = true;
        if (policy.onCondition === 'error' && error instanceof ProviderError) shouldFailover = true;
        if (error instanceof CircuitBreakerOpenError) shouldFailover = true;

        if (shouldFailover) {
          const secondary = this.get(policy.secondaryProviderId);
          if (secondary) {
            return await secondary.complete(req);
          }
        }
      }

      throw error;
    }
  }
}
