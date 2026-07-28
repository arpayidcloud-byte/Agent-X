/**
 * @module runtime/runtime-health
 * @description Health check endpoints for all runtime components.
 */

import type { HealthStatus } from './interfaces.js';

export class HealthChecker {
  private checks = new Map<string, () => HealthStatus>();

  /**
   * Registers a health check
   * @param component - Component name
   * @param checkFn - Health check function
   */
  register(component: string, checkFn: () => HealthStatus): void {
    this.checks.set(component, checkFn);
  }

  /**
   * Checks health of a specific component
   * @param component - Component name
   * @returns HealthStatus
   */
  check(component: string): HealthStatus {
    const checkFn = this.checks.get(component) as (() => HealthStatus) | undefined;
    if (!checkFn) {
      return {
        component,
        healthy: false,
        latencyMs: 0,
        details: { error: 'Component not registered' },
      };
    }
    return checkFn();
  }

  /**
   * Checks all components
   * @returns Array of HealthStatus
   */
  checkAll(): HealthStatus[] {
    const results: HealthStatus[] = [];
    for (const [, checkFn] of this.checks) {
      results.push(checkFn());
    }
    return results;
  }

  /**
   * Checks if all components are healthy
   * @returns true if all healthy
   */
  isHealthy(): boolean {
    return this.checkAll().every((status) => status.healthy);
  }
}

/**
 * Creates a default health check for a component
 * @param component - Component name
 * @returns HealthStatus
 */
export function defaultHealthCheck(_component: string): HealthStatus {
  return { component: _component, healthy: true, latencyMs: 0 };
}
