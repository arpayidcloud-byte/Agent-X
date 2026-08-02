'use client';

import { useState, useRef, useEffect } from 'react';
import { startStreamTask, type TaskStreamEvent } from '@/lib/api';
import { notifyTaskComplete, requestNotifyPermission } from '@/lib/notify';
import { openEventStream, type StreamHandle } from '@/lib/stream';

const QUICK_PROMPTS = [
  'Design an API gateway rate limiter',
  'Build a user profile service',
  'Explain how SSE works with WebSocket fallback',
  'Draft a REST API spec for a todo app',
];

const STAGE_ORDER: TaskStreamEvent['type'][] = ['accepted', 'generating', 'complete'];

// Devin-style task composer + live session. Idle state shows a large hero
// composer with quick prompts; once a task is submitted the view becomes a
// session card with a live stage timeline (SSE with WS fallback).
export default function TaskStreamView() {
  const [prompt, setPrompt] = useState('');
  const [events, setEvents] = useState<TaskStreamEvent[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const sourceRef = useRef<StreamHandle | null>(null);

  useEffect(() => {
    requestNotifyPermission();
    return () => {
      sourceRef.current?.close();
    };
  }, []);

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
  const reached: Record<string, boolean> = {};
  for (const ev of events) reached[ev.type] = true;

  // ── Hero composer (idle) ──
  if (status === 'idle') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
        <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent lg:text-4xl">
          What can I help you build?
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Describe a task — AgentX runs it through the LLM router and streams progress live.
        </p>
        <form onSubmit={(e) => void handleRun(e)} className="mt-8 w-full">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleRun();
                }
              }}
              placeholder="e.g. Explain how SSE works with WebSocket fallback…"
              rows={3}
              autoFocus
              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900/60 p-4 pr-16 text-base text-slate-100 shadow-lg shadow-black/20 placeholder:text-slate-600 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              aria-label="Run task"
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.4 20.4 20.85 12 3.4 3.6 3.39 10.5 15 12 3.39 13.5z" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-right text-[11px] text-slate-600">
            Enter to run · Shift+Enter for newline
          </p>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setPrompt(q)}
              className="rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Session card (running / done / error) ──
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg shadow-black/20">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                status === 'done'
                  ? 'bg-emerald-400'
                  : status === 'error'
                    ? 'bg-rose-400'
                    : 'animate-pulse bg-cyan-400'
              }`}
            />
            <div>
              <p className="text-sm font-medium text-slate-200">{prompt}</p>
              {taskId && (
                <p className="mt-1 font-mono text-[11px] text-slate-600">task: {taskId}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
          >
            New task
          </button>
        </div>

        {/* Stage timeline */}
        <div className="mb-4 flex items-center gap-1">
          {STAGE_ORDER.map((stage, i) => {
            const active =
              stage === 'accepted'
                ? events.length > 0
                : stage === 'generating'
                  ? generating
                  : status === 'done' || status === 'error';
            return (
              <div key={stage} className="flex flex-1 items-center gap-1">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                    active
                      ? stage === 'complete'
                        ? status === 'error'
                          ? 'bg-rose-500/15 text-rose-300'
                          : 'bg-emerald-500/15 text-emerald-300'
                        : stage === 'generating'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-sky-500/15 text-sky-300'
                      : 'bg-slate-800/60 text-slate-600'
                  }`}
                >
                  {STAGE_LABEL[stage]}
                </span>
                {i < STAGE_ORDER.length - 1 && <span className="h-px flex-1 bg-slate-800" />}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="mb-3 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
            ⚠ {error}
          </p>
        )}

        {lastComplete?.status === 'success' && lastComplete.response && (
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-300">
            {lastComplete.response}
          </pre>
        )}
        {lastComplete?.status === 'error' && (
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-rose-800 bg-rose-950 p-4 text-xs text-rose-200">
            {lastComplete.error}
          </pre>
        )}
        {status === 'running' && (
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-500">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
            {generating ? 'Generating response…' : 'Waiting for task to start…'}
          </div>
        )}
      </div>
    </div>
  );
}

const STAGE_LABEL: Record<TaskStreamEvent['type'], string> = {
  accepted: '📥 Accepted',
  generating: '⚙️ Generating…',
  complete: '✅ Complete',
};
