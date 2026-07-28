/**
 * @module vendor-certification/provider-version-validator
 * @description Validates provider version against compatible runtime bounds.
 */

import type { IProvider, AuditResult } from './interfaces.js';
import { VersionMismatchError } from './errors.js';

export class ProviderVersionValidator {
  async run(provider: IProvider, runtimeVersion: string): Promise<AuditResult> {
    const meta = provider.getMetadata();
    // Stubbed check: ensure major version alignment
    const providerMajor = parseInt(meta.version.split('.')[0] as string, 10);
    const runtimeMajor = parseInt(runtimeVersion.split('.')[0] as string, 10);

    if (providerMajor !== runtimeMajor) {
      throw new VersionMismatchError(
        `Provider version ${meta.version} incompatible with Runtime ${runtimeVersion}`,
        'version-validator',
      );
    }

    return {
      passed: true,
      score: 100,
      details: { providerVersion: meta.version, runtimeVersion },
      timestamp: new Date(),
    };
  }
}
