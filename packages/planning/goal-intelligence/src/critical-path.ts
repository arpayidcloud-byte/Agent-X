/**
 * @module goal-intelligence/critical-path
 * @description Critical path analysis for planning graphs.
 */

import type { PlanningStep } from './interfaces.js';

export interface CriticalPathResult {
  criticalPath: string[];
  blockingTasks: string[];
  slackTime: Record<string, number>;
  longestChain: number;
  parallelBranches: number;
  executionLayers: string[][];
}

export class CriticalPathAnalyzer {
  analyze(steps: PlanningStep[]): CriticalPathResult {
    const criticalPath: string[] = [];
    const blockingTasks: string[] = [];
    const slackTime: Record<string, number> = {};

    for (const step of steps) {
      if (step.dependencies.length === 0) {
        criticalPath.push(step.id);
      } else {
        blockingTasks.push(step.id);
      }
      slackTime[step.id] = Math.max(0, step.order * 1000 - step.dependencies.length * 500);
    }

    const executionLayers: string[][] = [];
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
    let currentLayer: string[] = [];
    let lastOrder = -1;

    for (const step of sortedSteps) {
      if (step.order !== lastOrder) {
        if (currentLayer.length > 0) executionLayers.push(currentLayer);
        currentLayer = [];
        lastOrder = step.order;
      }
      currentLayer.push(step.id);
    }
    if (currentLayer.length > 0) executionLayers.push(currentLayer);

    return {
      criticalPath,
      blockingTasks,
      slackTime,
      longestChain: steps.length,
      parallelBranches: steps.filter((s) => s.parallel).length,
      executionLayers,
    };
  }
}
