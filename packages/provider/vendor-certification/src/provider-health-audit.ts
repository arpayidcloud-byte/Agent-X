/**
 * @module vendor-certification/provider-health-audit
 * @description Validates provider health characteristics.
 */

import type { IProvider, AuditResult } from './interfaces.js';
import { ValidationError } from './errors.js';

export class ProviderHealthAudit {
  async run(provider: IProvider): Promise<AuditResult> {
    const health = await provider.healthCheck();

    if (!health.healthy) {
      throw new ValidationError(
        `Provider health check failed: ${provider.getMetadata().id}`,
        'health-audit',
      );
    }

    return {
      passed: true,
      score: health.latencyMs < 50 ? 100 : health.latencyMs < 100 ? 80 : 50,
      details: { latencyMs: health.latencyMs, status: health.status },
      timestamp: new Date(),
    };
  }
}
