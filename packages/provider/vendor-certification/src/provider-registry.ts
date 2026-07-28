/**
 * @module vendor-certification/provider-registry
 * @description Stores certified production providers.
 */

import type { CertificationCertificate } from './interfaces.js';
import { IntegrityError } from './errors.js';

export class ProviderRegistry {
  private certifiedProviders = new Map<string, CertificationCertificate>();

  register(cert: CertificationCertificate): void {
    if (this.certifiedProviders.has(cert.providerId)) {
      throw new IntegrityError(`Provider ${cert.providerId} already registered`, 'registry');
    }
    this.certifiedProviders.set(cert.providerId, cert);
  }

  resolve(providerId: string): CertificationCertificate | undefined {
    return this.certifiedProviders.get(providerId);
  }

  isRegistered(providerId: string): boolean {
    return this.certifiedProviders.has(providerId);
  }

  clear(): void {
    this.certifiedProviders.clear();
  }
}
