/**
 * @module workflow-orchestration/workflow-dependency
 * @description DAG dependency management.
 */

import type { WorkflowEdge } from './interfaces.js';

export class WorkflowDependencyManager {
  private edges: WorkflowEdge[] = [];

  addEdge(source: string, target: string, weight: number = 1): void {
    this.edges.push({ source, target, weight });
  }

  getEdges(): WorkflowEdge[] {
    return [...this.edges];
  }

  hasDependency(taskId: string): boolean {
    return this.edges.some((e) => e.target === taskId);
  }
}
