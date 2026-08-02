// Chat streaming (Web Pro): SSE token streaming for chat responses.
//
// Mock providers return full responses (no native token streaming), so chunks
// are produced by the transport layer from the real router response — the
// SSE transport is genuinely streaming, the content is the real response.
import { EventEmitter } from 'node:events';

export interface ChatTokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export type ChatStreamEvent =
  | { type: 'start'; chatId: string; provider: string; model: string; at: string }
  | { type: 'chunk'; chatId: string; text: string; at: string }
  | {
      type: 'complete';
      chatId: string;
      usage: ChatTokenUsage;
      cost: number;
      latencyMs: number;
      at: string;
    }
  | { type: 'error'; chatId: string; error: string; at: string };

const bus = new EventEmitter();
const history = new Map<string, ChatStreamEvent[]>();

export function publishChatEvent(ev: ChatStreamEvent): void {
  const list = history.get(ev.chatId) ?? [];
  list.push(ev);
  history.set(ev.chatId, list);
  bus.emit(ev.chatId, ev);
}

export function getChatEventHistory(chatId: string): ChatStreamEvent[] {
  return history.get(chatId) ?? [];
}

export function subscribeChat(chatId: string, handler: (ev: ChatStreamEvent) => void): () => void {
  bus.on(chatId, handler);
  return () => {
    bus.off(chatId, handler);
  };
}

/** Pacing between chunks so the stream is observable in the UI. */
export const CHAT_CHUNK_DELAY_MS = 30;

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Split text into word-boundary chunks (max ~maxLen chars each). */
export function chunkText(text: string, maxLen = 60): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const word of words) {
    // Words longer than maxLen are force-split so no chunk ever overflows.
    if (word.length > maxLen) {
      if (current) {
        chunks.push(current);
        current = '';
      }
      for (let i = 0; i < word.length; i += maxLen) {
        chunks.push(word.slice(i, i + maxLen));
      }
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxLen && current) {
      chunks.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [''];
}

/** Build the LLM prompt from a conversation transcript (bounded history). */
export function buildChatPrompt(messages: Array<{ role: string; content: string }>): string {
  const recent = messages.slice(-12); // keep context bounded
  return recent.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Validate the messages payload. Returns the normalized messages or null when
 * the payload is missing/malformed (caller responds 400).
 */
export function parseChatMessages(messages: unknown): ChatMessage[] | null {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const parsed: ChatMessage[] = [];
  for (const m of messages) {
    if (
      !m ||
      typeof m !== 'object' ||
      typeof (m as ChatMessage).content !== 'string' ||
      (m as ChatMessage).content.trim().length === 0 ||
      ((m as ChatMessage).role !== 'user' && (m as ChatMessage).role !== 'assistant')
    ) {
      return null;
    }
    parsed.push({ role: (m as ChatMessage).role, content: (m as ChatMessage).content.trim() });
  }
  return parsed;
}
