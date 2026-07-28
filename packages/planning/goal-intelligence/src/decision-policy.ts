/**
 * @module goal-intelligence/decision-policy
 * @description Policy-driven decision making.
 */

export type DecisionPolicy = 'safe' | 'balanced' | 'aggressive' | 'human_approval';

export class DecisionPolicyManager {
  private policies: DecisionPolicy[] = ['safe', 'balanced', 'aggressive', 'human_approval'];

  getPolicies(): DecisionPolicy[] {
    return [...this.policies];
  }

  validate(policy: DecisionPolicy): boolean {
    return this.policies.includes(policy);
  }

  requiresApproval(policy: DecisionPolicy): boolean {
    return policy === 'human_approval' || policy === 'safe';
  }
}
