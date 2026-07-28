/**
 * @module provider-sdk/provider-factory
 * @description Creates reference memory instances dynamically.
 */

import { MemoryQueueProvider, MemoryLockProvider } from '@agentx-fast/runtime-adapters';

export class ProviderFactory {
  static create(type: string) {
    if (type === 'queue') {
      return new MemoryQueueProvider();
    }
    if (type === 'lock') {
      return new MemoryLockProvider();
    }
    throw new Error(`Unsupported provider factory type: ${type}`);
  }
}
