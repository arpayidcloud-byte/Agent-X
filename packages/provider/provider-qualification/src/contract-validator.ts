/**
 * @module provider-qualification/contract-validator
 * @description Validates strict interface implementation.
 */

import type { IProvider } from '@agentx-fast/runtime-adapters';
import { ContractValidationError } from './errors.js';

export class ContractValidator {
  validate(provider: IProvider, requiredMethods: string[]): void {
    for (const method of requiredMethods) {
      if (typeof (provider as unknown as Record<string, unknown>)[method] !== 'function') {
        throw new ContractValidationError(
          `Provider ${provider.getMetadata().id} missing method: ${method}`,
          'contract-validator',
        );
      }
    }
  }
}
