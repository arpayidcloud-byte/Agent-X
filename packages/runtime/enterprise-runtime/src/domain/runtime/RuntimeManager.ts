import type { RuntimeState, HealthStatus } from './interfaces.js';
import { InvariantViolationError } from '../shared/errors.js';

export class RuntimeLifecycleManager {
  private state: RuntimeState = 'CREATED';
  private transitions: Array<{ from: RuntimeState; to: RuntimeState; timestamp: Date }> = [];

  transition(newState: RuntimeState): void {
    const validTransitions: Record<RuntimeState, RuntimeState[]> = {
      CREATED: ['INITIALIZING'],
      INITIALIZING: ['READY', 'ERROR'],
      READY: ['RUNNING', 'STOPPING'],
      RUNNING: ['PAUSED', 'STOPPING', 'ERROR'],
      PAUSED: ['RUNNING', 'STOPPING'],
      STOPPING: ['STOPPED'],
      STOPPED: ['INITIALIZING'],
      ERROR: ['RECOVERING', 'STOPPING'],
      RECOVERING: ['RUNNING', 'ERROR'],
    };
    if (!validTransitions[this.state]?.includes(newState)) {
      throw new InvariantViolationError(
        `Invalid transition: ${this.state} -> ${newState}`,
        'INVALID_TRANSITION',
        'RuntimeLifecycleManager',
      );
    }
    this.transitions.push({ from: this.state, to: newState, timestamp: new Date() });
    this.state = newState;
  }

  getState(): RuntimeState {
    return this.state;
  }

  getTransitions(): Array<{ from: RuntimeState; to: RuntimeState; timestamp: Date }> {
    return [...this.transitions];
  }
}

export class RuntimeStateManager {
  private data = new Map<string, unknown>();

  set(key: string, value: unknown): void {
    this.data.set(key, typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value);
  }

  get(key: string): unknown {
    const val = this.data.get(key);
    return typeof val === 'object' ? JSON.parse(JSON.stringify(val)) : val;
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  delete(key: string): boolean {
    return this.data.delete(key);
  }

  keys(): string[] {
    return Array.from(this.data.keys());
  }
}

export class RuntimeSupervisor {
  private healthChecks = new Map<string, () => HealthStatus>();

  register(componentId: string, check: () => HealthStatus): void {
    this.healthChecks.set(componentId, check);
  }

  unregister(componentId: string): void {
    this.healthChecks.delete(componentId);
  }

  checkAll(): HealthStatus[] {
    const results: HealthStatus[] = [];
    for (const [, check] of this.healthChecks) {
      results.push(check());
    }
    return results;
  }

  isHealthy(): boolean {
    return this.checkAll().every((h) => h.status !== 'UNHEALTHY');
  }
}

export class RuntimeHealthManager {
  private statuses = new Map<string, HealthStatus>();

  update(status: HealthStatus): void {
    this.statuses.set(status.componentId, status);
  }

  get(componentId: string): HealthStatus | undefined {
    return this.statuses.get(componentId);
  }

  getAll(): HealthStatus[] {
    return Array.from(this.statuses.values());
  }

  isHealthy(): boolean {
    return this.getAll().every((h) => h.status !== 'UNHEALTHY');
  }

  clear(): void {
    this.statuses.clear();
  }
}
