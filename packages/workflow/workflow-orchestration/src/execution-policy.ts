/**
 * @module workflow-orchestration/execution-policy
 * @description Execution policy definitions.
 */

export type ExecutionPolicy = 'safe' | 'balanced' | 'aggressive' | 'approval_required';

export class ExecutionPolicyManager {
  private policies: ExecutionPolicy[] = ['safe', 'balanced', 'aggressive', 'approval_required'];

  getAvailablePolicies(): ExecutionPolicy[] {
    return [...this.policies];
  }

  validate(policy: ExecutionPolicy): boolean {
    return this.policies.includes(policy);
  }

  requiresApproval(policy: ExecutionPolicy): boolean {
    return policy === 'approval_required' || policy === 'safe';
  }
}
