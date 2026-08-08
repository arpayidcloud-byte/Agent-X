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
  'none' | 'tasks' | 'providers' | 'cost' | 'settings' | 'help' | 'router' | 'health';

export interface Toast {
  id: number;
  text: string;
  kind: 'ok' | 'error' | 'info';
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
