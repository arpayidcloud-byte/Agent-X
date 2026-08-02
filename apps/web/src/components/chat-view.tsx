'use client';

import { useState, useRef, useEffect } from 'react';
import { API_URL, startChatStream, type ChatMessage, type ChatStreamEvent } from '@/lib/api';

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
  const sourceRef = useRef<EventSource | null>(null);
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

      const source = new EventSource(`${API_URL}/v1/agentx/chat/${chatId}/events`);
      sourceRef.current = source;
      let done = false;
      source.onmessage = (msg) => {
        const ev = JSON.parse(msg.data as string) as ChatStreamEvent;
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
          done = true;
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
          source.close();
          sourceRef.current = null;
          setStreaming(false);
        } else if (ev.type === 'error') {
          done = true;
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
          source.close();
          sourceRef.current = null;
          setStreaming(false);
        }
      };
      source.onerror = () => {
        if (done) return;
        source.close();
        sourceRef.current = null;
        setStreaming(false);
        setError('Stream connection lost — the chat may still be running server-side.');
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col rounded-xl border border-slate-700/50 bg-slate-900/40">
      <div className="border-b border-slate-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-cyan-400">
          Chat <span className="text-xs font-normal text-slate-500">(Web Pro · SSE streaming)</span>
        </h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {bubbles.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            Ask anything — responses stream token-by-token over Server-Sent Events.
          </p>
        )}
        {bubbles.map((b, i) => (
          <div key={i} className={`flex ${b.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                b.role === 'user'
                  ? 'bg-cyan-600 text-white'
                  : b.error
                    ? 'border border-rose-500/40 bg-rose-950/40 text-rose-200'
                    : 'border border-slate-700 bg-slate-950 text-slate-100'
              }`}
            >
              {b.role === 'user' ? (
                b.content
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{b.content || (streaming ? '…' : '')}</p>
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
        className="flex gap-3 border-t border-slate-800 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={streaming}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="rounded-lg bg-cyan-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {streaming ? 'Streaming…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
