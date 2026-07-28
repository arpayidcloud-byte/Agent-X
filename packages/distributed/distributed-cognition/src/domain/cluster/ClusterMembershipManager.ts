import type { ClusterConfig, ClusterMembership } from './interfaces.js';
import { InvariantViolationError } from '../shared/errors.js';

/**
 * Invariant: createCluster() always initializes both this.configs
 * and this.memberships for the same clusterId.
 */
export class ClusterMembershipManager {
  private memberships = new Map<string, ClusterMembership[]>();
  private configs = new Map<string, ClusterConfig>();

  /**
   * Invariant: If cluster exists in configs, memberships[clusterId] is always initialized.
   */
  private getMembersInvariant(clusterId: string): ClusterMembership[] {
    const members = this.memberships.get(clusterId);
    if (!members) {
      throw new InvariantViolationError(
        `Invariant violated: memberships not initialized for cluster ${clusterId}`,
        'MEMBERSHIP_NOT_INITIALIZED',
        'ClusterMembershipManager',
      );
    }
    return members;
  }

  createCluster(config: ClusterConfig): void {
    if (this.configs.has(config.clusterId)) {
      throw new Error(`Cluster already exists: ${config.clusterId}`);
    }
    this.configs.set(config.clusterId, { ...config });
    this.memberships.set(config.clusterId, []);
  }

  joinCluster(clusterId: string, nodeId: string): ClusterMembership {
    const config = this.configs.get(clusterId);
    if (!config) throw new Error(`Cluster not found: ${clusterId}`);
    const members = this.getMembersInvariant(clusterId);
    if (members.some((m) => m.nodeId === nodeId)) {
      throw new Error(`Node already in cluster: ${nodeId}`);
    }
    if (members.length >= config.maxNodes) {
      throw new Error(`Cluster full: ${clusterId}`);
    }
    const membership: ClusterMembership = Object.freeze({
      nodeId,
      clusterId,
      joinedAt: new Date(),
      status: 'ACTIVE',
    });
    members.push(membership);
    return membership;
  }

  leaveCluster(clusterId: string, nodeId: string): void {
    const members = this.memberships.get(clusterId);
    if (!members) return;
    const idx = members.findIndex((m) => m.nodeId === nodeId);
    if (idx >= 0) members.splice(idx, 1);
  }

  getMembers(clusterId: string): ClusterMembership[] {
    return [...this.getMembersInvariant(clusterId)];
  }

  getConfig(clusterId: string): ClusterConfig | undefined {
    return this.configs.get(clusterId);
  }

  listClusters(): string[] {
    return Array.from(this.configs.keys());
  }
}
