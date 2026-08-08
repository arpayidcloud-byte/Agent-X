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
import type { ChatMessage, ChatMeta } from './types.js';
import { c } from './theme.js';

interface ChatViewProps {
  messages: ChatMessage[];
  streaming: boolean;
  streamText: string;
  streamMeta: ChatMeta | null;
  history: string[];
  onSubmit: (text: string) => void;
  onCommand: (cmd: string) => void;
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
      {/* Message area — newest pinned at the bottom */}
      <Box flexDirection="column-reverse" flexGrow={1} overflowY="hidden" paddingX={1}>
        {display.length === 0 && !streaming ? (
          <Box marginTop={1}>
            <Text dimColor>
              Selamat datang di AgentX. Ketik pesan untuk mulai — mis. "buatkan REST API user
              management". /help untuk daftar perintah. Awali dengan ! untuk shell.
            </Text>
          </Box>
        ) : null}
        {display.map((m, idx) =>
          m.role === 'user' ? (
            <Box key={`u-${messages.length - idx}`} marginBottom={1} marginTop={1}>
              <Text bold color={c('cyanBright')}>
                you ▸{' '}
              </Text>
              <Text>{m.content}</Text>
            </Box>
          ) : (
            <Box key={`a-${messages.length - idx}`} marginBottom={1} flexDirection="column">
              <Text bold color={c('magenta')}>
                agent ✦{' '}
              </Text>
              <Text>
                {renderRich(m.content)}
                {m.live && !streaming ? <Text color={c('green')}>▊</Text> : null}
              </Text>
              {m.live && streaming ? <Text dimColor>…</Text> : null}
            </Box>
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
