/**
 * @module multi-agent-reasoning/domain/collaboration/interfaces
 * @description Collaboration domain interfaces.
 */

export interface AgentMetadata {
  id: string;
  name: string;
  version: string;
  capabilities: string[];
  priority: number;
}

export interface AgentRegistration {
  agentId: string;
  metadata: AgentMetadata;
  registeredAt: Date;
  lastHeartbeat: Date;
  status: 'ACTIVE' | 'IDLE' | 'BUSY' | 'OFFLINE';
}

export interface AgentDirectoryEntry {
  agentId: string;
  capabilities: string[];
  priority: number;
  availableSlots: number;
  currentLoad: number;
}

export interface CollaborationSession {
  id: string;
  traceId: string;
  goalId: string;
  participants: string[];
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  startedAt: Date;
  checksum: string;
}

export interface CollaborationPlan {
  id: string;
  goalId: string;
  agentIds: string[];
  phases: string[];
  estimatedDuration: number;
  checksum: string;
  timestamp: Date;
}

export interface TaskDelegation {
  taskId: string;
  agentId: string;
  goalId: string;
  priority: number;
  timeout: number;
  status: 'PENDING' | 'ASSIGNED' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  metadata: Record<string, unknown>;
}

export interface CollaborationCheckpoint {
  id: string;
  sessionId: string;
  agentStates: Record<string, string>;
  sharedState: Record<string, unknown>;
  timestamp: Date;
  checksum: string;
}

export interface CollaborationMetrics {
  agentsRegistered: number;
  tasksDelegated: number;
  tasksCompleted: number;
  tasksFailed: number;
  messagesRouted: number;
  consensusCount: number;
  conflictsResolved: number;
  recoveryCount: number;
  replayCount: number;
  averageDelegationTime: number;
  averageConsensusTime: number;
}

export interface CapabilityMatch {
  requiredCapabilities: string[];
  availableCapabilities: string[];
  matchScore: number;
  matchedAgents: string[];
}

export interface CollaborationHook {
  beforeCollaboration?: (sessionId: string) => Promise<void>;
  afterCollaboration?: (sessionId: string, result: unknown) => Promise<void>;
  beforeDelegation?: (taskId: string) => Promise<void>;
  afterDelegation?: (taskId: string, result: unknown) => Promise<void>;
  beforeConsensus?: (proposalId: string) => Promise<void>;
  afterConsensus?: (proposalId: string, approved: boolean) => Promise<void>;
  beforeRecovery?: (sessionId: string) => Promise<void>;
  afterRecovery?: (sessionId: string) => Promise<void>;
}
