/**
 * @module provider-sdk/schema-validator
 * @description Manifest configuration validation.
 */

import type { ProviderManifest } from './interfaces.js';
import { ValidationFailedError } from './errors.js';

export class SchemaValidator {
  validateManifest(manifest: ProviderManifest): void {
    if (!manifest.id || !manifest.name || !manifest.version) {
      throw new ValidationFailedError('Invalid manifest schema', 'schema-validator');
    }
  }
}
