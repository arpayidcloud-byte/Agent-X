import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  EnvVarSecretStore,
  CachedCredentialResolver,
  RedactedString,
  scrubEnvironment,
  SecretCache,
  SecretNotFoundError,
  OperationNotSupportedError,
  CredentialResolutionError,
  SecretAccessError,
} from '../src/index.js';

describe('Secret Errors & Hierarchy', () => {
  it('should construct error types properly with correct inheritance', () => {
    const error = new SecretNotFoundError('test_key');
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('SecretNotFoundError');
    expect(error.message).toContain('test_key');

    const notSupported = new OperationNotSupportedError();
    expect(notSupported).toBeInstanceOf(Error);
    expect(notSupported.name).toBe('OperationNotSupportedError');

    const accessError = new SecretAccessError();
    expect(accessError).toBeInstanceOf(Error);
    expect(accessError.name).toBe('SecretAccessError');

    const resolutionError = new CredentialResolutionError('anthropic');
    expect(resolutionError).toBeInstanceOf(Error);
    expect(resolutionError.name).toBe('CredentialResolutionError');
    expect(resolutionError.message).toContain('AGENTX_SECRET_ANTHROPIC_API_KEY');
  });
});

describe('RedactedString & Scrubber', () => {
  it('should mask secret values in all string/JSON output paths', () => {
    const secret = new RedactedString('my_super_secret_value');
    expect(secret.toString()).toBe('[REDACTED]');
    expect(secret.toJSON()).toBe('[REDACTED]');
    expect(secret.valueOf()).toBe('[REDACTED]');
    expect(secret[Symbol.toPrimitive]('string')).toBe('[REDACTED]');
    expect(JSON.stringify({ secret })).toBe('{"secret":"[REDACTED]"}');
    expect(secret.getRawValue()).toBe('my_super_secret_value');
  });

  it('should scrub AGENTX_SECRET_ variables from process environment', () => {
    const originalEnv = {
      PATH: '/usr/bin',
      AGENTX_SECRET_ANTHROPIC_API_KEY: 'sk-ant-123',
      AGENTX_SECRET_GOOGLE_API_KEY: 'aiza-456',
      DATABASE_URL: 'postgres://localhost:5432',
    };

    const scrubbed = scrubEnvironment(originalEnv);
    expect(scrubbed.PATH).toBe('/usr/bin');
    expect(scrubbed.DATABASE_URL).toBe('postgres://localhost:5432');
    expect(scrubbed.AGENTX_SECRET_ANTHROPIC_API_KEY).toBeUndefined();
    expect(scrubbed.AGENTX_SECRET_GOOGLE_API_KEY).toBeUndefined();
  });
});

describe('SecretCache (LRU)', () => {
  it('should support basic set, get, and delete operations', () => {
    const cache = new SecretCache({ ttlMs: 1000, maxSize: 5 });
    cache.set('key1', 'val1');
    expect(cache.get('key1')).toBe('val1');
    expect(cache.has('key1')).toBe(true);
    expect(cache.hasPositive('key1')).toBe(true);

    cache.delete('key1');
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.has('key1')).toBe(false);
  });

  it('should support negative cache mapping and eviction', () => {
    const cache = new SecretCache({ negativeTtlMs: 2000 });
    cache.setNegative('key_missing');
    expect(cache.has('key_missing')).toBe(true);
    expect(cache.hasNegative('key_missing')).toBe(true);
    expect(cache.hasPositive('key_missing')).toBe(false);
    expect(cache.get('key_missing')).toBeUndefined();

    // Setting a positive value evicts the negative entry
    cache.set('key_missing', 'found_val');
    expect(cache.hasNegative('key_missing')).toBe(false);
    expect(cache.hasPositive('key_missing')).toBe(true);
    expect(cache.get('key_missing')).toBe('found_val');
  });

  it('should support clear() to flush all caches', () => {
    const cache = new SecretCache();
    cache.set('key1', 'val1');
    cache.setNegative('key2');
    cache.clear();
    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(false);
  });
});

describe('EnvVarSecretStore', () => {
  it('should lookup existing environment secrets', async () => {
    const fakeEnv = {
      AGENTX_SECRET_OPENAI_API_KEY: 'sk-open-999',
    };
    const store = new EnvVarSecretStore(fakeEnv);

    expect(await store.has('AGENTX_SECRET_OPENAI_API_KEY')).toBe(true);
    expect(await store.has('AGENTX_SECRET_ANTHROPIC_API_KEY')).toBe(false);

    const entry = await store.get('AGENTX_SECRET_OPENAI_API_KEY');
    expect(entry.value).toBe('sk-open-999');
    expect(entry.key).toBe('AGENTX_SECRET_OPENAI_API_KEY');
    expect(entry.version).toBe(1);
    expect(entry.metadata?.category).toBe('provider');
    expect(entry.metadata?.classification).toBe('high');
  });

  it('should list all environment variables starting with prefix', async () => {
    const fakeEnv = {
      AGENTX_SECRET_OPENAI_API_KEY: 'sk-open-999',
      AGENTX_SECRET_ANTHROPIC_API_KEY: 'sk-ant-123',
      DATABASE_URL: 'postgres://...',
    };
    const store = new EnvVarSecretStore(fakeEnv);
    const list = await store.list();
    expect(list).toContain('AGENTX_SECRET_OPENAI_API_KEY');
    expect(list).toContain('AGENTX_SECRET_ANTHROPIC_API_KEY');
    expect(list).not.toContain('DATABASE_URL');
  });

  it('should throw SecretNotFoundError when looking up missing key', async () => {
    const store = new EnvVarSecretStore({});
    await expect(store.get('AGENTX_SECRET_OPENAI_API_KEY')).rejects.toThrow(SecretNotFoundError);
  });

  it('should throw OperationNotSupportedError on mutations', async () => {
    const store = new EnvVarSecretStore({});
    await expect(store.set('k', 'v')).rejects.toThrow(OperationNotSupportedError);
    await expect(store.delete('k')).rejects.toThrow(OperationNotSupportedError);
    await expect(store.rotate!('k')).rejects.toThrow(OperationNotSupportedError);
  });
});

describe('CachedCredentialResolver', () => {
  let fakeStore: EnvVarSecretStore;
  let fakeEnv: Record<string, string | undefined>;

  beforeEach(() => {
    fakeEnv = {
      AGENTX_SECRET_OPENAI_API_KEY: 'sk-open-999',
      AGENTX_SECRET_ANTHROPIC_API_KEY: 'sk-ant-123',
    };
    fakeStore = new EnvVarSecretStore(fakeEnv);
  });

  it('should resolve using custom key mappings', async () => {
    const resolver = new CachedCredentialResolver(fakeStore, {
      keyMapping: {
        'provider.openai.api_key': 'AGENTX_SECRET_OPENAI_API_KEY',
      },
    });

    const val = await resolver.resolve('provider.openai.api_key');
    expect(val).toBe('sk-open-999');

    const redacted = await resolver.resolveRedacted('provider.openai.api_key');
    expect(redacted).toBeInstanceOf(RedactedString);
    expect(redacted.getRawValue()).toBe('sk-open-999');
  });

  it('should support default logical key fallback when mapping is missing', async () => {
    const resolver = new CachedCredentialResolver(fakeStore);
    const val = await resolver.resolve('AGENTX_SECRET_ANTHROPIC_API_KEY');
    expect(val).toBe('sk-ant-123');
  });

  it('should cache resolved secrets (cache hit)', async () => {
    const spyGet = vi.spyOn(fakeStore, 'get');
    const resolver = new CachedCredentialResolver(fakeStore, {
      keyMapping: {
        'provider.openai.api_key': 'AGENTX_SECRET_OPENAI_API_KEY',
      },
    });

    // First call (miss)
    const val1 = await resolver.resolve('provider.openai.api_key');
    expect(val1).toBe('sk-open-999');
    expect(spyGet).toHaveBeenCalledTimes(1);

    // Second call (hit)
    const val2 = await resolver.resolve('provider.openai.api_key');
    expect(val2).toBe('sk-open-999');
    expect(spyGet).toHaveBeenCalledTimes(1); // not incremented
  });

  it('should invalidate cache single key and all keys', async () => {
    const spyGet = vi.spyOn(fakeStore, 'get');
    const resolver = new CachedCredentialResolver(fakeStore, {
      keyMapping: {
        'provider.openai.api_key': 'AGENTX_SECRET_OPENAI_API_KEY',
      },
    });

    await resolver.resolve('provider.openai.api_key');
    await resolver.invalidate('provider.openai.api_key');

    // Trigger re-resolve
    await resolver.resolve('provider.openai.api_key');
    expect(spyGet).toHaveBeenCalledTimes(2);

    await resolver.invalidateAll();
    await resolver.resolve('provider.openai.api_key');
    expect(spyGet).toHaveBeenCalledTimes(3);
  });

  it('should fail closed with CredentialResolutionError for missing secrets (and verify negative caching)', async () => {
    const spyGet = vi.spyOn(fakeStore, 'get');
    const resolver = new CachedCredentialResolver(fakeStore);

    // Initial fail
    await expect(resolver.resolve('provider.google.api_key')).rejects.toThrow(
      CredentialResolutionError,
    );
    expect(spyGet).toHaveBeenCalledTimes(1);

    // Second call triggers negative cache hit, no store call
    await expect(resolver.resolve('provider.google.api_key')).rejects.toThrow(
      CredentialResolutionError,
    );
    expect(spyGet).toHaveBeenCalledTimes(1); // remains 1
  });

  it('should resolve metadata', async () => {
    const resolver = new CachedCredentialResolver(fakeStore, {
      keyMapping: {
        'provider.openai.api_key': 'AGENTX_SECRET_OPENAI_API_KEY',
      },
    });

    const meta = await resolver.resolveMetadata('provider.openai.api_key');
    expect(meta.category).toBe('provider');
    expect(meta.classification).toBe('high');
  });

  it('should return default metadata if backend entry lacks it', async () => {
    const mockStore = {
      backendId: 'mock',
      get: async () => ({
        key: 'test',
        value: 'val',
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        // no metadata
      }),
      set: async () => {},
      delete: async () => {},
      list: async () => [],
      has: async () => true,
    };

    const resolver = new CachedCredentialResolver(mockStore);
    const meta = await resolver.resolveMetadata('test');
    expect(meta.category).toBe('provider');
    expect(meta.classification).toBe('high');
  });

  it('should propagate other errors from backend', async () => {
    const brokenStore = {
      backendId: 'broken',
      get: async () => {
        throw new Error('Database connection failed');
      },
      set: async () => {},
      delete: async () => {},
      list: async () => [],
      has: async () => true,
    };

    const resolver = new CachedCredentialResolver(brokenStore);
    await expect(resolver.resolve('test')).rejects.toThrow('Database connection failed');
  });
});
