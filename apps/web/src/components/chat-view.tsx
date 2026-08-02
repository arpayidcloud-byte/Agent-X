'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { startChatStream, type ChatMessage, type ChatStreamEvent } from '@/lib/api';
import { openEventStream, type StreamHandle } from '@/lib/stream';

interface Bubble {
  role: 'user' | 'assistant';
  content: string;
  meta?: string;
  error?: boolean;
}

// Web Pro chat: transcript UI + SSE token streaming. The chat starts via
// POST /v1/agentx/chat/stream (202) and chunks arrive over EventSource.
export default function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef<StreamHandle | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const assistantRef = useRef('');

  useEffect(() => {
    return () => {
      sourceRef.current?.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bubbles]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;
    setError(null);

    const userMsg: ChatMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setBubbles((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    try {
      const { chatId } = await startChatStream(nextMessages);
      setBubbles((prev) => [...prev, { role: 'assistant', content: '', meta: '…' }]);
      setStreaming(true);
      assistantRef.current = '';

      const handle = openEventStream(`chat:${chatId}`, (raw) => {
        const ev = raw as ChatStreamEvent;
        if (ev.type === 'start') {
          setBubbles((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === 'assistant') last.meta = `${ev.provider}/${ev.model}`;
            return next;
          });
        } else if (ev.type === 'chunk') {
          assistantRef.current += ev.text + ' ';
          setBubbles((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === 'assistant') last.content = assistantRef.current.trim();
            return next;
          });
        } else if (ev.type === 'complete') {
          const finalContent = assistantRef.current.trim();
          setBubbles((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === 'assistant') {
              last.content = finalContent;
              last.meta = `${last.meta ?? ''} · ${ev.usage.totalTokens} tok · $${ev.cost.toFixed(6)} · ${ev.latencyMs}ms`;
            }
            return next;
          });
          setMessages((prev) => [...prev, { role: 'assistant', content: finalContent }]);
          handle.close();
          sourceRef.current = null;
          setStreaming(false);
        } else if (ev.type === 'error') {
          setBubbles((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === 'assistant') {
              last.content = ev.error;
              last.error = true;
            }
            return next;
          });
          setError(ev.error);
          handle.close();
          sourceRef.current = null;
          setStreaming(false);
        }
      });
      sourceRef.current = handle;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-9rem)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-surface-3 bg-surface-1 shadow-soft">
      <div className="flex items-center gap-2 border-b border-surface-3 px-4 py-3.5 sm:px-6">
        <span className="h-2 w-2 rounded-full bg-accent-400" />
        <h2 className="text-sm font-semibold text-slate-200">Chat</h2>
        <span className="ml-auto text-xs text-slate-500">Streaming responses</span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {bubbles.length === 0 && (
          <p className="pt-16 text-center text-sm text-slate-500">
            Ask anything — responses stream in as they are generated.
          </p>
        )}
        {bubbles.map((b, i) => (
          <div key={i} className={`flex ${b.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[80%] ${
                b.role === 'user'
                  ? 'rounded-br-md bg-accent-500 text-slate-950'
                  : b.error
                    ? 'rounded-bl-md border border-rose-500/30 bg-rose-950/30 text-rose-200'
                    : 'rounded-bl-md border border-surface-3 bg-surface-0 text-slate-100'
              }`}
            >
              {b.role === 'user' ? (
                b.content
              ) : (
                <>
                  <p className="whitespace-pre-wrap">
                    {b.content}
                    {streaming && !b.content && (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:240ms]" />
                      </span>
                    )}
                  </p>
                  {b.meta && b.meta !== '…' && (
                    <p className="mt-2 text-[10px] text-slate-500">{b.meta}</p>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="border-t border-rose-500/20 bg-rose-950/30 px-6 py-2 text-xs text-rose-300">
          ⚠ {error}
        </p>
      )}

      <form
        onSubmit={(e) => void handleSend(e)}
        className="flex gap-2 border-t border-surface-3 p-3 sm:gap-3 sm:p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={streaming}
          className="h-10 flex-1 rounded-lg border border-surface-3 bg-surface-0 px-3.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-accent-500 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {streaming ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
          )}
          <span className="hidden sm:inline">{streaming ? 'Streaming' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
