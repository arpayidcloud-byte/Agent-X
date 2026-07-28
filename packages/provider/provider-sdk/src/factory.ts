import type {
  Provider,
  ProviderConfiguration,
  ProviderCapabilities,
  ProviderStatus,
} from './interfaces.js';
import { AnthropicProvider } from './providers/anthropic/index.js';
import { GoogleProvider } from './providers/google/index.js';
import type { CredentialResolver } from './conformance/credential-resolver.js';
import type { ProviderRegistry } from './registry.js';

export class ProviderFactory {
  constructor(private readonly credentialResolver: CredentialResolver) {}

  public createProvider(config: ProviderConfiguration): Provider {
    switch (config.providerId) {
      case 'anthropic':
        return new AnthropicProvider({
          ...config,
          credentialResolver: this.credentialResolver,
        });
      case 'google':
        return new GoogleProvider({
          ...config,
          credentialResolver: this.credentialResolver,
        });
      default:
        throw new Error(`Unsupported provider: ${config.providerId}`);
    }
  }
}

export class HealthCheckService {
  constructor(private readonly registry: ProviderRegistry) {}

  public async checkAll(): Promise<Record<string, ProviderStatus>> {
    const results: Record<string, ProviderStatus> = {};
    for (const provider of this.registry.list()) {
      results[provider.id] = await provider.checkHealth();
    }
    return results;
  }
}

export class CapabilityDiscovery {
  public static supports(provider: Provider, capability: keyof ProviderCapabilities): boolean {
    return provider.capabilities[capability];
  }
}

export class ProviderRegistryCache {
  private cache = new Map<string, { status: ProviderStatus; cachedAt: number }>();
  private ttlMs = 60 * 1000; // 1 minute status cache

  public get(providerId: string): ProviderStatus | undefined {
    const entry = this.cache.get(providerId);
    if (entry && Date.now() - entry.cachedAt < this.ttlMs) {
      return entry.status;
    }
    return undefined;
  }

  public set(providerId: string, status: ProviderStatus): void {
    this.cache.set(providerId, { status, cachedAt: Date.now() });
  }

  public invalidate(providerId: string): void {
    this.cache.delete(providerId);
  }

  public clear(): void {
    this.cache.clear();
  }
}
