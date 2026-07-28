/**
 * @module coordinator/coordinator-health
 * @description Health checking service for all coordinator components.
 */

import type { CoordinatorHealthStatus } from './interfaces.js';

export class CoordinatorHealthChecker {
  private checks = new Map<string, () => CoordinatorHealthStatus>();

  register(component: string, checkFn: () => CoordinatorHealthStatus): void {
    this.checks.set(component, checkFn);
  }

  check(component: string): CoordinatorHealthStatus {
    const fn = this.checks.get(component);
    if (!fn) {
      return { component, healthy: false, details: { error: 'Not registered' } };
    }
    return fn();
  }

  checkAll(): CoordinatorHealthStatus[] {
    return Array.from(this.checks.values()).map((fn) => fn());
  }

  isHealthy(): boolean {
    return this.checkAll().every((status) => status.healthy);
  }
}
