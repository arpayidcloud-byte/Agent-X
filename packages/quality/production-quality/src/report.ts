/**
 * @module production-quality/report
 * @description Generates the immutable ProductionQualityReport.
 */

import type { ProductionQualityReport, ValidationScore, QualityGrade } from './interfaces.js';
import { createHash } from 'crypto';

export class ReportGenerator {
  generate(
    traceId: string,
    packageId: string,
    score: ValidationScore,
    grade: QualityGrade,
    failures: number,
    edgeCases: number,
  ): ProductionQualityReport {
    const report: ProductionQualityReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date(),
      traceId,
      packageId,
      score,
      grade,
      failureCount: failures,
      edgeCasesValidated: edgeCases,
      details: {},
      checksum: '',
    };

    report.checksum = createHash('sha256').update(JSON.stringify(report)).digest('hex');
    return Object.freeze(report);
  }
}
