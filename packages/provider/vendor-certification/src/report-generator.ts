/**
 * @module vendor-certification/report-generator
 * @description Creates immutable certification reports.
 */

import type {
  ProviderMetadata,
  ReadinessScore,
  ProviderGrade,
  CertificationReport,
} from './interfaces.js';
import { createHash } from 'crypto';

export class ReportGenerator {
  generate(
    provider: ProviderMetadata,
    score: ReadinessScore,
    grade: ProviderGrade,
    runtimeVersion: string,
    platformVersion: string,
  ): CertificationReport {
    const report: CertificationReport = {
      id: `rpt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      provider,
      runtimeVersion,
      platformVersion,
      scores: score,
      grade,
      status: score.overall >= 70 ? 'PASS' : 'FAIL',
      timestamp: new Date(),
      checksum: '',
    };

    report.checksum = createHash('sha256').update(JSON.stringify(report)).digest('hex');
    return report;
  }
}
