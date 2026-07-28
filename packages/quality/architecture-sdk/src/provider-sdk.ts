/**
 * @module architecture-sdk/provider-sdk
 * @description Provider integration conformance guide.
 */

import type { ProviderManifest } from './interfaces.js';

export class ProviderSDK {
  validate(manifest: ProviderManifest): boolean {
    return manifest.id !== '' && manifest.interfaces.length > 0;
  }
}
