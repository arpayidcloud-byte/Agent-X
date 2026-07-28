/**
 * @module workflow-engine/timeline
 * @description Execution timeline generation for deterministic tracking.
 */

import type { ExecutionTimelineEntry } from './interfaces-v2.js';
import type { WorkflowNode } from './interfaces.js';

export class ExecutionTimeline {
  private entries: ExecutionTimelineEntry[] = [];

  public startNode(node: WorkflowNode): void {
    this.entries.push({
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.config.type,
      startedAt: new Date(),
      finishedAt: null,
      durationMs: 0,
      retries: 0,
      status: 'RUNNING',
    });
  }

  public finishNode(
    nodeId: string,
    status: 'COMPLETED' | 'FAILED' | 'SKIPPED',
    retries: number = 0,
  ): void {
    const entry = this.entries.find((e) => e.nodeId === nodeId && !e.finishedAt);
    if (entry) {
      entry.finishedAt = new Date();
      entry.durationMs = entry.finishedAt.getTime() - entry.startedAt.getTime();
      entry.status = status;
      entry.retries = retries;
    }
  }

  public getTimeline(): ExecutionTimelineEntry[] {
    return [...this.entries].sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
  }

  public getDuration(): number {
    if (this.entries.length === 0) return 0;
    const sorted = this.getTimeline();
    if (sorted.length === 0) return 0;
    const lastFinished = sorted.find((e) => e.finishedAt);
    return lastFinished?.finishedAt?.getTime() ?? 0;
  }

  public clear(): void {
    this.entries = [];
  }
}
