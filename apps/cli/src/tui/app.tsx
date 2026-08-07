/**
 * AgentX CLI TUI — Chat-first main shell.
 *
 * Redesign (2026-08-07): chat is THE main surface (like Devin/OpenCode/Hermes).
 * Panels (tasks/providers/cost/help/settings) are overlays toggled by slash
 * commands or hotkeys — not tab views. Chrome is minimal: 1-line header +
 * 1-line status bar; the rest belongs to the conversation.
 */
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, useApp, useInput, render } from 'ink';
import { AuthScreen } from './auth-screen.js';
import { ChatView } from './chat-view.js';
import { StatusBar } from './status-bar.js';
import { TaskList } from './task-list.js';
import { TaskDetail } from './task-detail.js';
import { SubmitPanel } from './submit-panel.js';
import { ProviderList } from './provider-list.js';
import { CostView } from './cost-view.js';
import { HelpPanel } from './help-panel.js';
import {
  isCloudAuthed,
  fetchHealth,
  fetchTasks,
  fetchProviders,
  fetchCost,
  loginApi,
} from './api.js';
import { cloudFetch, saveCloudConfig } from '../lib/cloud-api.js';
import { streamChat, saveChatSession } from '../lib/chat-engine.js';
import type {
  HealthResponse,
  TaskItem,
  ProviderInfo,
  CostSummary,
  OverlayId,
  ChatMessage,
  ChatMeta,
} from './types.js';

const VERSION = '2.1.0';

/** Sub-view within the tasks overlay. */
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

  // ─── Overlay state (chat-first: panels are overlays, not tabs) ────
  const [overlay, setOverlay] = useState<OverlayId>('none');

  // ─── Task overlay state ────
  const [taskSubView, setTaskSubView] = useState<TaskSubView>('list');
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);

  // ─── Data state ────
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [cost, setCost] = useState<CostSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // ─── Chat state ────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [streamMeta, setStreamMeta] = useState<ChatMeta | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // ─── Data fetch ────
  const refreshData = useCallback(async () => {
    if (!isCloudAuthed()) return;
    setLoading(true);
    setLastError(null);
    try {
      const [h, t, p, c] = await Promise.all([
        fetchHealth(),
        fetchTasks(20),
        fetchProviders(),
        fetchCost(),
      ]);
      setHealth(h);
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
      setNotice(`Login sukses — selamat datang, ${user.email}`);
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

  // ─── Chat send ────
  const handleSend = useCallback(
    (text: string) => {
      if (streaming) return;
      setLastError(null);
      setNotice(null);
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setStreaming(true);
      setStreamText('');
      setStreamMeta(null);

      void (async () => {
        try {
          const history = [...messages, { role: 'user' as const, content: text }];
          const meta = await streamChat(
            history,
            { provider: undefined },
            {
              onChunk: (chunk) => setStreamText((prev) => prev + chunk),
              onComplete: (m) => setStreamMeta(m),
            },
          );
          setMessages(history);
          setStreaming(false);
          setStreamText('');
          saveChatSession(history);
          if (meta.provider) {
            setNotice(`⚡ ${meta.provider}${meta.model ? `/${meta.model}` : ''} selesai`);
          }
          void refreshData();
        } catch (e) {
          setStreaming(false);
          setStreamText('');
          // Roll back the failed user message
          setMessages((prev) => prev.slice(0, -1));
          setLastError(`Chat gagal: ${e instanceof Error ? e.message : String(e)}`);
        }
      })();
    },
    [messages, streaming, refreshData],
  );

  // ─── Slash commands (typed in the chat input) ────
  const handleCommand = useCallback(
    (raw: string) => {
      const lower = raw.toLowerCase().trim();
      const [cmd, ...rest] = lower.split(/\s+/);

      if (cmd === '/help') {
        setOverlay('help');
        return;
      }
      if (cmd === '/tasks' || cmd === '/t') {
        setTaskSubView('list');
        setOverlay('tasks');
        void refreshData();
        return;
      }
      if (cmd === '/providers' || cmd === '/p') {
        setOverlay('providers');
        void refreshData();
        return;
      }
      if (cmd === '/cost' || cmd === '/c') {
        setOverlay('cost');
        void refreshData();
        return;
      }
      if (cmd === '/settings') {
        setOverlay('settings');
        return;
      }
      if (cmd === '/clear') {
        setMessages([]);
        setStreamMeta(null);
        setNotice('Percakapan dibersihkan.');
        return;
      }
      if (cmd === '/history') {
        setNotice(
          `Pesan: ${messages.length} (user ${messages.filter((m) => m.role === 'user').length}, agent ${messages.filter((m) => m.role === 'assistant').length})`,
        );
        return;
      }
      if (cmd === '/submit') {
        const goal = rest.join(' ').replace(/^["']|["']$/g, '');
        if (!goal) {
          setNotice('Gunakan: /submit <goal>');
          return;
        }
        setNotice(`Mengirim task: ${goal.slice(0, 60)}…`);
        void (async () => {
          try {
            const taskId = `cli-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            await cloudFetch('/v1/agentx/run', {
              method: 'POST',
              body: {
                prompt: goal,
                taskId,
                description: goal.slice(0, 120),
                complexity: 'medium',
                type: 'reasoning',
                budget: 'medium',
              },
            });
            setNotice(`✓ Task terkirim: ${taskId}`);
            void refreshData();
          } catch (e) {
            setLastError(`Submit gagal: ${e instanceof Error ? e.message : String(e)}`);
          }
        })();
        return;
      }
      if (cmd === '/logout') {
        saveCloudConfig({ apiToken: undefined });
        setAuthenticated(false);
        setEmail(undefined);
        setRoles(undefined);
        setMessages([]);
        setOverlay('none');
        return;
      }
      if (cmd === '/quit' || cmd === '/q' || cmd === '/exit') {
        if (messages.length > 0) saveChatSession(messages);
        exit();
        return;
      }
      setNotice(`Perintah tidak dikenal: ${raw}. Ketik /help.`);
    },
    [messages, exit, refreshData],
  );

  // ─── Overlay navigation ────
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

  // Keyboard only matters when an overlay owns the screen (chat input has
  // focus otherwise).
  useInput(
    useCallback(
      (_input, key) => {
        if (!authenticated) {
          if (key.escape) exit();
          return;
        }
        if (overlay === 'none') {
          // Esc with no overlay = quit (Claude Code style)
          if (key.escape) exit();
          return;
        }
        if (overlay === 'tasks' && taskSubView === 'list') {
          if (key.upArrow) navigateTask('up');
          if (key.downArrow) navigateTask('down');
          if (key.return && tasks.length > 0) setTaskSubView('detail');
          if (_input === 's' || _input === 'S') setTaskSubView('submit');
        }
        if (overlay === 'tasks' && taskSubView === 'detail' && key.escape) {
          setTaskSubView('list');
          return;
        }
        if (_input === 'r' || _input === 'R') void refreshData();
        if (key.escape) setOverlay('none');
      },
      [authenticated, exit, overlay, taskSubView, navigateTask, tasks.length, refreshData],
    ),
  );

  // ─── Render ────
  if (!authenticated) {
    return <AuthScreen onLogin={handleLogin} error={authError} loading={authLoading} />;
  }

  const overlayOpen = overlay !== 'none';
  const healthOk = health?.status === 'ok' || health?.status === 'healthy';

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      {/* Header — one line, minimal chrome */}
      <Box justifyContent="space-between">
        <Text bold color="cyan">
          ◆ AgentX
        </Text>
        <Text dimColor>
          {email ?? ''}
          {healthOk ? '  ● api' : '  ○ api'}
        </Text>
      </Box>
      <Box marginTop={1} marginBottom={1}>
        <Text dimColor>{'─'.repeat(48)}</Text>
      </Box>

      {/* Main surface: chat or overlay */}
      <Box flexGrow={1} flexDirection="column">
        {overlayOpen ? (
          <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
            <Box justifyContent="space-between">
              <Text bold color="cyanBright">
                {overlay === 'tasks' && '◆ Tasks'}
                {overlay === 'providers' && '◆ Providers'}
                {overlay === 'cost' && '◆ Cost'}
                {overlay === 'settings' && '◆ Settings'}
                {overlay === 'help' && '◆ Help'}
              </Text>
              <Text dimColor>esc: kembali</Text>
            </Box>
            <Box marginTop={1}>
              {overlay === 'tasks' && taskSubView === 'list' && (
                <TaskList
                  tasks={tasks}
                  selectedId={tasks[selectedTaskIdx]?.id ?? null}
                  loading={loading}
                />
              )}
              {overlay === 'tasks' &&
                taskSubView === 'detail' &&
                tasks[selectedTaskIdx] != null && <TaskDetail task={tasks[selectedTaskIdx]!} />}
              {overlay === 'tasks' && taskSubView === 'submit' && (
                <SubmitPanel
                  onSubmit={() => {
                    setTaskSubView('list');
                    void refreshData();
                  }}
                  onCancel={() => setTaskSubView('list')}
                />
              )}
              {overlay === 'providers' && <ProviderList providers={providers} loading={loading} />}
              {overlay === 'cost' && <CostView cost={cost} loading={loading} />}
              {overlay === 'settings' && (
                <Box flexDirection="column" gap={1}>
                  <Text>
                    Email: <Text bold>{email ?? 'unknown'}</Text>
                  </Text>
                  <Text>
                    Roles: <Text bold>{roles?.join(', ') ?? 'unknown'}</Text>
                  </Text>
                  <Text>
                    API: <Text dimColor>https://api.id-tech.cloud</Text>
                  </Text>
                  <Text dimColor>/logout untuk keluar akun · /quit untuk keluar TUI</Text>
                </Box>
              )}
              {overlay === 'help' && <HelpPanel />}
            </Box>
          </Box>
        ) : (
          <ChatView
            messages={messages}
            streaming={streaming}
            streamText={streamText}
            streamMeta={streamMeta}
            onSubmit={handleSend}
            onCommand={handleCommand}
          />
        )}
      </Box>

      {/* Notice / error line */}
      {notice && !overlayOpen && (
        <Box paddingX={1} paddingTop={1}>
          <Text color="green">✓ {notice}</Text>
        </Box>
      )}
      {lastError && !overlayOpen && (
        <Box paddingX={1} paddingTop={1}>
          <Text color="red">⚠ {lastError}</Text>
        </Box>
      )}

      {/* Status bar — one line, bottom */}
      <Box marginTop={1}>
        <StatusBar
          version={VERSION}
          email={email}
          taskCount={tasks.length}
          cost={cost?.totalCost ?? 0}
          healthStatus={healthOk ? 'ok' : 'error'}
          streaming={streaming}
        />
      </Box>
    </Box>
  );
}

// ─── Entry point ────
export function launchTUI(): void {
  render(<AgentXTUI />);
}
