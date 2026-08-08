/**
 * ChatView — the main surface of the chat-first TUI.
 *
 * Message history (newest pinned at bottom) + a sticky input line.
 * - Prompt prefix changes `>` → `!` when the draft starts with `!` (shell mode,
 *   Antigravity-style) — the app routes `!`-prefixed submits to a shell exec.
 * - ↑/↓ on an EMPTY draft walks the input history.
 * - Lines starting with `/` are routed to `onCommand`.
 */
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import type { ChatMessage, ChatMeta, TaskItem } from './types.js';
import { c } from './theme.js';
import { WarpBlock } from './warp-block.js';
import { WarpTaskCard } from './warp-task-card.js';

interface ChatViewProps {
  messages: ChatMessage[];
  streaming: boolean;
  streamText: string;
  streamMeta: ChatMeta | null;
  history: string[];
  onSubmit: (text: string) => void;
  onCommand: (cmd: string) => void;
  /** Latest running tasks to show inline after the last user message. */
  tasks?: TaskItem[];
  disabledHint?: string;
}

/** Lightweight markdown-ish renderer: code fences get cyan + dim. */
function renderRich(content: string): React.ReactNode[] {
  const parts = content.split(/```/);
  return parts.map((part, i) =>
    i % 2 === 0 ? (
      <Text key={i}>{part}</Text>
    ) : (
      <Text key={i} color="cyan" dimColor>
        {part}
      </Text>
    ),
  );
}

function MetaLine({ meta }: { meta: ChatMeta }): React.ReactNode {
  const bits: string[] = [];
  if (meta.provider) bits.push(`⚡ ${meta.provider}${meta.model ? `/${meta.model}` : ''}`);
  if (meta.cost != null) bits.push(`$${meta.cost.toFixed(4)}`);
  if (meta.latencyMs != null) bits.push(`${meta.latencyMs}ms`);
  if (bits.length === 0) return null;
  return (
    <Box marginBottom={1}>
      <Text dimColor>{bits.join(' · ')}</Text>
    </Box>
  );
}

export function ChatView({
  messages,
  streaming,
  streamText,
  streamMeta,
  history,
  onSubmit,
  onCommand,
  tasks,
  disabledHint,
}: ChatViewProps): React.ReactNode {
  const [draft, setDraft] = useState('');
  const [histIdx, setHistIdx] = useState(-1);

  // Newest-first, so with column-reverse the latest message pins to the bottom.
  const display: Array<{ role: 'user' | 'assistant'; content: string; live?: boolean }> = [];
  for (const m of messages) display.push(m);
  if (streaming || streamText) display.push({ role: 'assistant', content: streamText, live: true });
  display.reverse();
  const lastLive = display[0]?.live === true;

  const shellMode = draft.startsWith('!');
  const prefix = shellMode ? '!' : '>';

  // ↑/↓ walk input history — only on an EMPTY draft (TextInput owns the arrows
  // while there is text, so no conflict).
  useInput(
    (_input, key) => {
      if (streaming) return;
      if (draft !== '') return;
      if (key.upArrow && history.length > 0) {
        const next = Math.min(histIdx + 1, history.length - 1);
        setHistIdx(next);
        setDraft(history[history.length - 1 - next] ?? '');
      } else if (key.downArrow) {
        if (histIdx <= 0) {
          setHistIdx(-1);
          setDraft('');
        } else {
          const next = histIdx - 1;
          setHistIdx(next);
          setDraft(history[history.length - 1 - next] ?? '');
        }
      }
    },
    { isActive: !streaming },
  );

  const handleSubmit = (value: string): void => {
    const text = value.trim();
    if (!text) return;
    setDraft('');
    setHistIdx(-1);
    if (text.startsWith('/')) {
      onCommand(text);
      return;
    }
    onSubmit(text);
  };

  return (
    <Box flexDirection="column" flexGrow={1}>
      {/* Message area — Warp blocks (newest at bottom) */}
      <Box flexDirection="column-reverse" flexGrow={1} overflowY="hidden" paddingX={1}>
        {display.length === 0 && !streaming ? (
          <Box marginTop={1}>
            <Text dimColor>
              Selamat datang di Agent-X Platform. Ketik pesan untuk mulai — mis. "buatkan REST API
              user management". /help untuk daftar perintah. Awali dengan ! untuk shell.
            </Text>
          </Box>
        ) : null}
        {/* Inline task card — latest running task right after the last user block */}
        {tasks &&
          tasks
            .filter((t) => t.status === 'running' || t.status === 'pending')
            .slice(0, 1)
            .map((t) => (
              <Box key={`card-${t.id}`} marginBottom={1}>
                <WarpTaskCard
                  id={t.id}
                  description={(t.description ?? t.prompt ?? '').slice(0, 72)}
                  progress={null}
                  status={t.status}
                  fileHint={t.prompt ? t.prompt.slice(0, 48) : null}
                  agents={[]}
                  providerHint={t.provider ?? null}
                />
              </Box>
            ))}
        {display.map((m, idx) =>
          m.role === 'user' ? (
            <WarpBlock
              key={`u-${messages.length - idx}`}
              title={m.content.slice(0, 48) || 'pesan'}
              stamp="now"
              status="done"
            >
              <Text>{m.content}</Text>
            </WarpBlock>
          ) : (
            <WarpBlock
              key={`a-${messages.length - idx}`}
              title="agent"
              stamp={m.live ? 'live' : 'done'}
              status={m.live ? 'run' : 'done'}
            >
              <Text>
                {renderRich(m.content)}
                {m.live && !streaming ? <Text color={c('green')}>▊</Text> : null}
              </Text>
              {m.live && streaming ? <Text dimColor>…</Text> : null}
            </WarpBlock>
          ),
        )}
        {!streaming && streamMeta && lastLive ? <MetaLine meta={streamMeta} /> : null}
      </Box>

      {/* Input line */}
      <Box
        paddingX={1}
        paddingTop={1}
        borderStyle="single"
        borderColor={c(shellMode ? 'red' : 'gray')}
      >
        <Text bold color={c(shellMode ? 'red' : 'green')}>
          {prefix}{' '}
        </Text>
        <TextInput
          value={draft}
          onChange={setDraft}
          onSubmit={handleSubmit}
          placeholder={
            streaming
              ? '…sedang mengetik (tunggu selesai)'
              : shellMode
                ? 'perintah shell — mis. ls -la'
                : 'pesan — /help · ! untuk shell'
          }
        />
      </Box>
      {disabledHint ? (
        <Box paddingX={1}>
          <Text color="yellow">{disabledHint}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
