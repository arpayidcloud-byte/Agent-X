/**
 * @module architecture-sdk/version-policy
 * @description Semantic Versioning policies.
 */

import type { VersionPolicy } from './interfaces.js';

export class VersionPolicyManager {
  getPolicy(): VersionPolicy {
    return {
      major: ['Breaking API changes'],
      minor: ['Added features', 'Backward compatible'],
      patch: ['Bug fixes', 'Backward compatible'],
      lts: ['Enterprise production ready'],
      experimental: ['Development preview', 'Volatile'],
    };
  }
}
