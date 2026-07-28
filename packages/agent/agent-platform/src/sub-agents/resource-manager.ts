import type { ResourceAllocation, ResourceUsage } from './interfaces.js';
import { ResourceLimitExceededError } from './errors.js';

export class ResourceManager {
  private globalLimits: ResourceAllocation;
  private currentUsage: ResourceUsage;
  private activeAgents = new Set<string>();

  constructor(globalLimits: ResourceAllocation) {
    this.globalLimits = globalLimits;
    this.currentUsage = {
      cpuTimeMs: 0,
      memoryBytes: 0,
      tokensUsed: 0,
      costUsd: 0,
      activeProviders: 0,
      activeTools: 0,
    };
  }

  public registerAgent(agentId: string, requestedAllocation: ResourceAllocation): void {
    if (
      this.currentUsage.costUsd + requestedAllocation.costCeilingUsd >
        this.globalLimits.costCeilingUsd ||
      this.currentUsage.tokensUsed + requestedAllocation.tokenBudget > this.globalLimits.tokenBudget
    ) {
      throw new ResourceLimitExceededError('Global budget exceeded');
    }

    if (
      this.currentUsage.activeProviders + requestedAllocation.maxConcurrentProviders >
      this.globalLimits.maxConcurrentProviders
    ) {
      throw new ResourceLimitExceededError('Max concurrent providers exceeded');
    }

    this.activeAgents.add(agentId);
  }

  public unregisterAgent(agentId: string): void {
    this.activeAgents.delete(agentId);
  }

  public recordUsage(usage: Partial<ResourceUsage>): void {
    if (usage.cpuTimeMs) this.currentUsage.cpuTimeMs += usage.cpuTimeMs;
    if (usage.memoryBytes)
      this.currentUsage.memoryBytes = Math.max(this.currentUsage.memoryBytes, usage.memoryBytes);
    if (usage.tokensUsed) this.currentUsage.tokensUsed += usage.tokensUsed;
    if (usage.costUsd) this.currentUsage.costUsd += usage.costUsd;

    // Check caps after recording
    if (this.currentUsage.costUsd > this.globalLimits.costCeilingUsd) {
      throw new ResourceLimitExceededError('Cost ceiling exceeded during execution');
    }
  }

  public getIdleAgentsCount(poolTotal: number): number {
    return Math.max(0, poolTotal - this.activeAgents.size);
  }

  public getBusyAgentsCount(): number {
    return this.activeAgents.size;
  }
}
