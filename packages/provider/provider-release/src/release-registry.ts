/**
 * @module provider-release/release-registry
 * @description Stores qualified and certified releases.
 */

import type { ReleaseManifest } from './interfaces.js';
import { RegistryError } from './errors.js';

export class ReleaseRegistry {
  private releases = new Map<string, ReleaseManifest>();

  register(manifest: ReleaseManifest): void {
    if (this.releases.has(manifest.providerId)) {
      throw new RegistryError(
        `Release already registered: ${manifest.providerId}`,
        'release-registry',
      );
    }
    this.releases.set(manifest.providerId, manifest);
  }

  resolve(providerId: string): ReleaseManifest | undefined {
    return this.releases.get(providerId);
  }

  isReleaseCompatible(providerId: string): boolean {
    const release = this.releases.get(providerId);
    return !!release && release.releaseStatus !== 'Experimental';
  }

  clear(): void {
    this.releases.clear();
  }
}
