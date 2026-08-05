'use client';

import { useState, useRef, useEffect } from 'react';
import { Inbox, Check, Cog, Send, RotateCcw, Sparkles } from 'lucide-react';
import { startStreamTask, type TaskStreamEvent } from '@/lib/api';
import { notifyTaskComplete, requestNotifyPermission } from '@/lib/notify';
import { openEventStream, type StreamHandle } from '@/lib/stream';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const QUICK_PROMPTS = [
  { text: 'Design an API gateway rate limiter', icon: '🏗️' },
  { text: 'Build a user profile service', icon: '⚙️' },
  { text: 'Explain how SSE works with WebSocket fallback', icon: '📡' },
  { text: 'Draft a REST API spec for a todo app', icon: '📋' },
];

const STAGE_ORDER: TaskStreamEvent['type'][] = ['accepted', 'generating', 'complete'];

const STAGE_META: Record<TaskStreamEvent['type'], { label: string; Icon: typeof Inbox }> = {
  accepted: { label: 'Accepted', Icon: Inbox },
  generating: { label: 'Generating', Icon: Cog },
  complete: { label: 'Complete', Icon: Check },
};

// AI command panel: idle state shows hero composer; once a task is submitted
// the view becomes a session card with live stage timeline (SSE with WS fallback).
export default function TaskStreamView() {
  const [prompt, setPrompt] = useState('');
  const [events, setEvents] = useState<TaskStreamEvent[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const sourceRef = useRef<StreamHandle | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    requestNotifyPermission();
    return () => {
      sourceRef.current?.close();
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  async function handleRun(e?: React.FormEvent) {
    e?.preventDefault();
    if (!prompt.trim() || status === 'running') return;
    setError(null);
    setEvents([]);
    setTaskId(null);
    setStatus('running');
    try {
      const { taskId: tid } = await startStreamTask(prompt.trim());
      setTaskId(tid);
      const handle = openEventStream(`task:${tid}`, (raw) => {
        const ev = raw as TaskStreamEvent;
        setEvents((prev) => [...prev, ev]);
        if (ev.type === 'complete') {
          setStatus(ev.status === 'success' ? 'done' : 'error');
          if (ev.status === 'error') setError(ev.error ?? 'unknown error');
          notifyTaskComplete(ev.status === 'success', ev.taskId ?? '');
          handle.close();
          sourceRef.current = null;
        }
      });
      sourceRef.current = handle;
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function reset() {
    sourceRef.current?.close();
    sourceRef.current = null;
    setEvents([]);
    setStatus('idle');
    setError(null);
    setTaskId(null);
    setPrompt('');
  }

  const lastComplete = [...events].reverse().find((e) => e.type === 'complete');
  const generating = events.some((e) => e.type === 'generating');

  // ── Hero composer (idle) ──
  if (status === 'idle') {
    return (
      <div className="glass-card mx-auto max-w-2xl rounded-2xl p-8 sm:p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/10">
            <Sparkles className="h-5 w-5 text-accent-300" strokeWidth={1.8} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
            What would you like AgentX to accomplish?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Describe a task — AgentX runs it through the LLM router and streams progress live.
          </p>
        </div>

        <form onSubmit={(e) => void handleRun(e)} className="mt-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleRun();
                }
              }}
              placeholder="Describe your task…"
              rows={2}
              autoFocus
              className="w-full resize-none rounded-xl border border-white/[0.06] bg-surface-2/60 p-4 pr-14 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/15 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              aria-label="Run task"
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-400 text-white shadow-lg transition-all hover:shadow-accent-500/25 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:shadow-none"
            >
              <Send className="h-4 w-4" strokeWidth={2.2} aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-right text-[11px] text-slate-600">
            Enter to run · Shift+Enter for newline
          </p>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q.text}
              type="button"
              onClick={() => setPrompt(q.text)}
              className="rounded-full border border-white/[0.06] bg-surface-2/40 px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-accent-500/30 hover:bg-accent-500/5 hover:text-accent-300"
            >
              <span className="mr-1.5">{q.icon}</span>
              {q.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Session card (running / done / error) ──
  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-card rounded-2xl p-6">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                status === 'done'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                  : status === 'error'
                    ? 'bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.4)]'
                    : 'animate-pulse bg-accent-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
              }`}
            />
            <div>
              <p className="text-sm font-medium text-slate-200">{prompt}</p>
              {taskId && (
                <p className="mt-1 font-mono text-[11px] text-slate-600">task: {taskId}</p>
              )}
            </div>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            New task
          </Button>
        </div>

        {/* Stage timeline */}
        <div className="mb-5 flex items-center gap-1">
          {STAGE_ORDER.map((stage, i) => {
            const active =
              stage === 'accepted'
                ? events.length > 0
                : stage === 'generating'
                  ? generating
                  : status === 'done' || status === 'error';
            const { label, Icon } = STAGE_META[stage];
            return (
              <div key={stage} className="flex flex-1 items-center gap-1">
                <Badge
                  tone={
                    active
                      ? stage === 'complete'
                        ? status === 'error'
                          ? 'danger'
                          : 'success'
                        : stage === 'generating'
                          ? 'warning'
                          : 'info'
                      : 'neutral'
                  }
                >
                  <Icon className="h-3 w-3" strokeWidth={2} aria-hidden />
                  {label}
                </Badge>
                {i < STAGE_ORDER.length - 1 && <span className="h-px flex-1 bg-white/[0.06]" />}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/25 bg-rose-500/5 p-3">
            <p className="text-xs text-rose-300">⚠ {error}</p>
          </div>
        )}

        {/* Success response */}
        {lastComplete?.status === 'success' && lastComplete.response && (
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-surface-0 p-4 font-mono text-xs leading-relaxed text-slate-300">
            {lastComplete.response}
          </pre>
        )}

        {/* Error response */}
        {lastComplete?.status === 'error' && (
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 font-mono text-xs text-rose-200">
            {lastComplete.error}
          </pre>
        )}

        {/* Running indicator */}
        {status === 'running' && (
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-surface-2/40 p-4">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface-4 border-t-accent-400" />
            <span className="text-xs text-slate-400">
              {generating ? 'Generating response…' : 'Waiting for task to start…'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
