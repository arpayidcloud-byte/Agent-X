/**
 * @module runtime-adapters/provider-registry
 * @description Centralized dependency injection registry for providers.
 */

import type { IProvider, ProviderMetadata, ProviderCapabilities } from './index.js';
import { ProviderUnavailableError, ProviderResolutionError } from './index.js';
import { ProviderCapabilityResolver } from './provider-capability.js';

export class ProviderRegistry {
  private providers = new Map<string, IProvider>();
  private capabilityResolver = new ProviderCapabilityResolver();

  registerProvider(id: string, provider: IProvider): void {
    this.providers.set(id, provider);
  }

  unregisterProvider(id: string): void {
    this.providers.delete(id);
  }

  resolve<T extends IProvider>(id: string): T {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new ProviderResolutionError(`Provider not found: ${id}`, 'registry');
    }
    return provider as T;
  }

  resolveByType<T extends IProvider>(type: string): T {
    const providers = Array.from(this.providers.values()).filter(
      (p) => p.getMetadata().type === type,
    );
    if (providers.length === 0) {
      throw new ProviderResolutionError(`No provider found for type: ${type}`, 'registry');
    }
    return providers[0] as T;
  }

  resolveByCapability<T extends IProvider>(
    requiredCapabilities: Partial<ProviderCapabilities>,
  ): T[] {
    return Array.from(this.providers.values()).filter((provider) => {
      try {
        this.capabilityResolver.validateCapabilities(
          requiredCapabilities,
          provider.getCapabilities(),
        );
        return true;
      } catch {
        return false;
      }
    }) as T[];
  }

  listProviders(): ProviderMetadata[] {
    return Array.from(this.providers.values()).map((p) => p.getMetadata());
  }

  async healthCheck(): Promise<boolean> {
    for (const provider of this.providers.values()) {
      const health = await provider.healthCheck();
      if (!health.healthy) {
        throw new ProviderUnavailableError(
          `Provider ${provider.getMetadata().id} is unhealthy`,
          'registry',
        );
      }
    }
    return true;
  }
}
