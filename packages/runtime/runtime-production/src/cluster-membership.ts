/**
 * @module runtime-production/cluster-membership
 * @description Manages cluster node membership and leader election.
 */

import type { ClusterNode } from './interfaces.js';
import { ClusterError } from './errors.js';

export class ClusterMembership {
  private nodes = new Map<string, ClusterNode>();
  private leaderId: string | null = null;

  join(node: ClusterNode): void {
    if (this.nodes.has(node.id)) {
      throw new ClusterError(`Node already joined: ${node.id}`, 'cluster-membership');
    }
    this.nodes.set(node.id, node);
  }

  leave(nodeId: string): void {
    this.nodes.delete(nodeId);
    if (this.leaderId === nodeId) {
      this.leaderId = null;
      this.electLeader();
    }
  }

  heartbeat(nodeId: string): void {
    const node = this.nodes.get(nodeId) as ClusterNode | undefined;
    if (!node) {
      throw new ClusterError(`Node not found: ${nodeId}`, 'cluster-membership');
    }
    node.lastHeartbeat = new Date();
  }

  electLeader(): string {
    const activeNodes = this.listNodes().filter((n) => n.status === 'ACTIVE');
    if (activeNodes.length === 0) {
      throw new ClusterError('No active nodes for leader election', 'cluster-membership');
    }
    // Simple determinism: lexicographical order of ID
    activeNodes.sort((a, b) => a.id.localeCompare(b.id));
    const leader = activeNodes[0];
    if (!leader)
      throw new ClusterError('No active nodes for leader election', 'cluster-membership');
    this.leaderId = leader.id;
    return this.leaderId;
  }

  getLeader(): string | null {
    return this.leaderId;
  }

  listNodes(): ClusterNode[] {
    const now = Date.now();
    const threshold = 15000; // 15s node timeout
    for (const [_id, node] of this.nodes.entries()) {
      if (now - node.lastHeartbeat.getTime() > threshold) {
        node.status = 'DOWN';
      }
    }
    return Array.from(this.nodes.values());
  }

  clear(): void {
    this.nodes.clear();
    this.leaderId = null;
  }
}
