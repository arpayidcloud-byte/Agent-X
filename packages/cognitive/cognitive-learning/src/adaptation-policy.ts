/**
 * @module cognitive-learning/adaptation-policy
 * @description Policy-driven adaptation rules.
 */

import type { AdaptationPolicy } from './interfaces.js';

export class AdaptationPolicyManager {
  private policies: AdaptationPolicy[] = ['conservative', 'balanced', 'aggressive', 'strict'];

  getPolicies(): AdaptationPolicy[] {
    return [...this.policies];
  }

  validate(policy: AdaptationPolicy): boolean {
    return this.policies.includes(policy);
  }
}
