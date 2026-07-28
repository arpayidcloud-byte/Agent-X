/**
 * @module architecture-sdk/developer-validator
 * @description Validates developer adherence to architecture constraints.
 */

import type { PackageMetadata } from './interfaces.js';
import { ValidationError } from './errors.js';

export class DeveloperValidator {
  validate(pkg: PackageMetadata, frozenStatus: Record<string, boolean>): void {
    if (pkg.status === 'active' && frozenStatus[pkg.id]) {
      throw new ValidationError(
        `Package ${pkg.id} is frozen and cannot be active`,
        'developer-validator',
      );
    }
  }
}
