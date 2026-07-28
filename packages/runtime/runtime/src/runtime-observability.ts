/**
 * @module runtime/runtime-observability
 * @description Observability integration for all engines.
 */

import type { IAuditStore } from './audit-store.js';

export interface ObservabilityMetrics {
  runtime: {
    executionTimeMs: number;
    sessionCount: number;
    activeSessions: number;
  };
  workflow: {
    totalWorkflows: number;
    completedWorkflows: number;
    failedWorkflows: number;
  };
  tool: {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    averageExecutionTimeMs: number;
  };
  agent: {
    totalInvocations: number;
    activeAgents: number;
    averageCompletionTimeMs: number;
  };
  approval: {
    totalRequests: number;
    approvedCount: number;
    rejectedCount: number;
    expiredCount: number;
    averageDelayMs: number;
  };
  memory: {
    totalEntries: number;
    hitRate: number;
    avgImportance: number;
  };
  planning: {
    totalPlans: number;
    averageTaskCount: number;
    averageRiskScore: number;
  };
  knowledge: {
    totalDocuments: number;
    totalNodes: number;
    averageConfidence: number;
  };
  context: {
    totalContexts: number;
    averageTokens: number;
    compressionRatio: number;
  };
  health: {
    overallHealthy: boolean;
    componentCount: number;
    unhealthyCount: number;
  };
}

export class ObservabilityManager {
  private auditStore: IAuditStore;
  private metrics: ObservabilityMetrics;

  constructor(auditStore: IAuditStore) {
    this.auditStore = auditStore;
    this.metrics = this.createDefaultMetrics();
  }

  private createDefaultMetrics(): ObservabilityMetrics {
    return {
      runtime: { executionTimeMs: 0, sessionCount: 0, activeSessions: 0 },
      workflow: { totalWorkflows: 0, completedWorkflows: 0, failedWorkflows: 0 },
      tool: { totalCalls: 0, successfulCalls: 0, failedCalls: 0, averageExecutionTimeMs: 0 },
      agent: { totalInvocations: 0, activeAgents: 0, averageCompletionTimeMs: 0 },
      approval: {
        totalRequests: 0,
        approvedCount: 0,
        rejectedCount: 0,
        expiredCount: 0,
        averageDelayMs: 0,
      },
      memory: { totalEntries: 0, hitRate: 0, avgImportance: 0 },
      planning: { totalPlans: 0, averageTaskCount: 0, averageRiskScore: 0 },
      knowledge: { totalDocuments: 0, totalNodes: 0, averageConfidence: 0 },
      context: { totalContexts: 0, averageTokens: 0, compressionRatio: 1 },
      health: { overallHealthy: true, componentCount: 0, unhealthyCount: 0 },
    };
  }

  async getAggregatedMetrics(): Promise<ObservabilityMetrics> {
    const records = await this.auditStore.getAll();
    this.metrics.runtime.sessionCount = Math.max(this.metrics.runtime.sessionCount, records.length);
    this.metrics.runtime.activeSessions = Math.max(
      this.metrics.runtime.activeSessions,
      records.filter((r) => r.result === 'success').length,
    );
    return { ...this.metrics };
  }

  updateRuntimeMetrics(
    executionTimeMs: number,
    sessionCount: number,
    activeSessions: number,
  ): void {
    this.metrics.runtime = { executionTimeMs, sessionCount, activeSessions };
  }

  updateWorkflowMetrics(total: number, completed: number, failed: number): void {
    this.metrics.workflow = {
      totalWorkflows: total,
      completedWorkflows: completed,
      failedWorkflows: failed,
    };
  }

  updateToolMetrics(total: number, successful: number, failed: number, avgTime: number): void {
    this.metrics.tool = {
      totalCalls: total,
      successfulCalls: successful,
      failedCalls: failed,
      averageExecutionTimeMs: avgTime,
    };
  }

  updateAgentMetrics(total: number, active: number, avgTime: number): void {
    this.metrics.agent = {
      totalInvocations: total,
      activeAgents: active,
      averageCompletionTimeMs: avgTime,
    };
  }

  updateApprovalMetrics(
    total: number,
    approved: number,
    rejected: number,
    expired: number,
    avgDelay: number,
  ): void {
    this.metrics.approval = {
      totalRequests: total,
      approvedCount: approved,
      rejectedCount: rejected,
      expiredCount: expired,
      averageDelayMs: avgDelay,
    };
  }

  updateHealthMetrics(healthy: boolean, componentCount: number, unhealthy: number): void {
    this.metrics.health = { overallHealthy: healthy, componentCount, unhealthyCount: unhealthy };
  }
}
