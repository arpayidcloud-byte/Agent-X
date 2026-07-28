/**
 * @module workflow-orchestration/resource-validator
 * @description Validates resource availability.
 */

import { ResourceExhaustedError } from './errors.js';

export class ResourceValidator {
  validate(used: number, max: number, type: string): void {
    if (used > max) {
      throw new ResourceExhaustedError(
        `${type} exceeded ceiling: ${used} > ${max}`,
        'resource-validator',
      );
    }
  }
}
