/**
 * @module vendor-certification/provider-validator
 * @description Validates that a provider implements the correct interfaces.
 */

import type { IProvider } from './interfaces.js';
import { ValidationError } from './errors.js';

export class ProviderValidator {
  validate(provider: IProvider): void {
    if (!provider || typeof provider.getMetadata !== 'function') {
      throw new ValidationError('Provider does not implement getMetadata()', 'provider-validator');
    }
    if (typeof provider.getCapabilities !== 'function') {
      throw new ValidationError(
        'Provider does not implement getCapabilities()',
        'provider-validator',
      );
    }
    if (typeof provider.healthCheck !== 'function') {
      throw new ValidationError('Provider does not implement healthCheck()', 'provider-validator');
    }
  }
}
