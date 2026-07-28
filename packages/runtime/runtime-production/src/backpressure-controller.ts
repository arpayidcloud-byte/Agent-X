/**
 * @module runtime-production/backpressure-controller
 * @description Monitors system utilization thresholds and flags backpressure limits.
 */

import type { BackpressureConfig } from './interfaces.js';
import { BackpressureError } from './errors.js';

export class BackpressureController {
  private config: BackpressureConfig;

  constructor(config: BackpressureConfig) {
    this.config = config;
  }

  checkLimits(current: {
    cpu: number;
    memory: number;
    queueLength: number;
    tokens: number;
    cost: number;
  }): void {
    if (current.cpu > this.config.cpuThreshold) {
      throw new BackpressureError('CPU threshold exceeded', 'backpressure-controller');
    }
    if (current.memory > this.config.memoryThreshold) {
      throw new BackpressureError('Memory threshold exceeded', 'backpressure-controller');
    }
    if (current.queueLength > this.config.queueLengthThreshold) {
      throw new BackpressureError('Queue length threshold exceeded', 'backpressure-controller');
    }
    if (current.tokens > this.config.tokenThreshold) {
      throw new BackpressureError('Token threshold exceeded', 'backpressure-controller');
    }
    if (current.cost > this.config.costThreshold) {
      throw new BackpressureError('Cost threshold exceeded', 'backpressure-controller');
    }
  }

  getConfig(): BackpressureConfig {
    return this.config;
  }
}
