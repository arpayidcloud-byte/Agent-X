/**
 * @module production-quality/quality-engine
 * @description Master orchestrator for production readiness quality verification.
 */

import type { ValidationContext, ProductionQualityReport, CoverageReport } from './interfaces.js';
import { QualityGates } from './quality-gates.js';
import { QualityRules } from './quality-rules.js';
import { MutationValidator } from './mutation-validator.js';
import { BranchValidator } from './branch-validator.js';
import { EdgeCaseValidator } from './edgecase-validator.js';
import { FailurePathValidator } from './failure-validator.js';
import { DeterministicValidator } from './deterministic-validator.js';
import { RaceConditionValidator } from './race-condition-validator.js';
import { ResourceValidator } from './resource-validator.js';
import type { ResourceUsage, ResourceCeilings } from './resource-validator.js';
import { TimeoutValidator } from './timeout-validator.js';
import { RetryValidator } from './retry-validator.js';
import { AuditValidator } from './audit-validator.js';
import type { AuditLog } from './audit-validator.js';
import { EventValidator } from './event-validator.js';
import type { EventEnvelope } from './event-validator.js';
import { SnapshotValidator } from './snapshot-validator.js';
import { ChecksumValidator } from './checksum-validator.js';
import { DependencyValidator } from './dependency-validator.js';
import { ReportGenerator } from './report.js';
import { QualityMetricsCollector } from './metrics.js';

export class QualityEngine {
  public metrics = new QualityMetricsCollector();

  private gates = new QualityGates();
  private rules = new QualityRules();
  private mutation = new MutationValidator();
  private branch = new BranchValidator();
  private edgecase = new EdgeCaseValidator();
  private failure = new FailurePathValidator();
  private deterministic = new DeterministicValidator();
  private race = new RaceConditionValidator();
  private resource = new ResourceValidator();
  private timeout = new TimeoutValidator();
  private retry = new RetryValidator();
  private audit = new AuditValidator();
  private event = new EventValidator();
  private snapshot = new SnapshotValidator();
  private checksum = new ChecksumValidator();
  private dependency = new DependencyValidator();
  private reportGen = new ReportGenerator();

  async validatePackage(
    context: ValidationContext,
    coverage: CoverageReport,
    extra: {
      mutantsKilled: number;
      totalMutants: number;
      uncoveredBranches: string[];
      edgeCases: string[];
      failures: string[];
      deterministicOutputs: unknown[];
      raceResults: boolean[];
      resourceUsage: ResourceUsage;
      resourceCeilings: ResourceCeilings;
      timeoutRuns: { component: string; durationMs: number; timeoutMs: number }[];
      retries: { count: number; maxRetries: number; exhausted: boolean };
      auditLogs: AuditLog[];
      events: EventEnvelope[];
      snapshot: unknown;
      checksumData: string;
      expectedChecksum: string;
      dependencies: Record<string, string[]>;
    },
  ): Promise<ProductionQualityReport> {
    this.gates.validate(coverage);

    this.mutation.validate(extra.mutantsKilled, extra.totalMutants);
    this.branch.validate(extra.uncoveredBranches);
    this.edgecase.validate(extra.edgeCases);
    this.failure.validate(extra.failures);
    const detRes = this.deterministic.validate(extra.deterministicOutputs);
    const raceRes = this.race.validate(extra.raceResults);
    const resRes = this.resource.validate(extra.resourceUsage, extra.resourceCeilings);
    const timeRes = this.timeout.validate(extra.timeoutRuns);
    const retryRes = this.retry.validate(extra.retries);
    const auditRes = this.audit.validate(extra.auditLogs);
    this.event.validate(extra.events);
    this.snapshot.validate(extra.snapshot);
    this.checksum.validate(extra.checksumData, extra.expectedChecksum);
    this.dependency.validate(extra.dependencies);

    const scores = this.rules.calculateScore({
      coverage: 100,
      deterministic: detRes.score,
      resource: resRes.score,
      dependency: 100,
      timeout: timeRes.score,
      retry: retryRes.score,
      observability: auditRes.score,
      architecture: 100,
      race: raceRes.score,
    });

    const grade = this.rules.getGrade(scores.overallScore);
    const passed = scores.overallScore >= 95;

    const report = this.reportGen.generate(
      context.traceId,
      context.packageId,
      scores,
      grade,
      passed ? 0 : 1,
      extra.edgeCases.length,
    );

    this.metrics.recordValidation(scores.overallScore, passed);

    return report;
  }
}
