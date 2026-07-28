/**
 * @module architecture-sdk/interfaces
 * @description Contracts for the Architecture SDK and Developer Tools.
 */

export interface PackageMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'frozen' | 'active' | 'deprecated';
  checksum: string;
}

export interface DependencyNode {
  source: string;
  target: string;
  type: 'required' | 'optional' | 'peer' | 'dev';
}

export interface ArchitectureMetadata {
  checksum: string;
  frozenAt: Date;
  version: string;
  packages: PackageMetadata[];
  dependencies: DependencyNode[];
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  lifecycle: 'initialize' | 'start' | 'stop' | 'destroy';
  capabilities: string[];
  permissions: string[];
  checksum: string;
}

export interface ProviderManifest {
  id: string;
  name: string;
  version: string;
  type: string;
  interfaces: string[];
  checksum: string;
}

export interface VersionPolicy {
  major: string[];
  minor: string[];
  patch: string[];
  lts: string[];
  experimental: string[];
}

export interface CompatibilityMatrix {
  packages: string[];
  matrix: Record<string, Record<string, boolean>>;
}

export interface MigrationStep {
  from: string;
  to: string;
  breakingChanges: string[];
  deprecations: string[];
  replacements: Record<string, string>;
}

export interface ArchitectureReport {
  id: string;
  frozenAt: Date;
  checksum: string;
  status: 'VALID' | 'BROKEN';
  metadata: ArchitectureMetadata;
}
