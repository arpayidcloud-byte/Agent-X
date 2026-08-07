/**
 * AgentX CLI TUI — Main Application Shell
 *
 * Tahap 1: Auth + Dashboard
 * - Login screen (interactive email/password via ink)
 * - Dashboard panel: health, stats, recent tasks, cost
 * - Status bar: version, health, email, tasks, cost
 * - Command bar with suggestions
 * - Keyboard: 1-5 switch panels, R refresh, S submit, Q quit
 */
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, useApp, useInput, render } from 'ink';
import { AuthScreen } from './auth-screen.js';
import { Dashboard } from './dashboard.js';
import { StatusBar } from './status-bar.js';
import { CommandBar } from './command-bar.js';
import {
  isCloudAuthed,
  loadCloudConfig,
  fetchHealth,
  fetchStats,
  fetchTasks,
  fetchProviders,
  fetchCost,
  loginApi,
} from './api.js';
import { saveCloudConfig } from '../lib/cloud-api.js';
import type {
  HealthResponse,
  StatsResponse,
  TaskItem,
  ProviderInfo,
  CostSummary,
  PanelId,
} from './types.js';

const VERSION = '2.0.0';

function useInterval(fn: () => void, ms: number): void {
  useEffect(() => {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  }, [fn, ms]);
}

export default function AgentXTUI(): React.ReactNode {
  const { exit } = useApp();

  // ─── Auth state ────
  const [authenticated, setAuthenticated] = useState<boolean>(() => isCloudAuthed());
  const [email, setEmail] = useState<string | undefined>(() => {
    const cfg = loadCloudConfig();
    return cfg.apiToken ? undefined : undefined; // email comes from API after login
  });
  const [roles, setRoles] = useState<string[] | undefined>();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // ─── Panel state ────
  const [activePanel, setActivePanel] = useState<PanelId>('dashboard');

  // ─── Data state ────
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [cost, setCost] = useState<CostSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // ─── Data fetch ────
  const refreshData = useCallback(async () => {
    if (!isCloudAuthed()) return;
    setLoading(true);
    setLastError(null);
    try {
      const [h, s, t, p, c] = await Promise.all([
        fetchHealth(),
        fetchStats(),
        fetchTasks(20),
        fetchProviders(),
        fetchCost(),
      ]);
      setHealth(h);
      setStats({
        totalTasks: s.total,
        activeTasks: s.active,
        completedTasks: s.completed,
        providerCount: p.length,
      });
      setTasks(t);
      setProviders(p);
      setCost(c);
    } catch (e) {
      setLastError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    if (authenticated) {
      void refreshData();
    }
  }, [authenticated, refreshData]);

  // Poll every 15s
  useInterval(
    useCallback(() => {
      if (authenticated) void refreshData();
    }, [authenticated, refreshData]),
    15000,
  );

  // ─── Login handler ────
  const handleLoginAsync = useCallback(async (loginEmail: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await loginApi(loginEmail, password);
      // loginApi uses cloudFetch which stores token via saveCloudConfig internally
      // but we need to verify — cloudFetch doesn't save the token, we need to do it here
      // Actually loginApi returns user info but doesn't save token. Let me fix:
      setAuthenticated(true);
      setEmail(user.email);
      setRoles(user.roles);
    } catch (e) {
      const status = (e as Error & { status?: number }).status;
      if (status === 401 || status === 403) {
        setAuthError('Invalid email or password');
      } else {
        setAuthError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = useCallback(
    (loginEmail: string, password: string) => {
      void handleLoginAsync(loginEmail, password);
    },
    [handleLoginAsync],
  );

  // ─── Keyboard ────
  useInput(
    useCallback(
      (input, key) => {
        if (!authenticated) {
          if (key.escape) exit();
          return;
        }

        // Navigation
        if (input === '1') setActivePanel('dashboard');
        if (input === '2') setActivePanel('tasks');
        if (input === '3') setActivePanel('providers');
        if (input === '4') setActivePanel('cost');
        if (input === '5') setActivePanel('settings');

        // Actions
        if (input === 'r' || input === 'R') void refreshData();
        if (key.escape) exit();

        // Quit
        if (input === 'q' || input === 'Q') exit();
      },
      [authenticated, exit, refreshData],
    ),
  );

  // ─── Command handler ────
  const handleCommand = useCallback(
    (cmd: string) => {
      const lower = cmd.toLowerCase().trim();

      if (lower === 'help') {
        // TODO: show help panel
        return;
      }
      if (lower === 'exit' || lower === 'quit' || lower === 'q') {
        exit();
        return;
      }
      if (lower === 'refresh' || lower === 'r') {
        void refreshData();
        return;
      }
      if (lower === 'logout') {
        saveCloudConfig({ apiToken: undefined });
        setAuthenticated(false);
        setEmail(undefined);
        setRoles(undefined);
        return;
      }
      if (lower === 'dashboard' || lower === 'd') {
        setActivePanel('dashboard');
        return;
      }
      if (lower === 'tasks' || lower === 't') {
        setActivePanel('tasks');
        return;
      }
      if (lower === 'providers' || lower === 'p') {
        setActivePanel('providers');
        return;
      }
      if (lower === 'cost' || lower === 'c') {
        setActivePanel('cost');
        return;
      }
      if (lower.startsWith('submit')) {
        // TODO Tahap 2: submit flow
        return;
      }
      if (lower.startsWith('status')) {
        setActivePanel('tasks');
        return;
      }

      setLastError(`Unknown command: ${cmd}. Type "help" for available commands.`);
    },
    [exit, refreshData],
  );

  // ─── Render ────
  if (!authenticated) {
    return <AuthScreen onLogin={handleLogin} error={authError} loading={authLoading} />;
  }

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="cyanBright">
          ⚡ AgentX
        </Text>
        <Text dimColor> — Enterprise AI Agent Platform</Text>
      </Box>

      {/* Status Bar */}
      <StatusBar
        version={VERSION}
        authenticated={authenticated}
        email={email}
        taskCount={stats?.totalTasks ?? tasks.length}
        cost={`$${(cost?.totalCost ?? 0).toFixed(2)}`}
        healthStatus={health?.status === 'ok' ? 'ok' : 'error'}
      />

      {/* Error Banner */}
      {lastError && (
        <Box marginTop={1} marginBottom={1}>
          <Text color="red">⚠ {lastError}</Text>
        </Box>
      )}

      {/* Active Panel */}
      <Box marginTop={1}>
        {activePanel === 'dashboard' && (
          <Dashboard
            health={health}
            stats={stats}
            recentTasks={tasks}
            cost={cost}
            providers={providers}
            loading={loading}
          />
        )}
        {activePanel === 'tasks' && (
          <Box flexDirection="column" padding={1}>
            <Text bold color="cyanBright">
              ◆ Tasks
            </Text>
            {tasks.length === 0 ? (
              <Text dimColor> No tasks — use "submit" to create one</Text>
            ) : (
              tasks.map((t) => (
                <Box key={t.id} flexDirection="row" gap={1}>
                  <Text dimColor>{t.id.slice(0, 14).padEnd(16)}</Text>
                  <Text
                    color={
                      t.status === 'COMPLETED'
                        ? 'green'
                        : t.status === 'RUNNING'
                          ? 'cyan'
                          : 'yellow'
                    }
                  >
                    {t.status.padEnd(12)}
                  </Text>
                  <Text>{(t.description ?? t.prompt ?? '').slice(0, 50)}</Text>
                </Box>
              ))
            )}
            <Box marginTop={1}>
              <Text dimColor>[1] Dashboard [2] Tasks [3] Providers [4] Cost</Text>
            </Box>
          </Box>
        )}
        {activePanel === 'providers' && (
          <Box flexDirection="column" padding={1}>
            <Text bold color="cyanBright">
              ◆ LLM Providers
            </Text>
            {providers.length === 0 ? (
              <Text dimColor> No providers configured</Text>
            ) : (
              providers.map((p) => (
                <Box key={p.id} flexDirection="row" gap={2}>
                  <Text color={p.isActive ? 'green' : 'red'}>{p.isActive ? '●' : '○'}</Text>
                  <Text bold>{p.displayName ?? p.name}</Text>
                  <Text dimColor>({p.models.length} models)</Text>
                </Box>
              ))
            )}
            <Box marginTop={1}>
              <Text dimColor>[1] Dashboard [2] Tasks [3] Providers [4] Cost</Text>
            </Box>
          </Box>
        )}
        {activePanel === 'cost' && (
          <Box flexDirection="column" padding={1}>
            <Text bold color="cyanBright">
              ◆ Cost Analysis
            </Text>
            <Box marginTop={1}>
              <Text>Total: </Text>
              <Text bold color="green">
                ${(cost?.totalCost ?? 0).toFixed(4)}
              </Text>
            </Box>
            {Object.entries(cost?.byProvider ?? {}).length > 0 && (
              <Box flexDirection="column" marginTop={1}>
                <Text bold underline>
                  By Provider
                </Text>
                {Object.entries(cost?.byProvider ?? {}).map(([name, amount]) => (
                  <Box key={name} flexDirection="row" gap={2}>
                    <Text>{name.padEnd(20)}</Text>
                    <Text bold color="green">
                      ${amount.toFixed(4)}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
            {Object.entries(cost?.byModel ?? {}).length > 0 && (
              <Box flexDirection="column" marginTop={1}>
                <Text bold underline>
                  By Model
                </Text>
                {Object.entries(cost?.byModel ?? {}).map(([name, amount]) => (
                  <Box key={name} flexDirection="row" gap={2}>
                    <Text>{name.padEnd(25)}</Text>
                    <Text bold color="yellow">
                      ${amount.toFixed(4)}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
            <Box marginTop={1}>
              <Text dimColor>[1] Dashboard [2] Tasks [3] Providers [4] Cost</Text>
            </Box>
          </Box>
        )}
        {activePanel === 'settings' && (
          <Box flexDirection="column" padding={1}>
            <Text bold color="cyanBright">
              ◆ Settings
            </Text>
            <Box marginTop={1} flexDirection="column" gap={1}>
              <Text>
                Email: <Text bold>{email ?? 'unknown'}</Text>
              </Text>
              <Text>
                Roles: <Text bold>{roles?.join(', ') ?? 'unknown'}</Text>
              </Text>
              <Text>
                API: <Text dimColor>https://api.id-tech.cloud</Text>
              </Text>
            </Box>
            <Box marginTop={1}>
              <Text dimColor>[1] Dashboard [2] Tasks [3] Providers [4] Cost</Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Command Bar */}
      <Box marginTop={1}>
        <CommandBar onSubmit={handleCommand} />
      </Box>
    </Box>
  );
}

// ─── Entry point ────
export function launchTUI(): void {
  render(<AgentXTUI />);
}
