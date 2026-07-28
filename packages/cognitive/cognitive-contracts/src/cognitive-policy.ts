/**
 * @module cognitive-contracts/cognitive-policy
 * @description Safety and policy verification.
 */

import type { SafetyPolicy } from './interfaces.js';
import { SafetyViolationError } from './errors.js';

export class CognitivePolicyEnforcer {
  enforce(policy: SafetyPolicy, currentConfidence: number): void {
    if (currentConfidence < policy.confidenceThreshold) {
      throw new SafetyViolationError(
        `Confidence ${currentConfidence} below threshold ${policy.confidenceThreshold}`,
        'policy-enforcer',
      );
    }
  }
}
