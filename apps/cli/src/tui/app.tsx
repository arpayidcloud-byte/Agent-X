/**
 * AgentX CLI TUI — Chat-first main shell (Antigravity-inspired).
 *
 * Chat is THE main surface. Panels are overlays toggled by slash commands.
 * Antigravity-style additions (2026-08-07):
 *   - `!cmd` shell mode → ephemeral output modal (prefix changes > → !)
 *   - /model provider picker (↑↓ Enter Esc)
 *   - input history (↑/↓ on empty draft)
 *   - /btw one-shot quick question, /context session summary
 *   - resume hint on quit, truncated status line
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Text, useApp, useInput, render } from 'ink';
import { execFile } from 'node:child_process';
import { AuthScreen } from './auth-screen.js';
import { ChatView } from './chat-view.js';
import { ShellModal, type ShellResult } from './shell-modal.js';
import { ModelPicker } from './model-picker.js';
import { FlowHeader } from './flow-header.js';
import { FlowFooter } from './flow-footer.js';
import { TaskList } from './task-list.js';
import { TaskDetail } from './task-detail.js';
import { SubmitPanel } from './submit-panel.js';
import { ProviderList } from './provider-list.js';
import { CostView } from './cost-view.js';
import { HelpPanel } from './help-panel.js';
import { LogTail } from './log-tail.js';
import { BootScreen } from './boot-screen.js';
import { RouterView } from './router-view.js';
import { HealthView } from './health-view.js';
import { DeckView } from './deck-view.js';
import { c, palette } from './theme.js';
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
  Toast,
} from './types.js';

const VERSION = '2.2.0';
const SHELL_OUTPUT_CAP = 4000;

/** Sub-view within the tasks overlay. */
type TaskSubView = 'list' | 'detail' | 'submit';

function useInterval(fn: () => void, ms: number): void {
  useEffect(() => {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  }, [fn, ms]);
}

/** Run a local shell command, capturing output + exit code (Antigravity ! mode). */
function runShellCommand(command: string): Promise<ShellResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    execFile(
      '/bin/sh',
      ['-c', command],
      { timeout: 15000, maxBuffer: 64 * 1024 },
      (err, stdout, stderr) => {
        const raw = (stdout + (stderr ? `\n${stderr}` : '')).trim();
        const truncated = raw.length > SHELL_OUTPUT_CAP;
        const exitCode = err
          ? typeof (err as { code?: unknown }).code === 'number'
            ? (err as { code: number }).code
            : 1
          : 0;
        resolve({
          command,
          output: truncated ? raw.slice(-SHELL_OUTPUT_CAP) : raw,
          exitCode,
          durationMs: Date.now() - start,
          truncated,
        });
      },
    );
  });
}

export default function AgentXTUI(): React.ReactNode {
  const { exit } = useApp();

  // ─── Auth state ────
  const [booting, setBooting] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean>(() => isCloudAuthed());
  const [email, setEmail] = useState<string | undefined>();
  const [roles, setRoles] = useState<string[] | undefined>();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // ─── Overlay state ────
  const [overlay, setOverlay] = useState<OverlayId>('none');
  const [shellResult, setShellResult] = useState<ShellResult | null>(null);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [logTaskId, setLogTaskId] = useState<string | null>(null);

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
  const [chatReconnecting, setChatReconnecting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  // Task-count series across polls — feeds the status-bar activity sparkline.
  const [taskHistory, setTaskHistory] = useState<number[]>([]);

  // ─── Toast notifications (auto-dismiss ~4s, Command Deck v2 §5) ────
  const pushToast = useCallback((text: string, kind: Toast['kind'] = 'info') => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, text, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

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
      setTaskHistory((prev) => [...prev.slice(-19), t.length]);
    } catch (e) {
      const status = (e as Error & { status?: number }).status;
      if (status === 401) {
        // Session expired — back to the auth screen. (403 = role-based denial,
        // NOT a dead session — logging out on 403 bounces non-admin users.)
        setAuthenticated(false);
        setEmail(undefined);
        setRoles(undefined);
        setNotice('Sesi berakhir — login ulang.');
        return;
      }
      setLastError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

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
      setInputHistory((prev) => [text, ...prev].slice(0, 30));
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
            { provider: selectedProvider ?? undefined },
            {
              onChunk: (chunk) => {
                setChatReconnecting(false);
                setStreamText((prev) => prev + chunk);
              },
              onComplete: (m) => setStreamMeta(m),
              onReconnect: () => setChatReconnecting(true),
            },
          );
          setMessages(history);
          setStreaming(false);
          setStreamText('');
          saveChatSession(history);
          if (meta.provider) {
            setNotice(`⚡ ${meta.provider}${meta.model ? `/${meta.model}` : ''} selesai`);
            pushToast(
              `✓ selesai · ${meta.provider}${meta.model ? `/${meta.model}` : ''}${meta.cost != null ? ` · $${Number(meta.cost).toFixed(4)}` : ''}${meta.latencyMs != null ? ` · ${Math.round(meta.latencyMs)}ms` : ''}`,
              'ok',
            );
          }
          void refreshData();
        } catch (e) {
          setStreaming(false);
          setStreamText('');
          setMessages((prev) => prev.slice(0, -1));
          const status = (e as Error & { status?: number }).status;
          if (status === 401) {
            setAuthenticated(false);
            setEmail(undefined);
            setRoles(undefined);
            setNotice('Sesi berakhir — login ulang.');
            return;
          }
          setLastError(`Chat gagal: ${e instanceof Error ? e.message : String(e)}`);
          pushToast(`✕ chat gagal · ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      })();
    },
    [messages, streaming, selectedProvider, refreshData, pushToast],
  );

  // ─── Shell mode (`!cmd`) ────
  const handleShell = useCallback((command: string) => {
    setNotice(`Menjalankan: ${command}`);
    void (async () => {
      try {
        const result = await runShellCommand(command);
        setShellResult(result);
      } catch (e) {
        setShellResult({
          command,
          output: e instanceof Error ? e.message : String(e),
          exitCode: 1,
          durationMs: 0,
        });
      }
    })();
  }, []);

  // ─── Slash commands ────
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
      if (cmd === '/router' || cmd === '/m') {
        setOverlay('router');
        void refreshData();
        return;
      }
      if (cmd === '/health' || cmd === '/h') {
        setOverlay('health');
        void refreshData();
        return;
      }
      if (cmd === '/deck' || cmd === '/d') {
        setOverlay('deck');
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
      if (cmd === '/model') {
        setModelPickerOpen(true);
        void refreshData();
        return;
      }
      if (cmd === '/shell') {
        const shellCmd = rest.join(' ').replace(/^["']|["']$/g, '');
        if (!shellCmd) {
          setNotice('Gunakan: /shell <perintah> — atau awali pesan dengan !');
          return;
        }
        handleShell(shellCmd);
        return;
      }
      if (cmd === '/btw') {
        const btwText = rest.join(' ').replace(/^["']|["']$/g, '');
        if (!btwText) {
          setNotice('Gunakan: /btw <pertanyaan cepat>');
          return;
        }
        handleSend(btwText);
        return;
      }
      if (cmd === '/context') {
        const userMsgs = messages.filter((m) => m.role === 'user').length;
        const chars = messages.reduce((sum, m) => sum + m.content.length, 0);
        const estTokens = Math.ceil(chars / 4);
        setNotice(
          `Konteks: ${messages.length} pesan (${userMsgs} user) · ${chars.toLocaleString()} chars · ~${estTokens.toLocaleString()} token · provider ${selectedProvider ?? 'auto'}`,
        );
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
      if (cmd === '/logs' || cmd === '/l') {
        const rawId = rest.join(' ').replace(/^["']|["']$/g, '');
        const targetId = rawId || tasks[0]?.id;
        if (!targetId) {
          setNotice('Tidak ada task. Gunakan: /logs <taskId>');
          return;
        }
        setLogTaskId(targetId);
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
        setNotice('Session tersimpan — jalankan "agentx tui" lagi untuk melanjutkan.');
        exit();
        return;
      }
      setNotice(`Perintah tidak dikenal: ${raw}. Ketik /help.`);
    },
    [messages, exit, refreshData, handleShell, handleSend, selectedProvider],
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

  // Global keyboard — active only when an overlay/modal owns the screen.
  useInput(
    useCallback(
      (_input, key) => {
        if (!authenticated) {
          if (key.escape) exit();
          return;
        }
        // Full-screen overlays own the keyboard.
        if (shellResult || logTaskId || modelPickerOpen) return;
        if (overlay === 'none') {
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
      [
        authenticated,
        exit,
        overlay,
        taskSubView,
        navigateTask,
        tasks.length,
        refreshData,
        shellResult,
      ],
    ),
  );

  // ─── Render ────
  const healthOk = health?.status === 'ok' || health?.status === 'healthy';

  // "Command Deck" splash — logo gradient + connecting spinner → ✓ connected.
  if (booting) {
    return <BootScreen version={VERSION} connected={healthOk} onDone={() => setBooting(false)} />;
  }

  if (!authenticated) {
    return <AuthScreen onLogin={handleLogin} error={authError} loading={authLoading} />;
  }

  const overlayOpen = overlay !== 'none';

  // Shell output modal takes the full screen (ephemeral, Antigravity-style).
  if (shellResult) {
    return <ShellModal result={shellResult} onClose={() => setShellResult(null)} />;
  }

  // Live task log tail (SSE).
  if (logTaskId) {
    return <LogTail taskId={logTaskId} onClose={() => setLogTaskId(null)} />;
  }

  // Model picker modal.
  if (modelPickerOpen) {
    return (
      <ModelPicker
        providers={providers}
        current={selectedProvider}
        onSelect={(name) => {
          setSelectedProvider(name === 'auto' ? null : name);
          setModelPickerOpen(false);
          setNotice(`Provider: ${name === 'auto' ? 'auto (router)' : name}`);
        }}
        onClose={() => setModelPickerOpen(false)}
      />
    );
  }

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      {/* Header — Agent-X Platform, no provider */}
      <FlowHeader email={email} healthOk={healthOk} />

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
                {overlay === 'router' && '◆ Router'}
                {overlay === 'health' && '◆ Health'}
                {overlay === 'deck' && '◆ Command Deck'}
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
              {overlay === 'router' && <RouterView providers={providers} loading={loading} />}
              {overlay === 'health' && <HealthView health={health} loading={loading} />}
              {overlay === 'deck' && <DeckView />}
              {overlay === 'settings' && (
                <Box flexDirection="column" gap={1}>
                  <Text>
                    Email: <Text bold>{email ?? 'unknown'}</Text>
                  </Text>
                  <Text>
                    Roles: <Text bold>{roles?.join(', ') ?? 'unknown'}</Text>
                  </Text>
                  <Text>
                    Provider: <Text bold>{selectedProvider ?? 'auto'}</Text>
                  </Text>
                  <Text>
                    API: <Text dimColor>https://api.id-tech.cloud</Text>
                  </Text>
                  <Text dimColor>
                    /model untuk ganti provider · /logout keluar akun · /quit keluar TUI
                  </Text>
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
            history={inputHistory}
            tasks={tasks}
            onSubmit={(text) => {
              if (text.startsWith('!')) {
                handleShell(text.slice(1).trim());
              } else {
                handleSend(text);
              }
            }}
            onCommand={handleCommand}
          />
        )}
      </Box>

      {/* Toast notifications — right-aligned above the input (Command Deck v2 §5) */}
      {toasts.length > 0 && !overlayOpen && !shellResult && (
        <Box justifyContent="flex-end" paddingX={1} paddingTop={1}>
          {toasts.map((t) => (
            <Text
              key={t.id}
              color={c(
                t.kind === 'ok' ? palette.ok : t.kind === 'error' ? palette.danger : palette.accent,
              )}
            >
              {' '}
              {t.text}
            </Text>
          ))}
        </Box>
      )}

      {/* Notice / error line */}
      {notice && !overlayOpen && !shellResult && (
        <Box paddingX={1} paddingTop={1}>
          <Text color={c('green')}>✓ {notice}</Text>
        </Box>
      )}
      {lastError && !overlayOpen && !shellResult && (
        <Box paddingX={1} paddingTop={1}>
          <Text color={c('red')}>⚠ {lastError}</Text>
        </Box>
      )}

      {/* Status bar — Flow footer (ambient, no provider) */}
      <Box marginTop={1}>
        <FlowFooter
          running={tasks.filter((t) => t.status === 'running' || t.status === 'pending').length}
          total={tasks.length}
          activity={taskHistory}
          hint={streaming || chatReconnecting ? 'streaming…' : ' / commands · q quit'}
        />
      </Box>
    </Box>
  );
}

// ─── Entry point ────
export function launchTUI(): void {
  render(<AgentXTUI />);
}
