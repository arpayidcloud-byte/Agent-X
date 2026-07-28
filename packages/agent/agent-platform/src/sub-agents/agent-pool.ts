import type { AgentPoolConfig, AgentRole, SubAgent } from './interfaces.js';
import type { SubAgentFactory } from './sub-agent-factory.js';

export class AgentPool {
  private config: AgentPoolConfig;
  private factory: SubAgentFactory;

  private idleAgents = new Map<AgentRole, SubAgent[]>();
  private busyAgents = new Map<string, SubAgent>();

  constructor(config: AgentPoolConfig, factory: SubAgentFactory) {
    this.config = config;
    this.factory = factory;
  }

  public acquire(role: AgentRole): SubAgent {
    let agent: SubAgent | undefined;

    if (this.config.reuseIdleAgents) {
      const idleList = this.idleAgents.get(role);
      if (idleList && idleList.length > 0) {
        agent = idleList.pop();
      }
    }

    if (!agent) {
      const totalAgents = this.getTotalAgentsCount();
      if (totalAgents >= this.config.maxAgents) {
        throw new Error(`Max agents limit reached (${this.config.maxAgents})`);
      }
      agent = this.factory.createAgent(role);
    }

    this.busyAgents.set(agent.id, agent);
    return agent;
  }

  public release(agentId: string): void {
    const agent = this.busyAgents.get(agentId);
    if (!agent) return;

    this.busyAgents.delete(agentId);

    if (this.config.reuseIdleAgents) {
      if (!this.idleAgents.has(agent.role)) {
        this.idleAgents.set(agent.role, []);
      }
      this.idleAgents.get(agent.role)!.push(agent);
    }
  }

  public prewarm(role: AgentRole, count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.getTotalAgentsCount() >= this.config.maxAgents) break;
      const agent = this.factory.createAgent(role);
      if (!this.idleAgents.has(role)) this.idleAgents.set(role, []);
      this.idleAgents.get(role)!.push(agent);
    }
  }

  public getTotalAgentsCount(): number {
    let idleCount = 0;
    for (const list of this.idleAgents.values() as Iterable<SubAgent[]>) {
      idleCount += list.length;
    }
    return this.busyAgents.size + idleCount;
  }
}
