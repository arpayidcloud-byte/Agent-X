/**
 * @module workflow-hardening/interfaces
 * @description Types for Workflow Hardening, Replay & Recovery Certification.
 */

export interface ReplayConfig {
  fullReplay: boolean;
  partialReplay: boolean;
  replayFromCheckpoint: boolean;
  replayUntilStep: number | null;
  validateChecksum: boolean;
  validateState: boolean;
  validateEvents: boolean;
  validateDecisions: boolean;
}

export interface ReplayResult {
  sessionId: string;
  success: boolean;
  stepsExecuted: number;
  checksumValid: boolean;
  stateValid: boolean;
  eventsValid: boolean;
  decisionsValid: boolean;
  deterministic: boolean;
  durationMs: number;
}

export interface SnapshotDiffResult {
  checkpointAId: string;
  checkpointBId: string;
  added: string[];
  removed: string[];
  modified: string[];
  executionDelta: number;
  stateDelta: Record<string, unknown>;
  decisionDelta: string[];
  resourceDelta: Record<string, number>;
  metricDelta: Record<string, number>;
  checksumDelta: string;
}

export interface WorkflowVersion {
  id: string;
  version: string;
  type: 'major' | 'minor' | 'patch' | 'lts' | 'experimental';
  checksum: string;
  frozenAt: Date;
}

export interface WorkflowCertificate {
  id: string;
  workflowId: string;
  version: string;
  score: number;
  status: 'CERTIFIED' | 'REJECTED';
  issues: string[];
  checksum: string;
  issuedAt: Date;
}

export interface RecoveryCertification {
  id: string;
  workflowId: string;
  recoveryCorrectness: boolean;
  checkpointRestoration: boolean;
  rollbackIntegrity: boolean;
  failureRecovery: boolean;
  retryCorrectness: boolean;
  score: number;
  checksum: string;
  issuedAt: Date;
}

export interface CompensationStep {
  id: string;
  action: string;
  undoAction: string;
  order: number;
}

export interface WorkflowState {
  taskStates: Record<string, string>;
  decisions: string[];
  resources: Record<string, number>;
  metrics: Record<string, number>;
}

export interface HardeningMetrics {
  replayCount: number;
  replaySuccess: number;
  replayFailure: number;
  snapshotDiffCount: number;
  certificationCount: number;
  certificationFailure: number;
  recoveryValidationCount: number;
  compensationRuns: number;
  compensationFailures: number;
  workflowVersions: number;
  rollbackCount: number;
  integrityScore: number;
}

export interface HardeningHook {
  beforeReplay?: (sessionId: string) => Promise<void>;
  afterReplay?: (sessionId: string, result: ReplayResult) => Promise<void>;
  beforeCertification?: (workflowId: string) => Promise<void>;
  afterCertification?: (workflowId: string, cert: WorkflowCertificate) => Promise<void>;
  beforeCompensation?: (workflowId: string) => Promise<void>;
  afterCompensation?: (workflowId: string, success: boolean) => Promise<void>;
  beforeRollback?: (workflowId: string) => Promise<void>;
  afterRollback?: (workflowId: string) => Promise<void>;
  beforeSnapshotDiff?: (diffId: string) => Promise<void>;
  afterSnapshotDiff?: (diffId: string) => Promise<void>;
}
