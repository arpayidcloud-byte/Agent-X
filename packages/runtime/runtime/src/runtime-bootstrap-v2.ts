/**
 * @module runtime/runtime-bootstrap-v2
 * @description Bootstrap configuration for the production runtime.
 */

import type { RuntimeConfig } from './interfaces.js';
import type { IAuditStore } from './audit-store.js';
import { InMemoryAuditStore } from './audit-store.js';
import type { ICheckpointStore } from './checkpoint-store.js';
import { MemoryCheckpointStore } from './checkpoint-store.js';
import { ExecutionPipeline } from './execution-pipeline.js';
import { RuntimeRecovery } from './runtime-recovery.js';
import { RuntimeHealthService } from './runtime-health-v2.js';
import { RuntimeSupervisorV2 } from './runtime-supervisor-v2.js';
import { ObservabilityManager } from './runtime-observability.js';
import { RuntimeDI } from './runtime-di.js';

export interface RuntimeBootstrapConfig {
  config: RuntimeConfig;
  auditStore?: IAuditStore;
  checkpointStore?: ICheckpointStore;
  useMemoryStores?: boolean;
}

export class RuntimeBootstrap {
  private di: RuntimeDI;

  constructor() {
    this.di = new RuntimeDI();
  }

  async bootstrap(config?: RuntimeBootstrapConfig): Promise<RuntimeDI> {
    const runtimeConfig: RuntimeConfig = config?.config || {
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

    return this.di;
  }

  getDI(): RuntimeDI {
    return this.di;
  }
}
