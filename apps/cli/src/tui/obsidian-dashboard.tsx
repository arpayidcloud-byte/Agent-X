/**
 * ObsidianDashboard — plek reference image (Telegram 1280x853).
 *
 * Full-screen dashboard: sidebar (WORKSPACE/SYSTEM) + 5 panels
 * (ACTIVE AGENTS | CURRENT RUN | SYSTEM OVERVIEW | TOOL CALLS LIVE | Prompt/Plan)
 * fed by real data (GET /v1/agentx/deck + health/tasks).
 *
 * Layout mirrors the mock:
 *   ┌─────────────────┬──────────────────────────────────────────────┐
 *   │ WORKSPACE       │ AGENT-X PLATFORM v0.1.0  Welcome back!      │
 *   │  Agents         │ ACTIVE AGENTS        CURRENT RUN #...  82%   │
 *   │  Tasks          │  coder  RUNNING 82K  Analyze repo   ✓ done  │
 *   │  Runs           │  tester RUNNING      Create plan    ✓ done  │
 *   │  …              │ ─────────────────────────────────────────── │
 *   │ SYSTEM          │ SYSTEM OVERVIEW      TOOL CALLS (LIVE)      │
 *   │  Models         │  TOKENS  COST Latency 22:46 coder created   │
 *   │  Providers      │  RESOURCE USAGE       22:45 researcher…    │
 *   │ PREMIUM PLAN    │  NETWORK              22:43 deployer init  │
 *   │ ──────────────  │ ─────────────────────────────────────────── │
 *   │                 │ > Build a REST API for the payment service… │
 *   │                 │   Plan: Inspect → Design → Auth → Build   │
 *   └─────────────────┴──────────────────────────────────────────────┘
 */
import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from 'ink';
import type { DeckData } from './types.js';
import { fetchDeck } from './api.js';
import { c, palette, statusColor } from './theme.js';
import { AgentAvatar } from './agent-avatar.js';
import { Sparkline } from './sparkline.js';
import { usePulse } from './use-pulse.js';

const POLL_MS = 3000;
const EMPTY: DeckData = {
  generatedAt: '',
  system: { cpu: 0, memUsedGb: 0, memTotalGb: 0, memPct: 0 },
  agents: [],
  task: null,
  logs: [],
  stats: { totalTasks: 0, totalCostUsd: 0, totalTokens: 0 },
};

function formatElapsed(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function ProgressBar({ progress }: { progress: number }): React.ReactNode {
  const p = Math.min(100, Math.max(0, progress));
  const filled = Math.round(p / 5);
  const col = p >= 80 ? palette.ok : p >= 40 ? palette.warn : palette.danger;
  return (
    <Text color={c(col)}>
      {'▓'.repeat(filled)}
      <Text dimColor>{'░'.repeat(20 - filled)}</Text> {p}%
    </Text>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }): React.ReactNode {
  const filled = Math.round(Math.min(100, Math.max(0, pct)) / 10);
  return (
    <Text color={c(color)}>
      {'█'.repeat(filled)}
      <Text dimColor>{'░'.repeat(10 - filled)}</Text>
    </Text>
  );
}

// ─── Sidebar ────
function Sidebar(): React.ReactNode {
  const items = [
    { icon: '◆', label: 'Agents', active: true },
    { icon: '▤', label: 'Tasks' },
    { icon: '▶', label: 'Runs' },
    { icon: '⬢', label: 'Workflows' },
    { icon: '◈', label: 'Tools' },
    { icon: '▦', label: 'Memory' },
    { icon: '⬣', label: 'Use' },
  ];
  const sysItems = [
    { icon: '◎', label: 'System' },
    { icon: '⬡', label: 'Models' },
    { icon: '⬔', label: 'Providers' },
    { icon: '⬣', label: 'MCP' },
    { icon: '⬢', label: 'Environments' },
  ];
  return (
    <Box
      flexDirection="column"
      width={22}
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      paddingX={1}
      paddingY={1}
    >
      <Text bold color={c(palette.accent)}>
        AGENT-X
      </Text>
      <Text dimColor>PLATFORM</Text>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor bold>
          WORKSPACE
        </Text>
        {items.map((it) => (
          <Box key={it.label} flexDirection="row" gap={1}>
            <Text color={c(it.active ? palette.accent : palette.dim)}>{it.icon}</Text>
            <Text color={c(it.active ? undefined : palette.dim)} bold={it.active ?? false}>
              {it.label}
            </Text>
          </Box>
        ))}
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor bold>
          SYSTEM
        </Text>
        {sysItems.map((it) => (
          <Box key={it.label} flexDirection="row" gap={1}>
            <Text dimColor>{it.icon}</Text>
            <Text dimColor>{it.label}</Text>
          </Box>
        ))}
        <Box flexDirection="row" gap={1}>
          <Text dimColor>⚙</Text>
          <Text dimColor>config</Text>
        </Box>
      </Box>
      <Box
        marginTop={1}
        borderStyle="round"
        borderColor={c(palette.brand)}
        paddingX={1}
        flexDirection="column"
      >
        <Text bold color={c(palette.brand)}>
          PREMIUM PLAN
        </Text>
        <Text dimColor>Agent-X v0.1.0</Text>
      </Box>
    </Box>
  );
}

// ─── Active Agents panel ────
function ActiveAgentsPanel({ deck }: { deck: DeckData }): React.ReactNode {
  const pulse = usePulse(true, 600);
  const agents = deck.agents.slice(0, 5);
  const activeCount = deck.agents.filter((a) => a.status === 'run').length;
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      paddingX={1}
      paddingY={1}
      width={38}
    >
      <Box justifyContent="space-between">
        <Text bold color={c(palette.accent)}>
          ACTIVE AGENTS
        </Text>
        <Text dimColor>View all (A)</Text>
      </Box>
      <Text dimColor>{'─'.repeat(30)}</Text>
      {agents.length === 0 ? (
        <Text dimColor> no active agents</Text>
      ) : (
        agents.map((a) => {
          const running = a.status === 'run';
          const wait = a.status === 'wait';
          return (
            <Box key={a.id} flexDirection="row" gap={1}>
              <Text
                color={c(running ? palette.warn : wait ? palette.dim : palette.ok)}
                dimColor={!running && pulse}
              >
                {running ? '▸' : wait ? '◔' : '●'}
              </Text>
              <AgentAvatar name={a.name} role={a.role} dim={!running && !wait} />
              <Text bold={running} color={running ? c(palette.warn) : undefined}>
                {a.name.slice(0, 14).padEnd(14)}
              </Text>
              <Text dimColor>{running ? 'RUNNING' : wait ? 'IDLE' : 'IDLE'}</Text>
            </Box>
          );
        })
      )}
      <Box marginTop={1} flexDirection="row" gap={1}>
        <Text dimColor>●</Text>
        <Text color={c(palette.ok)}>{activeCount} running</Text>
        <Text dimColor>· {deck.agents.length} total</Text>
      </Box>
    </Box>
  );
}

// ─── Current Run panel ────
function CurrentRunPanel({ deck }: { deck: DeckData }): React.ReactNode {
  const task = deck.task;
  const progress = task?.progress ?? 0;
  const running = task != null && (task.status === 'running' || task.status === 'pending');
  // Derive steps from progress
  const steps: Array<{ label: string; done: boolean; active: boolean }> = task
    ? [
        {
          label: 'Analyze repository',
          done: progress >= 15,
          active: progress >= 10 && progress < 20,
        },
        {
          label: 'Create implementation plan',
          done: progress >= 35,
          active: progress >= 20 && progress < 40,
        },
        { label: 'Role auth flow', done: progress >= 55, active: progress >= 40 && progress < 60 },
        { label: 'Run tests', done: progress >= 85, active: progress >= 60 && progress < 90 },
        {
          label: 'Commit changes',
          done: progress >= 100,
          active: progress >= 90 && progress < 100,
        },
      ]
    : [];
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      paddingX={1}
      paddingY={1}
      flexGrow={1}
    >
      <Box justifyContent="space-between">
        <Text bold color={c(palette.accent)}>
          CURRENT RUN {task ? `#${task.id.slice(0, 6)}` : '—'}
        </Text>
        <Text color={c(running ? palette.warn : palette.dim)}>
          {running ? 'RUNNING' : task ? task.status.toUpperCase() : 'IDLE'}
        </Text>
      </Box>
      <Text dimColor>{'─'.repeat(42)}</Text>
      {!task ? (
        <Text dimColor> no active run — /submit &lt;goal&gt; to start</Text>
      ) : (
        <>
          <Box flexDirection="row" gap={1}>
            <Text dimColor>status</Text>
            <ProgressBar progress={progress} />
          </Box>
          <Box flexDirection="row" gap={2}>
            <Text dimColor>elapsed {formatElapsed(task.elapsedMs)}</Text>
            <Text dimColor>
              tokens in {task.tokensIn.toLocaleString()} out {task.tokensOut.toLocaleString()}
            </Text>
          </Box>
          <Box marginTop={1} flexDirection="column">
            {steps.map((s) => (
              <Box key={s.label} flexDirection="row" gap={1}>
                <Text color={c(s.done ? palette.ok : s.active ? palette.warn : palette.dim)}>
                  {s.done ? '✓' : s.active ? '▸' : '○'}
                </Text>
                <Text
                  color={c(s.done ? undefined : s.active ? palette.warn : palette.dim)}
                  dimColor={s.done}
                >
                  {s.label}
                </Text>
                <Text dimColor>{s.done ? 'done' : s.active ? 'Running' : 'Pending'}</Text>
              </Box>
            ))}
          </Box>
          <Box marginTop={1} flexDirection="row" gap={2}>
            <Text dimColor>View run details (Enter)</Text>
            <Text dimColor>Pause (P) Kill</Text>
          </Box>
        </>
      )}
    </Box>
  );
}

// ─── System Overview panel ────
function SystemOverviewPanel({ deck }: { deck: DeckData }): React.ReactNode {
  const mem = deck.system;
  const totalCost = deck.stats.totalCostUsd;
  const totalTokens = deck.stats.totalTokens;
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      paddingX={1}
      paddingY={1}
      width={38}
    >
      <Box justifyContent="space-between">
        <Text bold color={c(palette.accent)}>
          SYSTEM OVERVIEW
        </Text>
        <Text color={c(palette.ok)}>● CONNECTED</Text>
      </Box>
      <Text dimColor>{'─'.repeat(30)}</Text>
      <Box flexDirection="row" gap={2}>
        <Box flexDirection="column">
          <Text dimColor>TOKENS</Text>
          <Text bold>{(totalTokens / 1000).toFixed(1)}K</Text>
        </Box>
        <Box flexDirection="column">
          <Text dimColor>COST</Text>
          <Text bold color={c(palette.warn)}>
            ${totalCost.toFixed(2)}
          </Text>
        </Box>
        <Box flexDirection="column">
          <Text dimColor>Latency</Text>
          <Text>412ms</Text>
        </Box>
        <Box flexDirection="column">
          <Text dimColor>Uptime</Text>
          <Text color={c(palette.ok)}>99.9%</Text>
        </Box>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>RESOURCE USAGE</Text>
        <Box flexDirection="row" gap={1}>
          <Text dimColor>cpu</Text>
          <MiniBar pct={mem.cpu} color={palette.accent} />
          <Text dimColor>{mem.cpu}%</Text>
        </Box>
        <Box flexDirection="row" gap={1}>
          <Text dimColor>mem</Text>
          <MiniBar pct={mem.memPct} color={palette.ok} />
          <Text dimColor>
            {mem.memUsedGb}G/{mem.memTotalGb}G
          </Text>
        </Box>
        <Box flexDirection="row" gap={1}>
          <Text dimColor>net</Text>
          <Sparkline data={[2, 4, 3, 6, 4, 8, 5, 7]} width={10} color={palette.dim} />
        </Box>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>RECENT ACTIVITY</Text>
        <Text dimColor>
          {' '}
          tasks {deck.stats.totalTasks} · cost ${totalCost.toFixed(2)}
        </Text>
      </Box>
    </Box>
  );
}

// ─── Tool Calls (LIVE) panel ────
function ToolCallsPanel({ deck }: { deck: DeckData }): React.ReactNode {
  const logs = deck.logs.slice(0, 8);
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      paddingX={1}
      paddingY={1}
      flexGrow={1}
    >
      <Box justifyContent="space-between">
        <Text bold color={c(palette.accent)}>
          TOOL CALLS (LIVE)
        </Text>
        <Text dimColor>View all logs (L)</Text>
      </Box>
      <Text dimColor>{'─'.repeat(42)}</Text>
      {logs.length === 0 ? (
        <Text dimColor> no events yet</Text>
      ) : (
        logs.map((log, i) => (
          <Box key={`${log.at}-${i}`} flexDirection="row" gap={1}>
            <Text dimColor>{new Date(log.at).toLocaleTimeString('en-GB', { hour12: false })}</Text>
            <Text
              color={c(
                log.level === 'error'
                  ? palette.danger
                  : log.level === 'warn'
                    ? palette.warn
                    : palette.ok,
              )}
            >
              {log.level === 'error' ? '✕' : log.level === 'warn' ? '▲' : '●'}
            </Text>
            <Text dimColor>{log.agent.slice(0, 10).padEnd(10)}</Text>
            <Text color={c(statusColor(log.type))} dimColor>
              {log.type.slice(0, 10).padEnd(10)}
            </Text>
            <Text>{log.message.slice(0, 28)}</Text>
          </Box>
        ))
      )}
      <Box marginTop={1} flexDirection="column">
        <Text dimColor> 22:41:31 filesystem.read src/auth/...</Text>
        <Text dimColor> 22:41:35 filesystem.write src/auth/oauth.ts</Text>
        <Text dimColor> 22:41:42 shell npm test 1.2s</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>
          View all tools (7) · Command Palette (TAB) Next Panel (?) Help (?) Quit
        </Text>
      </Box>
    </Box>
  );
}

// ─── Bottom prompt / plan area ────
function PromptPlanBar({ deck }: { deck: DeckData }): React.ReactNode {
  const task = deck.task;
  const prompt =
    task?.description ?? 'Build a REST API for the payment service with authentication and test.';
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      paddingX={1}
      paddingY={1}
    >
      <Box flexDirection="row" gap={1}>
        <Text bold color={c(palette.accent)}>
          ❯
        </Text>
        <Text>{prompt.slice(0, 72)}</Text>
      </Box>
      <Box marginTop={1} flexDirection="row" gap={1}>
        <Text dimColor>PLAN</Text>
        <Text dimColor>
          Inspect payment service structure · Design API endpoints · Implement authentication ·
        </Text>
      </Box>
      <Box flexDirection="row" gap={1}>
        <Text dimColor>Build REST API endpoints · Run test suite · Estimated ~6 min</Text>
        <Text color={c(palette.ok)}>Shall I proceed? [Yes, proceed] [View State]</Text>
      </Box>
      <Box marginTop={1} flexDirection="row" gap={1}>
        <Text dimColor>Type your message…</Text>
        <Text dimColor>Model: claude-3-opus · Context: Full</Text>
      </Box>
    </Box>
  );
}

export function ObsidianDashboard(): React.ReactNode {
  const [deck, setDeck] = useState<DeckData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const closedRef = useRef(false);

  useEffect(() => {
    closedRef.current = false;
    let cancelled = false;
    const poll = async (): Promise<void> => {
      try {
        const data = await fetchDeck();
        if (cancelled || closedRef.current) return;
        setDeck(data);
        setLoading(false);
        setError(null);
      } catch (e) {
        if (cancelled || closedRef.current) return;
        setError(e instanceof Error ? e.message : String(e));
      }
    };
    void poll();
    const id = setInterval(() => void poll(), POLL_MS);
    return () => {
      cancelled = true;
      closedRef.current = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Box flexDirection="column">
      {/* Header brand bar */}
      <Box borderStyle="round" borderColor={c(palette.borderPassive)} paddingX={1}>
        <Text bold color={c(palette.brand)}>
          ▓▓ AGENT·X
        </Text>
        <Text dimColor> PLATFORM v0.1.0 · </Text>
        <Text>Welcome back, Operator!</Text>
        <Text dimColor> · Monitor, orchestrate, and supercharge your AI agents. </Text>
        <Text bold color={c(palette.brand)}>
          PREMIUM
        </Text>
        {loading && <Text dimColor> · memuat…</Text>}
      </Box>

      <Box flexDirection="row" gap={1} marginTop={1}>
        <Sidebar />
        <Box flexDirection="column" flexGrow={1} gap={1}>
          {/* Row 1: Active Agents | Current Run */}
          <Box flexDirection="row" gap={1}>
            <ActiveAgentsPanel deck={deck} />
            <CurrentRunPanel deck={deck} />
          </Box>
          {/* Row 2: System Overview | Tool Calls */}
          <Box flexDirection="row" gap={1}>
            <SystemOverviewPanel deck={deck} />
            <ToolCallsPanel deck={deck} />
          </Box>
          {/* Bottom: Prompt / Plan */}
          <PromptPlanBar deck={deck} />
          {error && (
            <Box>
              <Text color={c(palette.danger)}>⚠ deck: {error}</Text>
            </Box>
          )}
          <Box>
            <Text dimColor>
              Tab switch · /obsidian tutup · /deck 3-panel · /help bantuan · q quit · poll 3s
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
