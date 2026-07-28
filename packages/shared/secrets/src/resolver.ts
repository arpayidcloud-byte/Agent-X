import type { CredentialResolver, CredentialResolverConfig, SecretMetadata } from './interfaces.js';
import type { SecretStore } from './interfaces.js';
import { auditTrail } from './audit-trail.js';
import { SecretNotFoundError, CredentialResolutionError, SecretError } from './errors.js';
import { RedactedString } from './scrubber.js';
import { LRUCache } from 'lru-cache';

export class CachedCredentialResolver implements CredentialResolver {
  private readonly store: SecretStore;
  private readonly config: CredentialResolverConfig;
  private readonly cache: LRUCache<string, string>;
  private readonly negativeCache: Map<string, number>;

  constructor(
    store: SecretStore,
    config: CredentialResolverConfig = { keyMapping: {}, cacheTtlSeconds: 300, enforceNoLog: true },
  ) {
    this.store = store;
    this.config = config;
    this.cache = new LRUCache<string, string>({
      max: 100,
      ttl: config.cacheTtlSeconds * 1000,
    });
    this.negativeCache = new Map();
  }

  async resolve(logicalKey: string): Promise<string> {
    auditTrail(logicalKey, 'resolve');

    const backendKey = this.config.keyMapping[logicalKey] || logicalKey;

    if (this.negativeCache.has(backendKey)) {
      throw new CredentialResolutionError(logicalKey);
    }

    const cached = this.cache.get(backendKey);

    if (cached !== undefined) {
      return cached;
    }

    try {
      const entry = await this.store.get(backendKey);
      this.cache.set(backendKey, entry.value);
      return entry.value;
    } catch (err) {
      if (err instanceof SecretNotFoundError) {
        this.negativeCache.set(backendKey, Date.now() + 60000);
        throw new CredentialResolutionError(logicalKey);
      }
      throw new SecretError(`Failed to resolve secret "${logicalKey}": ${(err as Error).message}`);
    }
  }

  async resolveRedacted(logicalKey: string): Promise<RedactedString> {
    const value = await this.resolve(logicalKey);
    return new RedactedString(value);
  }

  async resolveMetadata(logicalKey: string): Promise<SecretMetadata | undefined> {
    auditTrail(logicalKey, 'resolve_metadata');
    const backendKey = this.config.keyMapping[logicalKey] || logicalKey;
    try {
      const entry = await this.store.get(backendKey);
      return (
        entry.metadata || {
          category: 'provider',
          classification: 'high',
        }
      );
    } catch {
      return undefined;
    }
  }

  async invalidate(logicalKey: string): Promise<void> {
    const backendKey = this.config.keyMapping[logicalKey] || logicalKey;
    this.cache.delete(backendKey);
    this.negativeCache.delete(backendKey);
    auditTrail(backendKey, 'invalidate');
  }

  async invalidateAll(): Promise<void> {
    this.cache.clear();
    this.negativeCache.clear();
    auditTrail('*', 'invalidate_all');
  }
}
