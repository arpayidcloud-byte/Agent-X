/**
 * @module multi-agent-collaboration/collaboration-metrics
 * @description Collaboration metrics collector.
 */

import type { CollaborationMetrics as ICollaborationMetrics } from './interfaces.js';

export class CollaborationMetricsCollector implements ICollaborationMetrics {
  agentsRegistered = 0;
  tasksDelegated = 0;
  tasksCompleted = 0;
  tasksFailed = 0;
  messagesRouted = 0;
  consensusCount = 0;
  conflictsResolved = 0;
  recoveryCount = 0;
  replayCount = 0;
  averageDelegationTime = 0;
  averageConsensusTime = 0;

  recordAgentRegistration(): void {
    this.agentsRegistered++;
  }
  recordDelegation(durationMs: number): void {
    this.tasksDelegated++;
    this.averageDelegationTime =
      (this.averageDelegationTime * (this.tasksDelegated - 1) + durationMs) / this.tasksDelegated;
  }
  recordCompletion(): void {
    this.tasksCompleted++;
  }
  recordFailure(): void {
    this.tasksFailed++;
  }
  recordMessage(): void {
    this.messagesRouted++;
  }
  recordConsensus(durationMs: number): void {
    this.consensusCount++;
    this.averageConsensusTime =
      (this.averageConsensusTime * (this.consensusCount - 1) + durationMs) / this.consensusCount;
  }
  recordConflictResolution(): void {
    this.conflictsResolved++;
  }
  recordRecovery(): void {
    this.recoveryCount++;
  }
  recordReplay(): void {
    this.replayCount++;
  }
}
