/**
 * @module runtime-adapters/provider-failover
 * @description Provider Failover Management abstraction.
 */

import type { IProvider } from './interfaces.js';

export class ProviderFailoverManager {
  private primary: IProvider | null = null;
  private secondary: IProvider | null = null;

  monitorPrimary(provider: IProvider): void {
    this.primary = provider;
  }

  monitorSecondary(provider: IProvider): void {
    this.secondary = provider;
  }

  async switchProvider(): Promise<IProvider> {
    if (this.secondary && this.primary) {
      const temp = this.primary;
      this.primary = this.secondary;
      this.secondary = temp;
      return this.primary;
    }
    throw new Error('Secondary provider not configured for failover');
  }

  async promoteSecondary(): Promise<void> {
    if (this.secondary) {
      this.primary = this.secondary;
      this.secondary = null;
    }
  }

  async rollback(): Promise<void> {
    // Implementation for rollback logic if needed
  }

  async recover(): Promise<void> {
    // Implementation for recovery logic if needed
  }

  getPrimary(): IProvider | null {
    return this.primary;
  }

  getSecondary(): IProvider | null {
    return this.secondary;
  }
}
