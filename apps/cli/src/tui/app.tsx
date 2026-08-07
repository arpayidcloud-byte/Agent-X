/**
 * AgentX CLI TUI — Main Application Shell
 *
 * Tahap 1: Auth + Dashboard (PR #81)
 * Tahap 2: Task Management — list, detail, submit, SSE streaming
 */
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, useApp, useInput, render } from 'ink';
import { AuthScreen } from './auth-screen.js';
import { Dashboard } from './dashboard.js';
import { StatusBar } from './status-bar.js';
import { CommandBar } from './command-bar.js';
import { TaskList } from './task-list.js';
import { TaskDetail } from './task-detail.js';
import { SubmitPanel } from './submit-panel.js';
import { ProviderList } from './provider-list.js';
import { CostView } from './cost-view.js';
import { Banner } from './banner.js';
import { NavBar } from './nav-bar.js';
import { HelpPanel } from './help-panel.js';
import {
  isCloudAuthed,
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

/** Sub-view within the tasks panel. */
type TaskSubView = 'list' | 'detail' | 'submit';

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
  const [email, setEmail] = useState<string | undefined>();
  const [roles, setRoles] = useState<string[] | undefined>();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // ─── Panel state ────
  const [activePanel, setActivePanel] = useState<PanelId>('dashboard');

  // ─── Task sub-view state ────
  const [taskSubView, setTaskSubView] = useState<TaskSubView>('list');
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);
  const [submitResult, setSubmitResult] = useState<{ taskId: string; message?: string } | null>(
    null,
  );

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

  // Initial load + polling (15s)
  useEffect(() => {
    if (authenticated) void refreshData();
  }, [authenticated, refreshData]);

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
      setAuthenticated(true);
      setEmail(user.email);
      setRoles(user.roles);
    } catch (e) {
      const status = (e as Error & { status?: number }).status;
      setAuthError(
        status === 401 || status === 403
          ? 'Invalid email or password'
          : e instanceof Error
            ? e.message
            : String(e),
      );
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

  // ─── Task navigation ────
  const navigateTask = useCallback(
    (direction: 'up' | 'down') => {
      if (tasks.length === 0) return;
      setSelectedTaskIdx((prev) => {
        if (direction === 'up') return Math.max(0, prev - 1);
        return Math.min(tasks.length - 1, prev + 1);
      });
    },
    [tasks.length],
  );

  const openTaskDetail = useCallback(() => {
    if (tasks.length > 0) {
      setTaskSubView('detail');
    }
  }, [tasks.length]);

  const openSubmitPanel = useCallback(() => {
    setTaskSubView('submit');
  }, []);

  const handleTaskSubmit = useCallback(
    (result: { taskId: string; message?: string }) => {
      setSubmitResult(result);
      // After submit, go back to list and refresh
      setTaskSubView('list');
      void refreshData();
    },
    [refreshData],
  );

  // ─── Keyboard ────
  useInput(
    useCallback(
      (_input, key) => {
        if (!authenticated) {
          if (key.escape) exit();
          return;
        }

        // Panel navigation (1-5)
        if (_input === '1') {
          setActivePanel('dashboard');
          setTaskSubView('list');
        }
        if (_input === '2') {
          setActivePanel('tasks');
          setTaskSubView('list');
        }
        if (_input === '3') {
          setActivePanel('providers');
        }
        if (_input === '4') {
          setActivePanel('cost');
        }
        if (_input === '5') {
          setActivePanel('settings');
        }

        // Task-specific keys (only when on tasks panel)
        if (activePanel === 'tasks' && taskSubView === 'list') {
          if (key.upArrow) navigateTask('up');
          if (key.downArrow) navigateTask('down');
          if (key.return) openTaskDetail();
          if (_input === 's' || _input === 'S') openSubmitPanel();
        }

        // Detail view: Esc back
        if (activePanel === 'tasks' && taskSubView === 'detail' && key.escape) {
          setTaskSubView('list');
        }

        // Submit view: handled inside SubmitPanel

        // Global keys
        if (_input === 'r' || _input === 'R') void refreshData();
        if (key.escape && activePanel !== 'tasks') exit();
        if (_input === 'q' || _input === 'Q') exit();
      },
      [
        authenticated,
        exit,
        refreshData,
        activePanel,
        taskSubView,
        navigateTask,
        openTaskDetail,
        openSubmitPanel,
      ],
    ),
  );

  // ─── Command handler ────
  const handleCommand = useCallback(
    (cmd: string) => {
      const lower = cmd.toLowerCase().trim();

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
        setTaskSubView('list');
        return;
      }
      if (lower === 'tasks' || lower === 't') {
        setActivePanel('tasks');
        setTaskSubView('list');
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
      if (lower === 'submit') {
        setActivePanel('tasks');
        setTaskSubView('submit');
        return;
      }
      if (lower === 'help') {
        setActivePanel('help');
        return;
      }
      setLastError(`Unknown command: ${cmd}. Type "help" for commands.`);
    },
    [exit, refreshData],
  );

  // ─── Render ────
  if (!authenticated) {
    return <AuthScreen onLogin={handleLogin} error={authError} loading={authLoading} />;
  }

  return (
    <Box flexDirection="column" padding={1}>
      {/* ASCII Banner */}
      <Banner />

      {/* Navigation Bar */}
      <NavBar activePanel={activePanel} onNavigate={setActivePanel} />

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

      {/* Submit result toast */}
      {submitResult && (
        <Box marginTop={1} marginBottom={1}>
          <Text color="green">✓ Task submitted: {submitResult.taskId}</Text>
          {submitResult.message && <Text dimColor> — {submitResult.message.slice(0, 80)}</Text>}
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

        {activePanel === 'tasks' && taskSubView === 'list' && (
          <TaskList
            tasks={tasks}
            selectedId={tasks[selectedTaskIdx]?.id ?? null}
            loading={loading}
          />
        )}

        {activePanel === 'tasks' && taskSubView === 'detail' && tasks[selectedTaskIdx] != null && (
          <TaskDetail task={tasks[selectedTaskIdx]!} />
        )}

        {activePanel === 'tasks' && taskSubView === 'submit' && (
          <SubmitPanel onSubmit={handleTaskSubmit} onCancel={() => setTaskSubView('list')} />
        )}

        {activePanel === 'providers' && <ProviderList providers={providers} loading={loading} />}

        {activePanel === 'cost' && <CostView cost={cost} loading={loading} />}

        {activePanel === 'help' && <HelpPanel />}

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

      {/* Command Bar (only on non-interactive panels) */}
      {!(activePanel === 'tasks' && (taskSubView === 'detail' || taskSubView === 'submit')) && (
        <Box marginTop={1}>
          <CommandBar onSubmit={handleCommand} />
        </Box>
      )}
    </Box>
  );
}

// ─── Entry point ────
export function launchTUI(): void {
  render(<AgentXTUI />);
}
