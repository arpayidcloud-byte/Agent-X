// packages/agent/agent-platform/src/delegation.ts
import type { TaskModel, TaskContext } from '@agentx-fast/core-runtime';
import type { AgentRole, AgentResult } from './agent.js';
import { CodingAgent, ReviewAgent, TestAgent, SecurityAgent } from './agent.js';

export interface DelegationRequest {
  fromRole: AgentRole;
  toRole: AgentRole;
  task: TaskModel;
  context: TaskContext;
  reason: string;
}

export class AgentDelegationProtocol {
  private agents = {
    coding: new CodingAgent(),
    review: new ReviewAgent(),
    test: new TestAgent(),
    security: new SecurityAgent(),
  };

  async delegate(request: DelegationRequest): Promise<AgentResult> {
    const targetAgent = this.agents[request.toRole];
    if (!targetAgent) {
      throw new Error(`Unknown agent role: ${request.toRole}`);
    }

    // Add delegation metadata to context
    const delegationContext = {
      ...request.context,
      variables: {
        ...request.context.variables,
        delegation: {
          from: request.fromRole,
          reason: request.reason,
          timestamp: new Date().toISOString(),
        },
      },
    };

    return await targetAgent.run(request.task, delegationContext);
  }

  async chain(
    task: TaskModel,
    context: TaskContext,
    roles: AgentRole[],
  ): Promise<AgentResult[]> {
    const results: AgentResult[] = [];
    let currentContext = context;
    let currentGoal = task.goal;

    for (const role of roles) {
      const agent = this.agents[role];
      const currentTask = { ...task, goal: currentGoal };
      
      const result = await agent.run(currentTask, currentContext);
      results.push(result);

      if (!result.success) {
        break;
      }

      // Pass output to next agent
      currentGoal = result.output;
      currentContext = {
        ...currentContext,
        variables: {
          ...currentContext.variables,
          previousOutput: result.output,
          previousRole: role,
        },
      };
    }

    return results;
  }
}
