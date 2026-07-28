/**
 * @module runtime/runtime-supervisor-v2
 * @description Enhanced runtime supervisor with monitoring and recovery.
 */

import type { RecoveryAction } from './runtime-recovery.js';
import { RuntimeRecovery } from './runtime-recovery.js';
import type { RuntimeHealthReport } from './runtime-health-v2.js';
import { RuntimeHealthService } from './runtime-health-v2.js';

export class RuntimeSupervisorV2 {
  private recovery: RuntimeRecovery;
  private healthService: RuntimeHealthService;
  private isRunning: boolean = false;

  constructor() {
    this.recovery = new RuntimeRecovery();
    this.healthService = new RuntimeHealthService();
    this.registerDefaultHealthChecks();
  }

  private registerDefaultHealthChecks(): void {
    this.healthService.registerCheck('runtime', async () => ({
      component: 'runtime',
      healthy: this.isRunning,
      latencyMs: 0,
      lastChecked: new Date(),
    }));
  }

  async start(): Promise<void> {
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }

  isHealthy(): boolean {
    return this.isRunning;
  }

  async getHealthReport(): Promise<RuntimeHealthReport> {
    return this.healthService.checkAll();
  }

  async handleAgentCrash(agentId: string): Promise<RecoveryAction> {
    return this.recovery.handleAgentCrash(agentId);
  }

  async handleToolTimeout(toolId: string): Promise<RecoveryAction> {
    return this.recovery.handleToolTimeout(toolId);
  }

  async handleHeartbeatLoss(agentId: string): Promise<RecoveryAction> {
    return this.recovery.handleHeartbeatLoss(agentId);
  }

  async handleApprovalTimeout(requestId: string): Promise<RecoveryAction> {
    return this.recovery.handleApprovalTimeout(requestId);
  }

  async handleCheckpointRecovery(workflowId: string): Promise<RecoveryAction> {
    return this.recovery.handleCheckpointRecovery(workflowId);
  }

  pause(): void {
    this.isRunning = false;
  }

  resume(): void {
    this.isRunning = true;
  }

  getRecoveryHistory(): RecoveryAction[] {
    return this.recovery.getRecoveryHistory();
  }
}
