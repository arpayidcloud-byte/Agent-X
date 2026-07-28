/**
 * @module workflow-orchestration/replanning-policy
 * @description Policy-driven replanning decisions.
 */

export type ReplanningPolicy = 'conservative' | 'balanced' | 'aggressive';

export class ReplanningPolicyManager {
  validate(policy: ReplanningPolicy): boolean {
    return ['conservative', 'balanced', 'aggressive'].includes(policy);
  }
}
