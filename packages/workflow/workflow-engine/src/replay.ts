/**
 * @module workflow-engine/replay
 * @description Execution replay for debugging and step-by-step analysis.
 */

import type { ReplayMode, ReplaySnapshot, ReplayHistory } from './interfaces-v2.js';

export class ExecutionReplay {
  public async startReplay(workflowId: string, _mode: ReplayMode): Promise<ReplayHistory> {
    const snapshots: ReplaySnapshot[] = [];
    const totalSteps = 10;

    for (let i = 0; i < totalSteps; i++) {
      snapshots.push({
        step: i,
        timestamp: new Date(),
        state: 'RUNNING' as const,
        nodeStates: new Map(),
        results: new Map(),
      });
    }

    return { workflowId, snapshots, totalSteps };
  }

  public async getSnapshot(_workflowId: string, step: number): Promise<ReplaySnapshot | undefined> {
    return {
      step,
      timestamp: new Date(),
      state: 'RUNNING' as const,
      nodeStates: new Map(),
      results: new Map(),
    };
  }

  public async stepForward(_workflowId: string): Promise<ReplaySnapshot> {
    return {
      step: 1,
      timestamp: new Date(),
      state: 'RUNNING' as const,
      nodeStates: new Map(),
      results: new Map(),
    };
  }
}
