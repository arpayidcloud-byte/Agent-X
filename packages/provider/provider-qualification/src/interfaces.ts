/**
 * @module provider-qualification/interfaces
 * @description Contract and qualification schemas.
 */

export interface QualificationContext {
  traceId: string;
  environment: string;
  tester: string;
}

export interface QualificationScore {
  contractScore: number;
  compatibilityScore: number;
  performanceScore: number;
  reliabilityScore: number;
  securityScore: number;
  overallScore: number;
}

export type ProviderRank = 'GOLD' | 'SILVER' | 'BRONZE' | 'EXPERIMENTAL' | 'REJECTED';

export interface CertificationReport {
  qualificationId: string;
  providerId: string;
  name: string;
  version: string;
  supportedInterfaces: string[];
  compatibilityMatrix: Record<string, boolean>;
  scores: QualificationScore;
  rank: ProviderRank;
  status: 'PASS' | 'WARNING' | 'FAILED';
  timestamp: Date;
  checksum: string;
}

export interface BenchmarkMetrics {
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  throughputRps: number;
  cpuUsagePercent: number;
  memoryUsageMb: number;
}

export interface StressTestResult {
  durationMs: number;
  totalRequests: number;
  errorRate: number;
  saturated: boolean;
}

export interface ChaosResult {
  simulationsRun: string[];
  recovered: boolean;
  recoveryTimeMs: number;
}

export interface QualificationSnapshot {
  id: string;
  timestamp: Date;
  report: CertificationReport;
  checksum: string;
}
