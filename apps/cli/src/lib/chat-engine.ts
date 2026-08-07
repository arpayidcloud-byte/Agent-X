/**
 * Chat streaming engine — shared by `agentx chat` (readline CLI) and the
 * chat-first TUI. One implementation, two surfaces.
 *
 * Flow: POST /v1/agentx/chat/stream → { chatId } → GET /v1/agentx/chat/:id/events (SSE)
 * Events: start → chunk* → complete | error
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { cloudFetch, cloudSSE, configHome } from './cloud-api.js';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatStreamEvent {
  type: 'start' | 'chunk' | 'complete' | 'error';
  chatId: string;
  text?: string;
  provider?: string;
  model?: string;
  usage?: { inputTokens: number; outputTokens: number; totalTokens: number };
  cost?: number;
  latencyMs?: number;
  error?: string;
  at: string;
}

export interface ChatMeta {
  provider?: string;
  model?: string;
  cost?: number;
  latencyMs?: number;
  usage?: ChatStreamEvent['usage'];
}

/** Live callbacks fired while the stream is being consumed. */
export interface ChatStreamHandlers {
  onStart?: (provider: string | undefined, model: string | undefined) => void;
  onChunk?: (text: string) => void;
  onComplete?: (meta: ChatMeta) => void;
}

// ─── Session persistence ────
function sessionsDir(): string {
  const dir = path.join(configHome, 'sessions');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function saveChatSession(messages: ChatMessage[]): void {
  if (messages.length === 0) return;
  const id = `chat-${Date.now()}`;
  const file = path.join(sessionsDir(), `${id}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify({ id, messages, savedAt: new Date().toISOString() }, null, 2),
  );
}

/**
 * Send the message history and stream the assistant reply.
 * On success the assistant message is appended to `messages`.
 * Returns response metadata (provider/model/cost/latency).
 */
export async function streamChat(
  messages: ChatMessage[],
  options: { provider?: string; model?: string },
  handlers: ChatStreamHandlers = {},
): Promise<ChatMeta> {
  const res = await cloudFetch<{ chatId: string; status: string }>('/v1/agentx/chat/stream', {
    method: 'POST',
    body: { messages, provider: options.provider },
  });

  const { chatId } = res;
  const sseRes = await cloudSSE(`/v1/agentx/chat/${chatId}/events`);

  let responseText = '';
  const meta: ChatMeta = {};
  let completed = false;

  const reader = sseRes.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done || completed) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;

        let event: ChatStreamEvent;
        try {
          event = JSON.parse(raw) as ChatStreamEvent;
        } catch {
          continue;
        }

        if (event.type === 'start') {
          meta.provider = event.provider;
          meta.model = event.model;
          handlers.onStart?.(event.provider, event.model);
        } else if (event.type === 'chunk' && event.text) {
          responseText += event.text;
          handlers.onChunk?.(event.text);
        } else if (event.type === 'complete') {
          meta.cost = event.cost;
          meta.latencyMs = event.latencyMs;
          meta.usage = event.usage;
          completed = true;
          handlers.onComplete?.(meta);
        } else if (event.type === 'error') {
          completed = true;
          throw new Error(event.error ?? 'Chat failed');
        }
      }
      if (completed) break;
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      /* ignore */
    }
  }

  if (!completed && !responseText) {
    throw new Error('Chat stream ended without response');
  }

  messages.push({ role: 'assistant', content: responseText });
  return meta;
}
