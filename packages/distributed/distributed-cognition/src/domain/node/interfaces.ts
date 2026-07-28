/** Node domain interfaces and types. */

export type NodeStatus =
  | 'REGISTERED'
  | 'ACTIVE'
  | 'HEALTHY'
  | 'DEGRADED'
  | 'UNHEALTHY'
  | 'OFFLINE'
  | 'DRAINING'
  | 'REJOINING';

export interface NodeMetadata {
  readonly nodeId: string;
  readonly name: string;
  readonly version: string;
  readonly capabilities: readonly string[];
  readonly priority: number;
  readonly maxSlots: number;
  readonly region: string;
}

export interface NodeRegistration {
  readonly metadata: NodeMetadata;
  readonly registeredAt: Date;
  readonly lastHeartbeat: Date;
  readonly status: NodeStatus;
  readonly currentLoad: number;
}

export interface NodeHealth {
  readonly nodeId: string;
  readonly cpuUsage: number;
  readonly memoryUsage: number;
  readonly latencyMs: number;
  readonly errorRate: number;
  readonly lastCheck: Date;
  readonly status: NodeStatus;
}

export interface NodeCapability {
  readonly name: string;
  readonly version: string;
  readonly weight: number;
}
