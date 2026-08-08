/**
 * DeckView — Command Deck 3-panel (AGENTS | TASK | LOGS) fed by the real
 * GET /v1/agentx/deck aggregate, polled every 3s while the view is open.
 *
 * Layout follows the Command Deck v2 mock: header with cpu/mem, AGENTS panel
 * (left), TASK panel (right), LOGS panel (bottom), shortcut footer.
 * Everything rendered here is real data — no simulated cpu/mem/progress.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from 'ink';
import type { DeckData } from './types.js';
import { fetchDeck } from './api.js';
import { c, palette } from './theme.js';
import { AgentAvatar } from './agent-avatar.js';
import { Sparkline } from './sparkline.js';

interface DeckViewProps {
  /** Placeholder — esc ditangani useInput global di app.tsx. */
  _unused?: never;
}

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

function progressColor(p: number): string {
  if (p >= 90) return palette.ok;
  if (p >= 50) return palette.warn;
  return palette.danger;
}

function ProgressBar({ progress }: { progress: number }): React.ReactNode {
  const p = Math.min(100, Math.max(0, progress));
  const filled = Math.round(p / 5);
  const color = progressColor(p);
  return (
    <Text color={c(color)}>
      {'▓'.repeat(filled)}
      <Text dimColor>{'░'.repeat(20 - filled)}</Text> {p}%
    </Text>
  );
}

function AgentsPanel({ deck }: { deck: DeckData }): React.ReactNode {
  const agents = deck.agents;
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      width={40}
      paddingX={1}
    >
      <Text bold color={c(palette.accent)}>
        AGENTS
      </Text>
      <Text dimColor>{'─'.repeat(32)}</Text>
      {agents.length === 0 ? (
        <Text dimColor> no active agents</Text>
      ) : (
        agents.map((a) => {
          const elapsed = a.startedAt ? Date.now() - new Date(a.startedAt).getTime() : 0;
          const running = a.status === 'run';
          const waiting = a.status === 'wait';
          return (
            <Box key={a.id} flexDirection="row" gap={1}>
              <Text
                color={c(running ? palette.warn : waiting ? palette.dim : palette.ok)}
                dimColor={!running && !waiting}
              >
                {running ? '▸' : waiting ? '⏸' : '●'}
              </Text>
              <AgentAvatar name={a.name} role={a.role} dim={!running} />
              <Text bold={running} color={running ? c(palette.warn) : undefined}>
                {a.name.padEnd(16)}
              </Text>
              <Text
                color={c(running ? palette.warn : waiting ? palette.dim : palette.ok)}
                dimColor={!running}
              >
                {running ? `run ${formatElapsed(elapsed)}` : waiting ? 'wait' : 'idle'}
              </Text>
            </Box>
          );
        })
      )}
      <Box marginTop={1}>
        <Text dimColor>[+] spawn via /v1/agentx/multi-agent/run</Text>
      </Box>
    </Box>
  );
}

function TaskPanel({
  deck,
  tokensHistory,
}: {
  deck: DeckData;
  tokensHistory: number[];
}): React.ReactNode {
  const task = deck.task;
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      flexGrow={1}
      paddingX={1}
    >
      <Text bold color={c(palette.accent)}>
        TASK {task ? `#${task.id.slice(0, 8)}` : '—'}{' '}
        {task ? `─ ${task.description.slice(0, 28)}` : ''}
      </Text>
      <Text dimColor>{'─'.repeat(56)}</Text>
      {!task ? (
        <Text dimColor> no tasks yet — /submit &lt;goal&gt; di chat</Text>
      ) : (
        <>
          <Box flexDirection="row" gap={1}>
            <Text dimColor>agent </Text>
            <AgentAvatar name={task.model} role={task.provider} />
            <Text>
              {task.provider ?? '—'}/{task.model ?? '—'}
            </Text>
          </Box>
          <Box flexDirection="row" gap={1}>
            <Text dimColor>status </Text>
            <ProgressBar progress={task.progress} />
            <Text dimColor>elapsed {formatElapsed(task.elapsedMs)}</Text>
          </Box>
          <Box flexDirection="row" gap={1}>
            <Text dimColor>tokens </Text>
            <Text>
              in {task.tokensIn.toLocaleString()} out {task.tokensOut.toLocaleString()}
            </Text>
            <Sparkline data={tokensHistory} width={10} color={palette.accent} />
          </Box>
          <Box flexDirection="row" gap={1}>
            <Text dimColor>files </Text>
            <Text>
              {task.files.modified} modified · {task.files.created} new
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
}

function LogsPanel({ deck }: { deck: DeckData }): React.ReactNode {
  const logs = deck.logs;
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      height={11}
      paddingX={1}
    >
      <Box justifyContent="space-between">
        <Text bold color={c(palette.accent)}>
          LOGS <Text dimColor>▾ all · ▾ info+</Text>
        </Text>
        <Text dimColor> [f] filter · [/] search</Text>
      </Box>
      {logs.length === 0 ? (
        <Text dimColor> no events yet</Text>
      ) : (
        logs.slice(0, 7).map((log, i) => (
          <Box key={`${log.at}-${i}`} flexDirection="row">
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
              {' '}
              {log.level === 'error' ? '✕' : log.level === 'warn' ? '▲' : '●'}{' '}
              {log.agent.slice(0, 11).padEnd(11)}
            </Text>
            <Text color={c(palette.accent)} dimColor>
              {' '}
              {log.type.slice(0, 10).padEnd(10)}
            </Text>
            <Text dimColor>{log.message.slice(0, 36)}</Text>
          </Box>
        ))
      )}
    </Box>
  );
}

export function DeckView(_props: DeckViewProps): React.ReactNode {
  const [deck, setDeck] = useState<DeckData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tokenSeries = useRef<number[]>([]);
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
        // Token sparkline: cumulative output tokens across polls (real usage).
        if (data.task) {
          const out = data.task.tokensOut;
          tokenSeries.current = [...tokenSeries.current.slice(-11), out];
        }
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

  const mem = deck.system;
  const activeAgents = deck.agents.filter((a) => a.status === 'run').length;

  return (
    <Box flexDirection="column">
      {/* Header: brand + router + real host metrics */}
      <Box borderStyle="double" borderColor={c(palette.borderPassive)} paddingX={1}>
        <Text bold color={c(palette.brand)}>
          ▓▓ AGENT·X
        </Text>
        <Text dimColor> </Text>
        <Text color={c(palette.ok)}>9Router ●online</Text>
        <Text dimColor> </Text>
        <Text color={c(palette.warn)}>
          cpu {mem.cpu}% mem {mem.memUsedGb}GB/{mem.memTotalGb}GB
        </Text>
        {loading && <Text dimColor> memuat…</Text>}
        {activeAgents > 0 && <Text color={c(palette.warn)}> · {activeAgents} agent aktif</Text>}
      </Box>

      {/* Middle row: AGENTS | TASK */}
      <Box flexDirection="row" gap={1} marginTop={1}>
        <AgentsPanel deck={deck} />
        <TaskPanel deck={deck} tokensHistory={tokenSeries.current} />
      </Box>

      {/* Bottom: LOGS */}
      <Box marginTop={1}>
        <LogsPanel deck={deck} />
      </Box>

      {error && (
        <Box marginTop={1}>
          <Text color={c(palette.danger)}>⚠ deck: {error}</Text>
        </Box>
      )}

      {/* Footer */}
      <Box marginTop={1}>
        <Text color={c(palette.ok)}>❯</Text>
        <Text dimColor> </Text>
        <Text dimColor>
          Tab switch · Enter select · n new task · k kill · r restart · ? help · q quit · esc: tutup
          (poll 3s, data real)
        </Text>
      </Box>
    </Box>
  );
}
