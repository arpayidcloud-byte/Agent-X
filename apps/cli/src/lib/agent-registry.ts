import type { TaskModel, TaskContext } from '@agentx-fast/core-runtime';

export interface Agent {
  readonly id: string;
  readonly role: string;
  execute(task: TaskModel, context: unknown): Promise<unknown>;
}

export class AgentRegistry {
  private agents = new Map<string, Agent>();

  constructor() {}

  register(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  unregister(agentId: string): void {
    this.agents.delete(agentId);
  }

  get(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getByRole(role: string): Agent | undefined {
    for (const agent of this.agents.values()) {
      if (agent.role === role) {
        return agent;
      }
    }
    return undefined;
  }

  list(): Agent[] {
    return Array.from(this.agents.values());
  }

  async execute(agentId: string, task: TaskModel, context: TaskContext): Promise<unknown> {
    const agent = this.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    return agent.execute(task, context);
  }

  async executeByRole(role: string, task: TaskModel, context: TaskContext): Promise<unknown> {
    const agent = this.getByRole(role);
    if (!agent) {
      throw new Error(`Agent not found for role: ${role}`);
    }
    return agent.execute(task, context);
  }
}