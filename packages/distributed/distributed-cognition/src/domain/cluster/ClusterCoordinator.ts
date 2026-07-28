import { createHash } from 'crypto';
import type { ClusterState, ClusterStatus } from './interfaces.js';

export class ClusterCoordinator {
  private states = new Map<string, ClusterState>();

  initialize(clusterId: string, members: string[]): ClusterState {
    const checksum = createHash('sha256')
      .update(JSON.stringify({ clusterId, members, version: 1 }))
      .digest('hex');
    const state: ClusterState = Object.freeze({
      clusterId,
      status: 'FORMING',
      members: [...members],
      leader: null,
      version: 1,
      checksum,
    });
    this.states.set(clusterId, state);
    return state;
  }

  electLeader(clusterId: string, nodeId: string): ClusterState {
    const current = this.states.get(clusterId);
    if (!current) throw new Error(`Cluster not found: ${clusterId}`);
    if (!current.members.includes(nodeId)) throw new Error(`Node not in cluster: ${nodeId}`);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ ...current, leader: nodeId, version: current.version + 1 }))
      .digest('hex');
    const updated: ClusterState = Object.freeze({
      ...current,
      leader: nodeId,
      version: current.version + 1,
      checksum,
    });
    this.states.set(clusterId, updated);
    return updated;
  }

  transition(clusterId: string, newStatus: ClusterStatus): ClusterState {
    const current = this.states.get(clusterId);
    if (!current) throw new Error(`Cluster not found: ${clusterId}`);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ ...current, status: newStatus, version: current.version + 1 }))
      .digest('hex');
    const updated: ClusterState = Object.freeze({
      ...current,
      status: newStatus,
      version: current.version + 1,
      checksum,
    });
    this.states.set(clusterId, updated);
    return updated;
  }

  getState(clusterId: string): ClusterState | undefined {
    return this.states.get(clusterId);
  }

  removeNode(clusterId: string, nodeId: string): ClusterState {
    const current = this.states.get(clusterId);
    if (!current) throw new Error(`Cluster not found: ${clusterId}`);
    const members = current.members.filter((m) => m !== nodeId);
    const leader = current.leader === nodeId ? null : current.leader;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ clusterId, members, version: current.version + 1 }))
      .digest('hex');
    const updated: ClusterState = Object.freeze({
      ...current,
      members,
      leader,
      version: current.version + 1,
      checksum,
    });
    this.states.set(clusterId, updated);
    return updated;
  }
}
