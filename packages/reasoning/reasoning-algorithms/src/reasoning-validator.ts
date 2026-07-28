/**
 * @module reasoning-algorithms/reasoning-validator
 * @description Graph and rule validator.
 */

import type { Rule } from './interfaces.js';
import { IntegrityError } from './errors.js';

export class ReasoningValidator {
  validateRules(rules: Rule[]): void {
    const ids = new Set<string>();
    for (const rule of rules) {
      if (ids.has(rule.id)) {
        throw new IntegrityError(`Duplicate rule ID detected: ${rule.id}`, 'validator');
      }
      ids.add(rule.id);
    }
  }
}
