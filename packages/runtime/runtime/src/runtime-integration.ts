/**
 * @module runtime/runtime-integration
 * @description Integration layer matching the runtime configuration.
 */

import { RuntimeDI } from './runtime-di.js';
import type { RuntimeBootstrapConfig } from './runtime-bootstrap-v2.js';
import type { PipelineResult } from './execution-pipeline.js';
import { ExecutionPipeline } from './execution-pipeline.js';
import type { RuntimeHealthReport } from './runtime-health-v2.js';
import type { ObservabilityMetrics } from './runtime-observability.js';
import type { RecoveryAction } from './runtime-recovery.js';
import { InMemoryAuditStore } from './audit-store.js';
import { MemoryCheckpointStore } from './checkpoint-store.js';
import { RuntimeRecovery } from './runtime-recovery.js';
import { RuntimeHealthService } from './runtime-health-v2.js';
import { RuntimeSupervisorV2 } from './runtime-supervisor-v2.js';
import { ObservabilityManager } from './runtime-observability.js';

export class RuntimeIntegration {
  private di!: RuntimeDI;

  constructor(config?: RuntimeBootstrapConfig) {
    this.init(config);
  }

  private init(config?: RuntimeBootstrapConfig): void {
    this.di = new RuntimeDI();
    const runtimeConfig = config?.config || {
      tokenBudget: 500000,
      costBudget: 100,
      maxParallelAgents: 10,
      maxWorkflows: 50,
      maxTools: 100,
      maxMemory: 1024 * 1024 * 100,
      maxContextTokens: 100000,
      defaultTimeoutMs: 60000,
      checkpointIntervalMs: 30000,
    };
    this.di.register('config', runtimeConfig);
    const auditStore = config?.auditStore || new InMemoryAuditStore();
    this.di.register('auditStore', auditStore);
    const checkpointStore = config?.checkpointStore || new MemoryCheckpointStore();
    this.di.register('checkpointStore', checkpointStore);
    const pipeline = new ExecutionPipeline(auditStore, runtimeConfig);
    this.di.register('pipeline', pipeline);
    const recovery = new RuntimeRecovery();
    this.di.register('recovery', recovery);
    const healthService = new RuntimeHealthService();
    this.di.register('healthService', healthService);
    const supervisor = new RuntimeSupervisorV2();
    this.di.register('supervisor', supervisor);
    const observability = new ObservabilityManager(auditStore);
    this.di.register('observability', observability);
  }

  async executeGoal(sessionId: string, goal: string): Promise<PipelineResult> {
    const pipeline = this.di.resolve<ExecutionPipeline>('pipeline');
    return pipeline.execute({ id: sessionId, traceId: `trace-${Date.now()}`, goal });
  }

  async getHealthReport(): Promise<RuntimeHealthReport> {
    const healthService = this.di.resolve<RuntimeHealthService>('healthService');
    return healthService.checkAll();
  }

  async getMetrics(): Promise<ObservabilityMetrics> {
    const observability = this.di.resolve<ObservabilityManager>('observability');
    return observability.getAggregatedMetrics();
  }

  getRecoveryHistory(): RecoveryAction[] {
    const recovery = this.di.resolve<RuntimeRecovery>('recovery');
    return recovery.getRecoveryHistory();
  }

  getDI(): RuntimeDI {
    return this.di;
  }
}
