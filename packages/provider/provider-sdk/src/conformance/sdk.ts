/**
 * @module provider-sdk/sdk
 * @description Master SDK class entrypoint for the Conformance Kit (PSCK).
 */

import type { IProvider } from '@agentx-fast/runtime-adapters';
import type { ConformanceReport, ProviderManifest } from './interfaces.js';
import { ProviderRunner } from './provider-runner.js';
import { ProviderValidator } from './provider-validator.js';
import type { ProviderBundle } from './provider-packager.js';
import { ProviderPackager } from './provider-packager.js';
import { ValidationFailedError } from './errors.js';

export class PSCK {
  private runner = new ProviderRunner();
  private validator = new ProviderValidator();
  private packager = new ProviderPackager();

  async validateAndRun(
    provider: IProvider,
    manifest: ProviderManifest,
  ): Promise<ConformanceReport> {
    const valid = this.validator.validate(provider, manifest);
    if (!valid) {
      throw new ValidationFailedError(
        `Provider validation failed against manifest ID: ${manifest.id}`,
        'sdk',
      );
    }
    return this.runner.runSuite(provider);
  }

  packageBundle(manifest: ProviderManifest, report: ConformanceReport): ProviderBundle {
    return this.packager.package(manifest, report);
  }
}
