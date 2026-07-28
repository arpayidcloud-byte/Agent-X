/**
 * @module workflow-orchestration/workflow-engine
 * @description Core workflow execution engine.
 */

import type { WorkflowGraph, WorkflowTask } from './interfaces.js';
import { WorkflowScheduler } from './workflow-scheduler.js';
import { WorkflowDispatcher } from './workflow-dispatcher.js';
import { WorkflowExecutor } from './workflow-executor.js';

export class WorkflowEngine {
  public scheduler = new WorkflowScheduler();
  public dispatcher = new WorkflowDispatcher();
  public executor = new WorkflowExecutor();

  async executeGraph(
    graph: WorkflowGraph,
    taskGenerator: (nodeId: string) => WorkflowTask,
  ): Promise<unknown[]> {
    const results: unknown[] = [];
    for (const node of graph.nodes) {
      const task = taskGenerator(node.id);
      this.scheduler.schedule(task);
      const queued = this.scheduler.dequeue();
      if (queued) {
        await this.dispatcher.dispatch(queued);
        const result = await this.executor.execute(queued);
        results.push(result);
      }
    }
    return results;
  }
}
