/**
 * @module vendor-certification/interfaces
 * @description Contract definition for Vendor Certification and Production Readiness (VCPR).
 */

export interface ProviderMetadata {
  id: string;
  name: string;
  version: string;
  type: string;
}

export interface ProviderCapabilities {
  transactions?: boolean;
  priorityQueue?: boolean;
  distributedLocks?: boolean;
  telemetry?: boolean;
  secretRotation?: boolean;
}

export interface IProvider {
  getMetadata(): ProviderMetadata;
  getCapabilities(): ProviderCapabilities;
  healthCheck(): Promise<{
    healthy: boolean;
    latencyMs: number;
    lastChecked: Date;
    status: string;
  }>;
}

export interface CertificationConfig {
  platformVersion: string;
  runtimeVersion: string;
  requiredGrade: string;
}

export interface AuditResult {
  passed: boolean;
  score: number;
  details: Record<string, unknown>;
  timestamp: Date;
}

export interface ReadinessScore {
  performance: number;
  reliability: number;
  availability: number;
  recovery: number;
  security: number;
  resourceEfficiency: number;
  compatibility: number;
  maintainability: number;
  documentation: number;
  observability: number;
  overall: number;
}

export type ProviderGrade =
  | 'Production'
  | 'Enterprise'
  | 'Certified'
  | 'Conditionally Certified'
  | 'Experimental'
  | 'Rejected';

export interface CertificationReport {
  id: string;
  provider: ProviderMetadata;
  runtimeVersion: string;
  platformVersion: string;
  scores: ReadinessScore;
  grade: ProviderGrade;
  status: 'PASS' | 'FAIL' | 'WARNING';
  timestamp: Date;
  checksum: string;
}

export interface CertificationCertificate {
  id: string;
  providerId: string;
  providerVersion: string;
  score: number;
  grade: ProviderGrade;
  signature: string;
  issuedAt: Date;
  certificationVersion: string;
}
