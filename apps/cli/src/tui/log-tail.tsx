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
import { cloudSSE } from '../lib/cloud-api.js';
import { c } from './theme.js';

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

function eventColor(ev: TaskLogEvent): string | undefined {
  if (ev.type === 'complete') return ev.status === 'success' ? 'green' : 'red';
  if (ev.type === 'error') return 'red';
  return 'cyan';
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

export function LogTail({ taskId, onClose }: LogTailProps): React.ReactNode {
  const [logs, setLogs] = useState<TaskLogEvent[]>([]);
  const [connecting, setConnecting] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [connError, setConnError] = useState<string | null>(null);
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

  useInput((_input, key) => {
    if (key.escape) {
      onClose();
      return;
    }
    if (_input === 'r' || _input === 'R') connect(true);
  });

  const display = [...logs].reverse();

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor={c('cyan')}>
      <Box justifyContent="space-between">
        <Text bold color={c('cyanBright')}>
          ◈ Logs · {taskId}
        </Text>
        <Text dimColor>
          {connecting ? 'menghubungkan…' : reconnecting ? 'reconnecting…' : 'live'} · r: ulang ·
          esc: tutup
        </Text>
      </Box>
      {connError && (
        <Box marginTop={1}>
          <Text color={c('red')}>⚠ {connError}</Text>
        </Box>
      )}
      <Box flexDirection="column-reverse" overflowY="hidden" height={18} marginTop={1}>
        {display.length === 0 && (
          <Text dimColor>{connecting ? 'menunggu event…' : '(belum ada event)'}</Text>
        )}
        {display.map((ev, idx) => (
          <Box key={`${ev.at}-${idx}`} flexDirection="row">
            <Text dimColor>{formatTime(ev.at)}</Text>
            <Text color={c(eventColor(ev))}> [{ev.type}]</Text>
            <Text> {eventText(ev)}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
