/**
 * @module multi-agent-collaboration/specialist-agents
 * @description Built-in specialist agent roles: Architect, Coder, Reviewer, Tester.
 *
 * The collaboration infrastructure (registry, directory, delegation, consensus,
 * shared context) was already in place; this module defines the actual
 * specialist team from the roadmap (Week 9-10: Agent Specialization) and wires
 * them into the engine's directory so the selection/delegation machinery can
 * route phase work to the right specialist.
 */

import { createHash } from 'crypto';
import type { AgentMetadata } from './interfaces.js';
import type { AgentRegistry } from './agent-registry.js';
import type { AgentDirectory } from './agent-directory.js';

export type SpecialistRole = 'architect' | 'coder' | 'reviewer' | 'tester';

export interface SpecialistAgentDefinition {
  role: SpecialistRole;
  id: string;
  name: string;
  capabilities: string[];
  description: string;
}

export const SPECIALIST_AGENTS: SpecialistAgentDefinition[] = [
  {
    role: 'architect',
    id: 'agent-architect',
    name: 'Architect Agent',
    capabilities: ['architecture', 'design', 'planning'],
    description:
      'Designs system architecture, breaks goals into an implementation plan, and defines interfaces.',
  },
  {
    role: 'coder',
    id: 'agent-coder',
    name: 'Coder Agent',
    capabilities: ['implementation', 'coding'],
    description:
      'Implements features and fixes based on the architecture plan, producing concrete code.',
  },
  {
    role: 'reviewer',
    id: 'agent-reviewer',
    name: 'Reviewer Agent',
    capabilities: ['code-review', 'quality'],
    description:
      'Reviews implementations for correctness, quality, and adherence to the plan; may request changes.',
  },
  {
    role: 'tester',
    id: 'agent-tester',
    name: 'Tester Agent',
    capabilities: ['testing', 'qa', 'validation'],
    description: 'Validates the implementation with tests and quality gates before it is accepted.',
  },
];

export function createSpecialistMetadata(def: SpecialistAgentDefinition): AgentMetadata {
  return {
    id: def.id,
    name: def.name,
    version: '1.0.0',
    type: 'specialist',
    capabilities: def.capabilities,
    checksum: createHash('sha256').update(JSON.stringify(def)).digest('hex'),
  };
}

/**
 * Registers all four specialist agents into the registry + directory and
 * returns their metadata. Each specialist gets `slots` concurrent work slots.
 */
export function registerSpecialistAgents(
  registry: AgentRegistry,
  directory: AgentDirectory,
  slots = 4,
): AgentMetadata[] {
  return SPECIALIST_AGENTS.map((def) => {
    const metadata = createSpecialistMetadata(def);
    registry.register(metadata);
    directory.register(def.id, def.capabilities, 10, slots);
    return metadata;
  });
}

export function specialistByRole(role: SpecialistRole): SpecialistAgentDefinition {
  const def = SPECIALIST_AGENTS.find((a) => a.role === role);
  if (!def) throw new Error(`Specialist role not defined: ${role}`);
  return def;
}
