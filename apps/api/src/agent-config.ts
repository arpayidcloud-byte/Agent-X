// Web Pro: agent configuration store (in-memory, demo-grade).
//
// Seeded from the specialist team (architect/coder/reviewer/tester). Unlike
// the multi-agent-collaboration package (which registers agents in its own
// registry), this store is the user-facing configuration surface: which
// specialists are enabled and which model/complexity they prefer. In-memory
// like taskStore — documented, resets on restart.

export type AgentRole = 'architect' | 'coder' | 'reviewer' | 'tester';

export interface AgentConfig {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  capabilities: string[];
  enabled: boolean;
  model: string;
  complexity: 'simple' | 'medium' | 'complex';
}

export const AGENT_MODEL_OPTIONS = [
  'deepseek:deepseek-v3',
  'openai:gpt-4o',
  'openai:gpt-4o-mini',
  'anthropic:claude-3-5-sonnet-20241022',
  'anthropic:claude-3-7-sonnet-20250219',
  'anthropic:claude-3-haiku-20240307',
] as const;

const SEED: AgentConfig[] = [
  {
    id: 'agent-architect',
    role: 'architect',
    name: 'Architect Agent',
    description:
      'Designs system architecture, breaks goals into an implementation plan, and defines interfaces.',
    capabilities: ['architecture', 'design', 'planning'],
    enabled: true,
    model: 'anthropic:claude-3-7-sonnet-20250219',
    complexity: 'complex',
  },
  {
    id: 'agent-coder',
    role: 'coder',
    name: 'Coder Agent',
    description:
      'Implements features and fixes based on the architecture plan, producing concrete code.',
    capabilities: ['implementation', 'coding'],
    enabled: true,
    model: 'anthropic:claude-3-5-sonnet-20241022',
    complexity: 'complex',
  },
  {
    id: 'agent-reviewer',
    role: 'reviewer',
    name: 'Reviewer Agent',
    description:
      'Reviews implementations for correctness, quality, and adherence to the plan; may request changes.',
    capabilities: ['code-review', 'quality'],
    enabled: true,
    model: 'openai:gpt-4o',
    complexity: 'medium',
  },
  {
    id: 'agent-tester',
    role: 'tester',
    name: 'Tester Agent',
    description: 'Validates the implementation with tests and quality gates before it is accepted.',
    capabilities: ['testing', 'qa', 'validation'],
    enabled: true,
    model: 'deepseek:deepseek-v3',
    complexity: 'medium',
  },
];

export class AgentConfigStore {
  private agents: Map<string, AgentConfig>;

  constructor(seed: AgentConfig[] = SEED) {
    this.agents = new Map(seed.map((a) => [a.id, { ...a }]));
  }

  list(): AgentConfig[] {
    return [...this.agents.values()].sort((a, b) => a.role.localeCompare(b.role));
  }

  get(id: string): AgentConfig | undefined {
    return this.agents.get(id);
  }

  /**
   * Apply a partial patch. Returns the updated agent, or null when the id is
   * unknown. Throws on invalid values (enabled must be boolean, model must be
   * in AGENT_MODEL_OPTIONS, complexity must be one of simple/medium/complex).
   */
  update(
    id: string,
    patch: { enabled?: unknown; model?: unknown; complexity?: unknown },
  ): AgentConfig | null {
    const agent = this.agents.get(id);
    if (!agent) return null;

    if (patch.enabled !== undefined) {
      if (typeof patch.enabled !== 'boolean') {
        throw new Error('Invalid field: enabled (boolean)');
      }
      agent.enabled = patch.enabled;
    }
    if (patch.model !== undefined) {
      if (typeof patch.model !== 'string' || !AGENT_MODEL_OPTIONS.includes(patch.model as never)) {
        throw new Error(`Invalid field: model. Must be one of: ${AGENT_MODEL_OPTIONS.join(', ')}`);
      }
      agent.model = patch.model;
    }
    if (patch.complexity !== undefined) {
      if (!['simple', 'medium', 'complex'].includes(patch.complexity as string)) {
        throw new Error('Invalid field: complexity. Must be simple|medium|complex');
      }
      agent.complexity = patch.complexity as AgentConfig['complexity'];
    }
    return agent;
  }
}

// Singleton for the API server.
export const agentConfigStore = new AgentConfigStore();
