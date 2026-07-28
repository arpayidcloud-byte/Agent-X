/**
 * @module vendor-certification/provider-grade
 * @description Maps scores to provider grades.
 */

import type { ProviderGrade } from './interfaces.js';

export class ProviderGrader {
  getGrade(score: number): ProviderGrade {
    if (score >= 95) return 'Production';
    if (score >= 90) return 'Enterprise';
    if (score >= 80) return 'Certified';
    if (score >= 70) return 'Conditionally Certified';
    if (score > 0) return 'Experimental';
    return 'Rejected';
  }
}
