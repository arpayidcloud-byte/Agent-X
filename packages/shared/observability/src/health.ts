export interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface HealthCheck {
  name: string;
  check(): Promise<HealthCheckResult>;
}

export class HealthCheckManager {
  private checks: HealthCheck[] = [];

  register(check: HealthCheck): void {
    this.checks.push(check);
  }

  async runAll(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];
    for (const check of this.checks) {
      try {
        const result = await check.check();
        results.push(result);
      } catch (error) {
        results.push({
          name: check.name,
          status: 'unhealthy',
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date(),
        });
      }
    }
    return results;
  }

  async getOverallStatus(): Promise<'healthy' | 'unhealthy' | 'degraded'> {
    const results = await this.runAll();
    const hasUnhealthy = results.some((r) => r.status === 'unhealthy');
    const hasDegraded = results.some((r) => r.status === 'degraded');

    if (hasUnhealthy) return 'unhealthy';
    if (hasDegraded) return 'degraded';
    return 'healthy';
  }
}

export class DatabaseHealthCheck implements HealthCheck {
  name = 'database';

  constructor(private checkFn: () => Promise<boolean>) {}

  async check(): Promise<HealthCheckResult> {
    try {
      const isHealthy = await this.checkFn();
      return {
        name: this.name,
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'Database connection is healthy' : 'Database connection failed',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        name: this.name,
        status: 'unhealthy',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      };
    }
  }
}

export class RedisHealthCheck implements HealthCheck {
  name = 'redis';

  constructor(private checkFn: () => Promise<boolean>) {}

  async check(): Promise<HealthCheckResult> {
    try {
      const isHealthy = await this.checkFn();
      return {
        name: this.name,
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'Redis connection is healthy' : 'Redis connection failed',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        name: this.name,
        status: 'unhealthy',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      };
    }
  }
}

export class ProviderHealthCheck implements HealthCheck {
  name = 'provider';

  constructor(private checkFn: () => Promise<boolean>) {}

  async check(): Promise<HealthCheckResult> {
    try {
      const isHealthy = await this.checkFn();
      return {
        name: this.name,
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'Provider is healthy' : 'Provider is unhealthy',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        name: this.name,
        status: 'unhealthy',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      };
    }
  }
}
