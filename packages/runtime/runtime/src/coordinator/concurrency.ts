/**
 * @module coordinator/concurrency
 * @description Concurrency control for parallel execution limits.
 */

export interface ConcurrencyConfig {
  maxWorkers: number;
  maxTools: number;
  maxProviders: number;
  maxApprovals: number;
  maxAgents: number;
  maxQueueSize: number;
  maxParallel: number;
  maxBatch: number;
}

export class ConcurrencyController {
  private active: Map<string, number> = new Map();
  private config: ConcurrencyConfig;

  constructor(config: ConcurrencyConfig) {
    this.config = config;
  }

  canAcquire(type: string): boolean {
    const limit = this.getLimit(type);
    const current = this.active.get(type) || 0;
    return current < limit;
  }

  acquire(type: string): boolean {
    if (!this.canAcquire(type)) {
      return false;
    }
    const current = this.active.get(type) || 0;
    this.active.set(type, current + 1);
    return true;
  }

  release(type: string): void {
    const current = this.active.get(type) || 0;
    this.active.set(type, Math.max(0, current - 1));
  }

  getUsage(type: string): number {
    return this.active.get(type) || 0;
  }

  private getLimit(type: string): number {
    switch (type) {
      case 'worker':
        return this.config.maxWorkers;
      case 'tool':
        return this.config.maxTools;
      case 'provider':
        return this.config.maxProviders;
      case 'approval':
        return this.config.maxApprovals;
      case 'agent':
        return this.config.maxAgents;
      case 'queue':
        return this.config.maxQueueSize;
      case 'parallel':
        return this.config.maxParallel;
      case 'batch':
        return this.config.maxBatch;
      default:
        return Infinity;
    }
  }

  reset(): void {
    this.active.clear();
  }
}
