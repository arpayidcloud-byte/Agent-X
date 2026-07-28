/**
 * @module provider-sdk/provider-builder
 * @description Provider creation and validation builder.
 */

import type { IProvider } from '@agentx-fast/runtime-adapters';
import type { ProviderConfiguration } from './interfaces.js';

export class ProviderBuilder<T extends IProvider> {
  private provider!: T;
  private config: ProviderConfiguration = {};

  create(provider: T): this {
    this.provider = provider;
    return this;
  }

  configure(config: ProviderConfiguration): this {
    this.config = config;
    return this;
  }

  getConfig(): ProviderConfiguration {
    return this.config;
  }

  async validate(): Promise<boolean> {
    if (!this.provider) throw new Error('No provider to validate');
    const meta = this.provider.getMetadata();
    if (!meta.id || !meta.name || !meta.type) {
      throw new Error('Invalid provider metadata');
    }
    return true;
  }

  build(): T {
    if (!this.provider) throw new Error('No provider built');
    return this.provider;
  }

  getMetadata() {
    return this.provider.getMetadata();
  }
}
