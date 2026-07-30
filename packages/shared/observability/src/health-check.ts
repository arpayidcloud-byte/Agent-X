export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ProviderHealth {
  name: string;
  status: HealthStatus;
  lastChecked: string;
}

export interface HealthReport {
  status: HealthStatus;
  uptime: number;
  providers: ProviderHealth[];
  timestamp: string;
}

export class HealthChecker {
  private providers: Map<string, HealthStatus> = new Map();
  private startTime: number = Date.now();

  registerProvider(name: string, status: HealthStatus): void {
    this.providers.set(name, status);
  }

  check(): HealthStatus {
    if (this.providers.size === 0) {
      return 'healthy';
    }

    let hasUnhealthy = false;
    let hasDegraded = false;

    for (const status of this.providers.values()) {
      if (status === 'unhealthy') {
        hasUnhealthy = true;
      } else if (status === 'degraded') {
        hasDegraded = true;
      }
    }

    if (hasUnhealthy) {
      return 'unhealthy';
    }
    if (hasDegraded) {
      return 'degraded';
    }
    return 'healthy';
  }

  getHealthReport(): HealthReport {
    const providers: ProviderHealth[] = [];
    for (const [name, status] of this.providers) {
      providers.push({
        name,
        status,
        lastChecked: new Date().toISOString(),
      });
    }

    return {
      status: this.check(),
      uptime: Date.now() - this.startTime,
      providers,
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthChecker = new HealthChecker();
