/**
 * @module provider-qualification/certification-report
 * @description Builds official report from evaluation.
 */

import type { CertificationReport, QualificationScore, ProviderRank } from './interfaces.js';
import { createHash } from 'crypto';

export class CertificationReportBuilder {
  private qualificationId!: string;
  private providerId!: string;
  private name!: string;
  private version!: string;
  private supportedInterfaces!: string[];
  private compatibilityMatrix!: Record<string, boolean>;
  private scores!: QualificationScore;
  private rank!: ProviderRank;
  private timestamp: Date = new Date();

  setId(id: string) {
    this.qualificationId = id;
    return this;
  }
  setProvider(id: string) {
    this.providerId = id;
    return this;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }
  setVersion(version: string) {
    this.version = version;
    return this;
  }
  setInterfaces(interfaces: string[]) {
    this.supportedInterfaces = interfaces;
    return this;
  }
  setMatrix(matrix: Record<string, boolean>) {
    this.compatibilityMatrix = matrix;
    return this;
  }
  setScores(scores: QualificationScore) {
    this.scores = scores;
    return this;
  }
  setRank(rank: ProviderRank) {
    this.rank = rank;
    return this;
  }

  build(): CertificationReport {
    const report: CertificationReport = {
      qualificationId: this.qualificationId,
      providerId: this.providerId,
      name: this.name,
      version: this.version,
      supportedInterfaces: this.supportedInterfaces,
      compatibilityMatrix: this.compatibilityMatrix,
      scores: this.scores,
      rank: this.rank,
      status:
        this.scores.overallScore >= 60
          ? 'PASS'
          : this.scores.overallScore >= 40
            ? 'WARNING'
            : 'FAILED',
      timestamp: this.timestamp,
      checksum: '',
    };

    const content = JSON.stringify(report);
    report.checksum = createHash('sha256').update(content).digest('hex');
    return report;
  }
}
