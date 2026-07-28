/**
 * @module vendor-certification/certification-engine
 * @description Master orchestrator for provider certification.
 */

import type { IProvider, CertificationConfig, CertificationCertificate } from './interfaces.js';
import { ProviderValidator } from './provider-validator.js';
import { ProviderHealthAudit } from './provider-health-audit.js';
import { ProviderPerformanceAudit } from './provider-performance-audit.js';
import { ProviderSecurityAudit } from './provider-security-audit.js';
import { ProviderReliabilityAudit } from './provider-reliability-audit.js';
import { ProviderRecoveryAudit } from './provider-recovery-audit.js';
import { ProviderVersionValidator } from './provider-version-validator.js';
import { ProviderResourceValidator } from './provider-resource-validator.js';
import { ProviderReadinessScore } from './provider-readiness-score.js';
import { ProviderGrader } from './provider-grade.js';
import { ProviderCertificate } from './provider-certificate.js';
import { ProviderRegistry } from './provider-registry.js';
import { CertificationHistory } from './certification-history.js';
import { ReportGenerator } from './report-generator.js';
import { CertificationError } from './errors.js';

export class CertificationEngine {
  public registry = new ProviderRegistry();
  public history = new CertificationHistory();

  private validator = new ProviderValidator();
  private healthAudit = new ProviderHealthAudit();
  private perfAudit = new ProviderPerformanceAudit();
  private secAudit = new ProviderSecurityAudit();
  private relAudit = new ProviderReliabilityAudit();
  private recAudit = new ProviderRecoveryAudit();
  private verValidator = new ProviderVersionValidator();
  private resValidator = new ProviderResourceValidator();
  private scoreCalc = new ProviderReadinessScore();
  private grader = new ProviderGrader();
  private certGenerator = new ProviderCertificate();
  private reportGen = new ReportGenerator();

  async certify(
    provider: IProvider,
    config: CertificationConfig,
  ): Promise<CertificationCertificate> {
    this.validator.validate(provider);

    await this.healthAudit.run(provider);
    const perf = await this.perfAudit.run(provider);
    await this.secAudit.run(provider);
    const rel = await this.relAudit.run(provider);
    const rec = await this.recAudit.run(provider);
    await this.verValidator.run(provider, config.runtimeVersion);
    await this.resValidator.run(provider);

    const score = this.scoreCalc.calculate({
      performance: perf.score,
      reliability: rel.score,
      availability: rel.score - 1,
      recovery: rec.score,
      security: 100,
      resourceEfficiency: 95,
      compatibility: 100,
      maintainability: 100,
      documentation: 90,
      observability: 100,
    });

    const grade = this.grader.getGrade(score.overall);

    if (grade === 'Rejected' || grade === 'Experimental') {
      throw new CertificationError(
        `Provider grade '${grade}' does not meet minimum production standards`,
        'GRADE_REJECTED',
        'certification-engine',
      );
    }

    const certificate = this.certGenerator.generate(provider.getMetadata(), score.overall, grade);
    this.registry.register(certificate);

    const report = this.reportGen.generate(
      provider.getMetadata(),
      score,
      grade,
      config.runtimeVersion,
      config.platformVersion,
    );
    this.history.add(report);

    return certificate;
  }
}
