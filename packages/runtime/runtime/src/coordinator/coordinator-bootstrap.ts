/**
 * @module coordinator/coordinator-bootstrap
 * @description Bootstrap configuration for the Execution Coordinator.
 */

import type { CoordinatorConfig } from './interfaces.js';
import { ProductionExecutionCoordinator } from './coordinator.js';
import type { IEventBus } from '@agentx-fast/core-runtime';

export interface CoordinatorBootstrapOptions {
  config?: Partial<CoordinatorConfig>;
  eventBus: IEventBus;
}

export class CoordinatorBootstrap {
  async bootstrap(options: CoordinatorBootstrapOptions): Promise<ProductionExecutionCoordinator> {
    const config: CoordinatorConfig = {
      maxParallelExecutions: 10,
      maxQueueSize: 100,
      defaultTimeoutMs: 60000,
      retryBudget: 3,
      tokenBudget: 100000,
      costBudget: 50.0,
      ...options.config,
    };

    const coordinator = new ProductionExecutionCoordinator(options.eventBus, config);
    return coordinator;
  }
}
