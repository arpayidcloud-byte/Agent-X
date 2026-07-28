/**
 * @module vendor-certification/certification-history
 * @description Maintains historical records of certifications.
 */

import type { CertificationReport } from './interfaces.js';

export class CertificationHistory {
  private history: CertificationReport[] = [];

  add(report: CertificationReport): void {
    this.history.push(report);
  }

  getAll(): CertificationReport[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
  }
}
