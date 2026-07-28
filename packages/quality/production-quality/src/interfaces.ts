/**
 * @module production-quality/interfaces
 * @description Interfaces for Production Quality Validation (M4.3.6).
 */

export interface ValidationContext {
  traceId: string;
  packageId: string;
}

export interface ValidationScore {
  coverageScore: number;
  deterministicScore: number;
  resourceScore: number;
  dependencyScore: number;
  timeoutScore: number;
  retryScore: number;
  observabilityScore: number;
  architectureScore: number;
  riskScore: number;
  overallScore: number;
}

export type QualityGrade =
  'Production Elite' | 'Production Ready' | 'Enterprise Ready' | 'Stable' | 'Beta' | 'Rejected';

export interface ProductionQualityReport {
  id: string;
  timestamp: Date;
  traceId: string;
  packageId: string;
  score: ValidationScore;
  grade: QualityGrade;
  failureCount: number;
  edgeCasesValidated: number;
  details: Record<string, unknown>;
  checksum: string;
}

export interface CoverageReport {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

export interface ValidationResult {
  passed: boolean;
  score: number;
  failures: string[];
  metadata?: Record<string, unknown>;
}
