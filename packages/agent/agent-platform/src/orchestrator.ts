// packages/agent/agent-platform/src/orchestrator.ts
import type { TaskModel, TaskContext } from '@agentx-fast/core-runtime';
import { CodingAgent, ReviewAgent, TestAgent, SecurityAgent } from './agent.js';
import type { AgentResult } from './agent.js';

export interface OrchestrationResult {
  success: boolean;
  results: {
    code?: AgentResult;
    review?: AgentResult;
    test?: AgentResult;
    security?: AgentResult;
  };
}

export class AgentOrchestrator {
  private codingAgent = new CodingAgent();
  private reviewAgent = new ReviewAgent();
  private testAgent = new TestAgent();
  private securityAgent = new SecurityAgent();

  async executeFlow(
    task: TaskModel,
    context: TaskContext,
  ): Promise<OrchestrationResult> {
    const results: OrchestrationResult['results'] = {};

    try {
      // 1. Code first
      results.code = await this.codingAgent.run(task, context);
      if (!results.code.success) {
        return { success: false, results };
      }

      // 2. Update context with code output
      const reviewContext = {
        ...context,
        variables: {
          ...context.variables,
          codeOutput: results.code.output,
        },
      };

      // 3. Review
      const reviewTask = { ...task, goal: results.code.output };
      results.review = await this.reviewAgent.run(reviewTask, reviewContext);

      // 4. Test
      const testTask = { ...task, goal: results.code.output };
      results.test = await this.testAgent.run(testTask, reviewContext);

      // 5. Security
      const securityTask = { ...task, goal: results.code.output };
      results.security = await this.securityAgent.run(securityTask, reviewContext);

      return {
        success: true,
        results,
      };
    } catch (error) {
      return {
        success: false,
        results,
      };
    }
  }
}
