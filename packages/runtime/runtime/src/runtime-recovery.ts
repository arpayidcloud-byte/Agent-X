/**
 * @module runtime/runtime-recovery
 * @description Recovery integration for automatic fault handling.
 */

export interface RecoveryAction {
  type: 'restart_agent' | 'retry_workflow' | 'restore_checkpoint' | 'pause_runtime';
  targetId: string;
  reason: string;
  timestamp: Date;
}

export interface RecoveryPolicy {
  maxRetries: number;
  retryDelayMs: number;
  enableCheckpointRecovery: boolean;
  enableAgentRestart: boolean;
}

export class RuntimeRecovery {
  private policy: RecoveryPolicy;
  private recoveryHistory: RecoveryAction[] = [];

  constructor(policy: Partial<RecoveryPolicy> = {}) {
    this.policy = {
      maxRetries: policy.maxRetries ?? 3,
      retryDelayMs: policy.retryDelayMs ?? 5000,
      enableCheckpointRecovery: policy.enableCheckpointRecovery ?? true,
      enableAgentRestart: policy.enableAgentRestart ?? true,
    };
  }

  async handleAgentCrash(agentId: string): Promise<RecoveryAction> {
    const action: RecoveryAction = {
      type: 'restart_agent',
      targetId: agentId,
      reason: 'Agent crash detected',
      timestamp: new Date(),
    };
    this.recoveryHistory.push(action);
    return action;
  }

  async handleToolTimeout(toolId: string): Promise<RecoveryAction> {
    const action: RecoveryAction = {
      type: 'retry_workflow',
      targetId: toolId,
      reason: 'Tool execution timeout',
      timestamp: new Date(),
    };
    this.recoveryHistory.push(action);
    return action;
  }

  async handleWorkflowRetry(workflowId: string): Promise<RecoveryAction> {
    const action: RecoveryAction = {
      type: 'retry_workflow',
      targetId: workflowId,
      reason: 'Workflow retry requested',
      timestamp: new Date(),
    };
    this.recoveryHistory.push(action);
    return action;
  }

  async handleHeartbeatLoss(agentId: string): Promise<RecoveryAction> {
    const action: RecoveryAction = {
      type: 'restart_agent',
      targetId: agentId,
      reason: 'Heartbeat loss detected',
      timestamp: new Date(),
    };
    this.recoveryHistory.push(action);
    return action;
  }

  async handleApprovalTimeout(requestId: string): Promise<RecoveryAction> {
    const action: RecoveryAction = {
      type: 'pause_runtime',
      targetId: requestId,
      reason: 'Approval request timed out',
      timestamp: new Date(),
    };
    this.recoveryHistory.push(action);
    return action;
  }

  async handleCheckpointRecovery(workflowId: string): Promise<RecoveryAction> {
    const action: RecoveryAction = {
      type: 'restore_checkpoint',
      targetId: workflowId,
      reason: 'Checkpoint recovery requested',
      timestamp: new Date(),
    };
    this.recoveryHistory.push(action);
    return action;
  }

  getRecoveryHistory(): RecoveryAction[] {
    return [...this.recoveryHistory];
  }

  getPolicy(): RecoveryPolicy {
    return { ...this.policy };
  }
}
