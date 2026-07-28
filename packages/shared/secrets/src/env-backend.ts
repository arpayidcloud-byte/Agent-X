import type { SecretStore, SecretEntry, SecretMetadata } from './interfaces.js';
import { SecretNotFoundError, OperationNotSupportedError } from './errors.js';

export class EnvVarSecretStore implements SecretStore {
  readonly backendId = 'env';
  private env: Record<string, string | undefined>;

  constructor(env: Record<string, string | undefined> = process.env) {
    this.env = env;
  }

  async get(key: string): Promise<SecretEntry> {
    const value = this.env[key];
    if (value === undefined) {
      throw new SecretNotFoundError(key);
    }
    return {
      key,
      value,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        category: 'provider',
        classification: 'high',
      },
    };
  }

  async set(_key: string, _value: string, _metadata?: SecretMetadata): Promise<void> {
    throw new OperationNotSupportedError('set');
  }

  async delete(_key: string): Promise<void> {
    throw new OperationNotSupportedError('delete');
  }

  async list(): Promise<string[]> {
    return Object.keys(this.env).filter((k) => k.startsWith('AGENTX_SECRET_'));
  }

  async has(key: string): Promise<boolean> {
    return this.env[key] !== undefined;
  }

  async rotate(_key: string): Promise<void> {
    throw new OperationNotSupportedError('rotate');
  }
}
