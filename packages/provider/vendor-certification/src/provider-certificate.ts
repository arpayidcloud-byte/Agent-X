/**
 * @module vendor-certification/provider-certificate
 * @description Generates immutable certification certificates.
 */

import type { ProviderMetadata, ProviderGrade, CertificationCertificate } from './interfaces.js';
import { createHash } from 'crypto';

export class ProviderCertificate {
  generate(
    provider: ProviderMetadata,
    score: number,
    grade: ProviderGrade,
  ): CertificationCertificate {
    const id = `cert-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const signaturePayload = `${provider.id}:${provider.version}:${score}:${grade}:${id}`;
    const signature = createHash('sha256').update(signaturePayload).digest('hex');

    return {
      id,
      providerId: provider.id,
      providerVersion: provider.version,
      score,
      grade,
      signature,
      issuedAt: new Date(),
      certificationVersion: '1.0.0',
    };
  }
}
