/**
 * @module provider-sdk/provider-packager
 * @description Bundles the provider and certification data.
 */

import type { ProviderManifest, ConformanceReport } from './interfaces.js';

export interface ProviderBundle {
  manifest: ProviderManifest;
  report: ConformanceReport;
  archivePath: string;
}

export class ProviderPackager {
  package(manifest: ProviderManifest, report: ConformanceReport): ProviderBundle {
    return {
      manifest,
      report,
      archivePath: `/dist/${manifest.id}.tar.gz`,
    };
  }
}
