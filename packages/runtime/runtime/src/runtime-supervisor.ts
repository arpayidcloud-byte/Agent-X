/**
 * @module runtime/runtime-supervisor
 * @description Runtime supervisor for monitoring and recovery.
 */

import { HealthChecker, defaultHealthCheck } from './runtime-health.js';

export class RuntimeSupervisor {
  private healthChecker: HealthChecker;
  private isRunning = false;

  constructor() {
    this.healthChecker = new HealthChecker();
    this.registerDefaultChecks();
  }

  private registerDefaultChecks(): void {
    const components = [
      'planning',
      'workflow',
      'memory',
      'knowledge',
      'context',
      'approval',
      'toolSDK',
      'agentPool',
      'eventBus',
      'metrics',
    ];
    for (const component of components) {
      this.healthChecker.register(component, () => defaultHealthCheck(component));
    }
  }

  start(): void {
    this.isRunning = true;
  }

  stop(): void {
    this.isRunning = false;
  }

  isHealthy(): boolean {
    return this.isRunning && this.healthChecker.isHealthy();
  }

  getHealthStatus() {
    return this.healthChecker.checkAll();
  }

  pause(): void {
    this.isRunning = false;
  }

  resume(): void {
    this.isRunning = true;
  }
}
