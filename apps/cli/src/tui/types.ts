/** Shared types for TUI panels. */

export interface HealthResponse {
  status: string;
  version?: string;
  uptime?: number;
}

export interface StatsResponse {
  totalTasks?: number;
  activeTasks?: number;
  completedTasks?: number;
  totalCost?: number;
  providerCount?: number;
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

export type PanelId = 'dashboard' | 'tasks' | 'providers' | 'cost' | 'settings';

export interface AppState {
  authenticated: boolean;
  email?: string;
  roles?: string[];
  activePanel: PanelId;
  health: HealthResponse | null;
  stats: StatsResponse | null;
  tasks: TaskItem[];
  providers: ProviderInfo[];
  cost: CostSummary | null;
  loading: boolean;
  error: string | null;
  commandHistory: string[];
}
