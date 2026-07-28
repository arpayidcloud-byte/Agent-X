/**
 * @module provider-release/deprecation-manager
 * @description Manages end-of-life and replacement tracking for deprecated versions.
 */

export interface Deprecation {
  version: string;
  deprecatedAt: Date;
  removedAt?: Date;
  replacement?: string;
}

export class DeprecationManager {
  private deprecations = new Map<string, Deprecation>();

  deprecate(version: string, replacement?: string): void {
    this.deprecations.set(version, {
      version,
      deprecatedAt: new Date(),
      replacement,
    });
  }

  getDeprecation(version: string): Deprecation | undefined {
    return this.deprecations.get(version);
  }

  isDeprecated(version: string): boolean {
    return this.deprecations.has(version);
  }

  clear(): void {
    this.deprecations.clear();
  }
}
