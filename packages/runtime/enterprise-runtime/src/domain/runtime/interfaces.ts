export type RuntimeState =
  | 'CREATED'
  | 'INITIALIZING'
  | 'READY'
  | 'RUNNING'
  | 'PAUSED'
  | 'STOPPING'
  | 'STOPPED'
  | 'ERROR'
  | 'RECOVERING';

export interface RuntimeConfig {
  readonly runtimeId: string;
  readonly name: string;
  readonly version: string;
  readonly maxServices: number;
  readonly healthCheckIntervalMs: number;
}

export interface RuntimeInfo {
  readonly runtimeId: string;
  readonly state: RuntimeState;
  readonly uptime: number;
  readonly serviceCount: number;
  readonly startedAt: Date;
  readonly checksum: string;
}

export interface HealthStatus {
  readonly componentId: string;
  readonly status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  readonly lastCheck: Date;
  readonly details: Record<string, unknown>;
}
