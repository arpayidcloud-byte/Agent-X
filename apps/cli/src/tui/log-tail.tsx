/**
 * LogTail — live task event stream overlay (AgentX TUI Design: "Logs (live tail)").
 *
 * Opens with /logs <taskId> (or the most recent task). Consumes the SSE
 * endpoint /v1/agentx/tasks/:id/events (replays buffered history, then live).
 * - Buffer capped at 500 entries; newest pinned at bottom (column-reverse).
 * - Esc closes; r reconnects; automatic reconnect with backoff (2s/4s/8s).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { cloudSSE } from '../lib/cloud-api.js';
import { c, palette } from './theme.js';
import { Spinner } from './spinner.js';

export interface TaskLogEvent {
  type: string;
  taskId: string;
  at: string;
  status?: string;
  provider?: string;
  model?: string;
  response?: string;
  error?: string;
  [key: string]: unknown;
}

interface LogTailProps {
  taskId: string;
  onClose: () => void;
}

const MAX_LOG = 500;

function formatTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleTimeString('en-GB', { hour12: false });
}

function eventColor(ev: TaskLogEvent): string {
  if (ev.type === 'complete') return ev.status === 'success' ? palette.ok : palette.danger;
  if (ev.type === 'error') return palette.danger;
  if (ev.type === 'generating') return palette.warn;
  return palette.accent;
}

/** Badge glyph per event — readable even in monochrome terminals. */
function eventBadge(ev: TaskLogEvent): string {
  if (ev.type === 'complete') return ev.status === 'success' ? '●' : '✕';
  if (ev.type === 'error') return '✕';
  if (ev.type === 'generating') return '▸';
  return '◔';
}

function eventText(ev: TaskLogEvent): string {
  switch (ev.type) {
    case 'accepted':
      return `task diterima (${ev.taskId})`;
    case 'generating':
      return `menghasilkan… ${ev.provider ? `via ${ev.provider}${ev.model ? `/${ev.model}` : ''}` : ''}`;
    case 'complete':
      return ev.status === 'success'
        ? `selesai ${ev.provider ? `(${ev.provider}${ev.model ? `/${ev.model}` : ''})` : ''}${ev.response ? ` — ${ev.response.slice(0, 120)}` : ''}`
        : `gagal: ${ev.error ?? 'unknown error'}`;
    default:
      return `${ev.type}${ev.error ? `: ${ev.error}` : ''}`;
  }
}

type LevelFilter = 'all' | 'error' | 'warn' | 'info';

const LEVEL_ORDER: LevelFilter[] = ['all', 'error', 'warn', 'info'];

function levelOf(ev: TaskLogEvent): LevelFilter {
  if (ev.type === 'error') return 'error';
  if (ev.type === 'complete' && ev.status !== 'success') return 'error';
  if (ev.type === 'generating') return 'warn';
  return 'info';
}

export function LogTail({ taskId, onClose }: LogTailProps): React.ReactNode {
  const [logs, setLogs] = useState<TaskLogEvent[]>([]);
  const [connecting, setConnecting] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [connError, setConnError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const aborter = useRef<AbortController | null>(null);
  const attempts = useRef(0);

  // Connect / reconnect to the SSE stream.
  const connect = useCallback(
    (initial: boolean): void => {
      aborter.current?.abort();
      const ac = new AbortController();
      aborter.current = ac;
      setConnError(null);
      setConnecting(initial);
      setReconnecting(!initial);

      void (async () => {
        try {
          const res = await cloudSSE(`/v1/agentx/tasks/${taskId}/events`, { signal: ac.signal });
          const reader = res.body?.getReader();
          if (!reader) throw new Error('stream kosong');
          const decoder = new TextDecoder();
          let buffer = '';
          attempts.current = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              try {
                const ev = JSON.parse(line.slice(6)) as TaskLogEvent;
                setLogs((prev) => {
                  const next = [...prev, ev];
                  return next.length > MAX_LOG ? next.slice(next.length - MAX_LOG) : next;
                });
              } catch {
                // ignore malformed frames
              }
            }
          }
          // Stream ended without abort → schedule reconnect with backoff.
          if (!ac.signal.aborted) {
            const delayMs = Math.min(2000 * 2 ** attempts.current, 8000);
            attempts.current += 1;
            setTimeout(() => connect(false), delayMs);
          }
        } catch (e) {
          if (ac.signal.aborted) return;
          setConnecting(false);
          setReconnecting(false);
          setConnError(e instanceof Error ? e.message : String(e));
          const delayMs = Math.min(2000 * 2 ** attempts.current, 8000);
          attempts.current += 1;
          setTimeout(() => connect(false), delayMs);
        } finally {
          setConnecting(false);
          setReconnecting(false);
        }
      })();
    },
    [taskId],
  );

  useEffect(() => {
    connect(true);
    return () => aborter.current?.abort();
  }, [connect]);

  useInput((input, key) => {
    if (searchMode) {
      // Search input owns the keyboard while open.
      if (key.escape) setSearchMode(false);
      return;
    }
    if (key.escape) {
      onClose();
      return;
    }
    if (input === 'f' || input === 'F') {
      const next = LEVEL_ORDER[(LEVEL_ORDER.indexOf(levelFilter) + 1) % LEVEL_ORDER.length];
      setLevelFilter(next ?? 'all');
      return;
    }
    if (input === '/') {
      setSearchQuery('');
      setSearchMode(true);
      return;
    }
    if (input === 'r' || input === 'R') connect(true);
  });

  const filtered = [...logs].reverse().filter((ev) => {
    if (levelFilter !== 'all' && levelOf(ev) !== levelFilter) return false;
    if (searchQuery && !JSON.stringify(ev).toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });
  const display = filtered;

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor={c('cyan')}>
      <Box justifyContent="space-between">
        <Text bold color={c(palette.accent)}>
          ◈ Logs · {taskId}
        </Text>
        <Text dimColor>
          {connecting ? (
            <Text color={c(palette.warn)}>
              <Spinner /> menghubungkan…
            </Text>
          ) : reconnecting ? (
            <Text color={c(palette.warn)}>
              <Spinner /> reconnecting…
            </Text>
          ) : (
            <Text color={c(palette.ok)}>● live</Text>
          )}{' '}
          · <Text color={c(palette.accent)}>f:{levelFilter}</Text> · / cari · r: ulang · esc: tutup
        </Text>
      </Box>
      {connError && (
        <Box marginTop={1}>
          <Text color={c('red')}>⚠ {connError}</Text>
        </Box>
      )}
      {searchMode ? (
        <Box marginTop={1} flexDirection="row" gap={1}>
          <Text color={c(palette.warn)}>/</Text>
          <TextInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={() => setSearchMode(false)}
          />
          <Text dimColor>enter: terapkan · esc: batal</Text>
        </Box>
      ) : null}
      <Box flexDirection="column-reverse" overflowY="hidden" height={16} marginTop={1}>
        {display.length === 0 && (
          <Text dimColor>
            {connecting
              ? 'menunggu event…'
              : levelFilter !== 'all' || searchQuery
                ? '(tidak ada event cocok)'
                : '(belum ada event)'}
          </Text>
        )}
        {display.map((ev, idx) => (
          <Box key={`${ev.at}-${idx}`} flexDirection="row">
            <Text dimColor>{formatTime(ev.at)}</Text>
            <Text color={c(eventColor(ev))}>
              {' '}
              {eventBadge(ev)} [{ev.type}]
            </Text>
            <Text> {eventText(ev)}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
