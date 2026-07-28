/**
 * @module provider-sdk/interfaces
 * @description Contontract definition for the Provider SDK Conformance Kit.
 */

export interface ProviderScaffoldOptions {
  name: string;
  providerType: 'queue' | 'lock' | 'storage' | 'telemetry' | 'secret' | 'worker-discovery';
  author: string;
}

export interface HarnessResult {
  passed: boolean;
  durationMs: number;
  details: Record<string, unknown>;
}

export interface ConformanceReport {
  providerId: string;
  contract: HarnessResult;
  compatibility: HarnessResult;
  benchmark: HarnessResult;
  stress: HarnessResult;
  chaos: HarnessResult;
  security: HarnessResult;
  status: 'PASS' | 'FAIL';
  timestamp: Date;
  checksum: string;
}

export interface ProviderManifest {
  id: string;
  name: string;
  version: string;
  type: string;
  author: string;
  capabilities: string[];
  dependencies: Record<string, string>;
}

export interface ProviderConfiguration {
  endpoint?: string;
  credentials?: Record<string, string>;
}
