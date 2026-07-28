/**
 * @module runtime/runtime-health-v2
 * @description Enhanced health check service for all runtime components.
 */

export interface HealthCheckResult {
  component: string;
  healthy: boolean;
  latencyMs: number;
  lastChecked: Date;
  details?: Record<string, unknown>;
  error?: string;
}

export interface RuntimeHealthReport {
  overall: boolean;
  components: HealthCheckResult[];
  timestamp: Date;
  uptimeMs: number;
}

export class RuntimeHealthService {
  private checks = new Map<string, () => Promise<HealthCheckResult>>();
  private startTime: number = Date.now();
  private lastResults = new Map<string, HealthCheckResult>();

  registerCheck(component: string, checkFn: () => Promise<HealthCheckResult>): void {
    this.checks.set(component, checkFn);
  }

  async checkComponent(component: string): Promise<HealthCheckResult> {
    const checkFn = this.checks.get(component) as (() => Promise<HealthCheckResult>) | undefined;
    if (!checkFn) {
      return {
        component,
        healthy: false,
        latencyMs: 0,
        lastChecked: new Date(),
        error: 'Component not registered',
      };
    }
    const result = await checkFn();
    this.lastResults.set(component, result);
    return result;
  }

  async checkAll(): Promise<RuntimeHealthReport> {
    const components: HealthCheckResult[] = [];
    for (const [component] of this.checks) {
      components.push(await this.checkComponent(component));
    }
    return {
      overall: components.every((c) => c.healthy),
      components,
      timestamp: new Date(),
      uptimeMs: Date.now() - this.startTime,
    };
  }

  getLastResults(): Map<string, HealthCheckResult> {
    return new Map(this.lastResults);
  }
}
