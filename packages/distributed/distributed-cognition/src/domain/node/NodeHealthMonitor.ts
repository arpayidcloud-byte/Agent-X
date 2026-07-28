import type { NodeHealth, NodeStatus } from './interfaces.js';

export class NodeHealthMonitor {
  private healthRecords = new Map<string, NodeHealth[]>();
  private readonly maxHistory = 100;

  recordHealth(health: NodeHealth): void {
    const current = this.healthRecords.get(health.nodeId) || [];
    const updated = [...current, Object.freeze({ ...health })];
    if (updated.length > this.maxHistory) {
      updated.splice(0, updated.length - this.maxHistory);
    }
    this.healthRecords.set(health.nodeId, updated);
  }

  getLatestHealth(nodeId: string): NodeHealth | undefined {
    const records = this.healthRecords.get(nodeId);
    if (!records || records.length === 0) return undefined;
    return records[records.length - 1];
  }

  getHealthHistory(nodeId: string): NodeHealth[] {
    return [...(this.healthRecords.get(nodeId) || [])];
  }

  evaluateStatus(
    nodeId: string,
    cpuThreshold = 0.9,
    memoryThreshold = 0.9,
    latencyThreshold = 1000,
  ): NodeStatus {
    const latest = this.getLatestHealth(nodeId);
    if (!latest) return 'OFFLINE';
    if (latest.cpuUsage > cpuThreshold || latest.memoryUsage > memoryThreshold) return 'DEGRADED';
    if (latest.latencyMs > latencyThreshold || latest.errorRate > 0.1) return 'UNHEALTHY';
    return 'HEALTHY';
  }

  removeNode(nodeId: string): void {
    this.healthRecords.delete(nodeId);
  }

  clear(): void {
    this.healthRecords.clear();
  }
}
