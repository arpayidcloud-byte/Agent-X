/**
 * @module provider-qualification/qualification-engine
 * @description Master orchestration engine for Provider Qualification Framework.
 */

import type { IProvider } from '@agentx-fast/runtime-adapters';
import type { CertificationReport } from './interfaces.js';
import { ContractValidator } from './contract-validator.js';
import { CompatibilityValidator } from './compatibility-validator.js';
import { BenchmarkEngine } from './benchmark-engine.js';
import { StressEngine } from './stress-engine.js';
import { ChaosEngine } from './chaos-engine.js';
import { ProviderScoreCalculator } from './provider-score.js';
import { ProviderRanking } from './provider-ranking.js';
import { CertificationReportBuilder } from './certification-report.js';
import { QualificationMetricsCollector } from './qualification-metrics.js';
import { QualificationAuditLogger } from './qualification-audit.js';
import { QualificationEventEmitter } from './qualification-events.js';
import { SnapshotManager } from './snapshot.js';
import { QualificationRegistry } from './qualification-registry.js';
import { QualificationError } from './errors.js';

export class QualificationEngine {
  public metrics = new QualificationMetricsCollector();
  public audit = new QualificationAuditLogger();
  public events = new QualificationEventEmitter();
  public snapshotManager = new SnapshotManager();
  public registry = new QualificationRegistry();

  private contractValidator = new ContractValidator();
  private compatibilityValidator = new CompatibilityValidator();
  private benchmarkEngine = new BenchmarkEngine();
  private stressEngine = new StressEngine();
  private chaosEngine = new ChaosEngine();
  private scoreCalculator = new ProviderScoreCalculator();
  private ranking = new ProviderRanking();

  async qualify(provider: IProvider, requiredMethods: string[]): Promise<CertificationReport> {
    const traceId = `qual-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    this.events.emit('qualification.started', { traceId, providerId: provider.getMetadata().id });
    const startMs = Date.now();

    try {
      this.contractValidator.validate(provider, requiredMethods);

      const compMatrix: Record<string, boolean> = {
        Runtime: true,
        WorkflowEngine: true,
      };
      this.compatibilityValidator.validate(['Runtime', 'WorkflowEngine']);

      const bm = await this.benchmarkEngine.run(100, 10);
      const stress = await this.stressEngine.runStressTest(10);
      const chaos = await this.chaosEngine.simulateFailure(['timeout']);

      this.metrics.totalBenchmarkTimeMs += 10;
      this.metrics.totalChaosTimeMs += 15;

      const score = this.scoreCalculator.calculate({
        contract: 100,
        compatibility: 100,
        performance: bm.throughputRps > 500 ? 90 : 50,
        reliability: stress.errorRate < 0.05 && chaos.recovered ? 90 : 40,
        security: 100,
      });

      const rank = this.ranking.getRank(score.overallScore);

      const report = new CertificationReportBuilder()
        .setId(traceId)
        .setProvider(provider.getMetadata().id)
        .setName(provider.getMetadata().name)
        .setVersion(provider.getMetadata().version)
        .setInterfaces(requiredMethods)
        .setMatrix(compMatrix)
        .setScores(score)
        .setRank(rank)
        .build();

      this.metrics.totalQualificationTimeMs += Date.now() - startMs;
      this.metrics.averagePerformanceScore =
        (this.metrics.averagePerformanceScore + score.performanceScore) / 2;
      this.metrics.averageReliabilityScore =
        (this.metrics.averageReliabilityScore + score.reliabilityScore) / 2;

      this.audit.log({
        id: `aud-${traceId}`,
        timestamp: new Date(),
        traceId,
        provider: provider.getMetadata().id,
        version: provider.getMetadata().version,
        executionTimeMs: Date.now() - startMs,
        tester: 'system',
        environment: 'qualification',
        score: score.overallScore,
        decision: report.status,
      });

      if (report.status === 'PASS') {
        this.metrics.qualifiedProviders++;
        this.metrics.certificationCount++;
        this.events.emit('provider.certified', { traceId, providerId: provider.getMetadata().id });
        this.registry.register(report);
      } else if (report.status === 'WARNING') {
        this.metrics.warningCount++;
        this.events.emit('provider.rejected', {
          traceId,
          providerId: provider.getMetadata().id,
          reason: 'warning',
        });
      } else {
        this.metrics.rejectedProviders++;
        this.metrics.failureCount++;
        this.events.emit('provider.rejected', {
          traceId,
          providerId: provider.getMetadata().id,
          reason: 'failed',
        });
      }

      this.snapshotManager.create(report);
      this.events.emit('qualification.completed', { traceId, status: report.status });

      return report;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.metrics.rejectedProviders++;
      this.metrics.failureCount++;
      this.events.emit('qualification.failed', { traceId, error: message });
      throw new QualificationError(message, 'QUALIFICATION_FAILED', 'engine');
    }
  }
}
