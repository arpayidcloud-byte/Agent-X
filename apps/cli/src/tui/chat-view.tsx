/**
 * ChatView — the main surface of the chat-first TUI.
 *
 * Message history (oldest clipped at top, newest pinned at bottom) + a
 * sticky input line. Streaming assistant text renders token-by-token with a
 * blinking cursor. Lines starting with `/` are routed to `onCommand`.
 */
import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import type { ChatMessage, ChatMeta } from './types.js';

interface ChatViewProps {
  messages: ChatMessage[];
  streaming: boolean;
  streamText: string;
  streamMeta: ChatMeta | null;
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
  onSubmit,
  onCommand,
  disabledHint,
}: ChatViewProps): React.ReactNode {
  const [draft, setDraft] = useState('');

  // Newest-first, so with column-reverse the latest message pins to the bottom
  // and the oldest scrolls off the top.
  const display: Array<{ role: 'user' | 'assistant'; content: string; live?: boolean }> = [];
  for (const m of messages) display.push(m);
  if (streaming || streamText) display.push({ role: 'assistant', content: streamText, live: true });
  display.reverse();
  const lastLive = display[0]?.live === true;

  const handleSubmit = (value: string): void => {
    const text = value.trim();
    if (!text) return;
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
              management". /help untuk daftar perintah.
            </Text>
          </Box>
        ) : null}
        {display.map((m, idx) =>
          m.role === 'user' ? (
            <Box key={`u-${messages.length - idx}`} marginBottom={1} marginTop={1}>
              <Text bold color="cyanBright">
                you ▸{' '}
              </Text>
              <Text>{m.content}</Text>
            </Box>
          ) : (
            <Box key={`a-${messages.length - idx}`} marginBottom={1} flexDirection="column">
              <Text bold color="magenta">
                agent ✦{' '}
              </Text>
              <Text>
                {renderRich(m.content)}
                {m.live && !streaming ? <Text color="green">▊</Text> : null}
              </Text>
              {m.live && streaming ? <Text dimColor>…</Text> : null}
            </Box>
          ),
        )}
        {!streaming && streamMeta && lastLive ? <MetaLine meta={streamMeta} /> : null}
      </Box>

      {/* Input line */}
      <Box paddingX={1} paddingTop={1} borderStyle="single" borderColor="gray">
        <Text bold color="green">
          {'> '}
        </Text>
        <TextInput
          value={draft}
          onChange={setDraft}
          onSubmit={handleSubmit}
          placeholder={
            streaming ? '…sedang mengetik (tunggu selesai)' : 'pesan — /help untuk perintah'
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
