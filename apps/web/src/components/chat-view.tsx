'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Info } from 'lucide-react';
import { startChatStream, type ChatMessage, type ChatStreamEvent } from '@/lib/api';
import { openEventStream, type StreamHandle } from '@/lib/stream';
import { MarkdownRenderer } from './markdown-renderer';

interface Bubble {
  role: 'user' | 'assistant';
  content: string;
  meta?: string;
  error?: boolean;
}

// Chat workspace: transcript UI + SSE token streaming.
export default function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef<StreamHandle | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const assistantRef = useRef('');

  useEffect(() => {
    return () => {
      sourceRef.current?.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bubbles]);

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [input]);

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
    <div className="mx-auto flex h-[calc(100dvh-9rem)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.04] bg-surface-1/60 shadow-soft">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500/10">
          <Bot className="h-3.5 w-3.5 text-accent-300" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Chat</h2>
          <p className="text-[11px] text-slate-500">Streaming responses</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="h-3 w-3" strokeWidth={2} />
          <span className="hidden sm:inline">Multi-turn with streaming</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {bubbles.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2/80">
              <Bot className="h-5 w-5 text-slate-500" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Ask anything — responses stream in as they are generated.
            </p>
          </div>
        )}
        {bubbles.map((b, i) => (
          <div
            key={i}
            className={`flex gap-3 ${b.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {b.role === 'assistant' && (
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-500/10">
                <Bot className="h-3.5 w-3.5 text-accent-300" strokeWidth={2} />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] ${
                b.role === 'user'
                  ? 'rounded-br-md bg-accent-500 text-white shadow-[0_2px_8px_rgba(79,70,229,0.25)]'
                  : b.error
                    ? 'rounded-bl-md border border-rose-500/25 bg-rose-500/5 text-rose-200'
                    : 'rounded-bl-md border border-white/[0.04] bg-surface-2/60 text-slate-100'
              }`}
            >
              {b.role === 'user' ? (
                <p className="whitespace-pre-wrap">{b.content}</p>
              ) : b.error ? (
                <p className="whitespace-pre-wrap">{b.content}</p>
              ) : (
                <>
                  {b.content ? (
                    <MarkdownRenderer content={b.content} />
                  ) : (
                    streaming && (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-400 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-400 [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-400 [animation-delay:240ms]" />
                      </span>
                    )
                  )}
                  {b.meta && b.meta !== '…' && (
                    <p className="mt-2 text-[10px] text-slate-500">{b.meta}</p>
                  )}
                </>
              )}
            </div>
            {b.role === 'user' && (
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-3/80">
                <User className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Error bar */}
      {error && (
        <div className="border-t border-rose-500/20 bg-rose-500/5 px-5 py-2.5">
          <p className="text-xs text-rose-300">⚠ {error}</p>
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => void handleSend(e)}
        className="flex gap-2 border-t border-white/[0.04] p-3 sm:gap-3 sm:p-4"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSend(e);
            }
          }}
          placeholder="Type a message…"
          rows={1}
          disabled={streaming}
          className="min-h-[40px] flex-1 resize-none rounded-xl border border-white/[0.06] bg-surface-2/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/15 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-400 text-white transition-all shadow-lg hover:shadow-accent-500/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {streaming ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
          )}
        </button>
      </form>
    </div>
  );
}
