/**
 * @module provider-release/interfaces
 * @description Core schemas for Provider Compatibility Matrix and Release Certification.
 */

export interface ProviderManifest {
  id: string;
  name: string;
  version: string;
  type: string;
  capabilities: string[];
  dependencies: Record<string, string>;
  supportedRuntimeVersions: string[];
}

export interface ReleaseManifest {
  providerId: string;
  providerVersion: string;
  runtimeVersion: string;
  certificationVersion: string;
  supportedFeatures: string[];
  capabilities: string[];
  dependencies: Record<string, string>;
  buildTime: Date;
  checksum: string;
  compatibilityScore: number;
  releaseStatus: ReleaseStatus;
}

export type ReleaseStatus =
  'Development' | 'Experimental' | 'Preview' | 'Stable' | 'Enterprise' | 'Production' | 'LTS';

export interface ReleaseCertificate {
  certificateId: string;
  provider: string;
  runtime: string;
  compatibilityScore: number;
  certificationScore: number;
  coverage: number;
  checksum: string;
  issuedAt: Date;
  issuedBy: string;
  status: 'VALID' | 'INVALID';
}

export interface UpgradePlan {
  providerId: string;
  currentVersion: string;
  targetVersion: string;
  breakingChanges: string[];
  migrationSteps: string[];
  warnings: string[];
  rollbackStrategy: string;
}

export interface APIChange {
  method: string;
  type: 'removed' | 'added' | 'signature_changed' | 'return_changed' | 'deprecated';
}

export interface CompatibilityScore {
  api: number;
  runtime: number;
  feature: number;
  performance: number;
  security: number;
  overall: number;
}
