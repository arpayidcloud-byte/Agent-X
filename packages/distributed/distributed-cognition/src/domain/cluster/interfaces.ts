/** Cluster domain interfaces and types. */

export type ClusterStatus =
  'FORMING' | 'ACTIVE' | 'REBALANCING' | 'SPLIT' | 'DISSOLVING' | 'DISSOLVED';

export interface ClusterConfig {
  readonly clusterId: string;
  readonly name: string;
  readonly minNodes: number;
  readonly maxNodes: number;
  readonly heartbeatIntervalMs: number;
  readonly failureThreshold: number;
}

export interface ClusterMembership {
  readonly nodeId: string;
  readonly clusterId: string;
  readonly joinedAt: Date;
  readonly status: 'PENDING' | 'ACTIVE' | 'LEAVING';
}

export interface ClusterState {
  readonly clusterId: string;
  readonly status: ClusterStatus;
  readonly members: readonly string[];
  readonly leader: string | null;
  readonly version: number;
  readonly checksum: string;
}
