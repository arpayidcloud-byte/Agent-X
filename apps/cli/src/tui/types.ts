/** Shared types for the chat-first TUI. */

export interface HealthResponse {
  status: string;
  version?: string;
  uptime?: number;
}

export interface TaskItem {
  id: string;
  prompt?: string;
  description?: string;
  status: string;
  provider?: string;
  model?: string;
  response?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ProviderInfo {
  id: string;
  name: string;
  displayName?: string;
  isActive: boolean;
  models: string[];
}

export interface CostSummary {
  totalCost: number;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
  period?: string;
}

/** Chat-first design: the chat view is the main surface; everything else is an overlay. */
export type OverlayId =
  | 'none'
  | 'tasks'
  | 'providers'
  | 'cost'
  | 'settings'
  | 'help'
  | 'router'
  | 'health'
  | 'deck'
  | 'obsidian';

export interface Toast {
  id: number;
  text: string;
  kind: 'ok' | 'error' | 'info';
}

// ─── Command Deck (GET /v1/agentx/deck) ────
export interface DeckAgent {
  id: string;
  name: string;
  role: string;
  status: 'run' | 'idle' | 'wait';
  model?: string;
  startedAt?: string;
}

export interface DeckLogEntry {
  at: string;
  level: 'info' | 'warn' | 'error';
  agent: string;
  type: string;
  message: string;
}

export interface DeckTask {
  id: string;
  description: string;
  status: string;
  progress: number;
  elapsedMs: number;
  tokensIn: number;
  tokensOut: number;
  files: { modified: number; created: number };
  provider?: string;
  model?: string;
}

export interface DeckData {
  generatedAt: string;
  system: { cpu: number; memUsedGb: number; memTotalGb: number; memPct: number };
  agents: DeckAgent[];
  task: DeckTask | null;
  logs: DeckLogEntry[];
  stats: { totalTasks: number; totalCostUsd: number; totalTokens: number };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMeta {
  provider?: string;
  model?: string;
  cost?: number;
  latencyMs?: number;
}

export interface AppState {
  authenticated: boolean;
  email?: string;
  roles?: string[];
  overlay: OverlayId;
  health: HealthResponse | null;
  tasks: TaskItem[];
  providers: ProviderInfo[];
  cost: CostSummary | null;
  loading: boolean;
  error: string | null;
}
