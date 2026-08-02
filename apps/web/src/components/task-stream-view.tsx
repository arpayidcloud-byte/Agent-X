'use client';

import { useState, useRef, useEffect } from 'react';
import { startStreamTask, type TaskStreamEvent } from '@/lib/api';
import { notifyTaskComplete, requestNotifyPermission } from '@/lib/notify';
import { openEventStream, type StreamHandle } from '@/lib/stream';

const STAGE_LABEL: Record<TaskStreamEvent['type'], string> = {
  accepted: '📥 Accepted',
  generating: '⚙️ Generating…',
  complete: '✅ Complete',
};

// Live task execution demo: POST /v1/agentx/run/stream (202) then subscribe
// to the task's event stream (SSE with automatic WebSocket fallback).
export default function TaskStreamView() {
  const [prompt, setPrompt] = useState('');
  const [events, setEvents] = useState<TaskStreamEvent[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef<StreamHandle | null>(null);

  useEffect(() => {
    // Ask for notification permission once, on first interaction with the
    // demo (browser shows the prompt; denied is handled gracefully).
    requestNotifyPermission();
    return () => {
      sourceRef.current?.close();
    };
  }, []);

  async function handleRun(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || status === 'running') return;
    setError(null);
    setEvents([]);
    setStatus('running');
    try {
      const { taskId } = await startStreamTask(prompt.trim());
      const handle = openEventStream(`task:${taskId}`, (raw) => {
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

  const lastComplete = [...events].reverse().find((e) => e.type === 'complete');

  return (
    <div className="rounded-xl border border-violet-500/20 bg-slate-900/40 p-6">
      <h2 className="mb-1 text-lg font-semibold text-violet-400">
        Live Task Stream{' '}
        <span className="text-xs font-normal text-slate-500">(SSE + WS fallback)</span>
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Runs the task asynchronously (202 Accepted) and streams lifecycle events over{' '}
        <code className="rounded bg-slate-800 px-1 py-0.5">Server-Sent Events</code> with automatic{' '}
        <code className="rounded bg-slate-800 px-1 py-0.5">WebSocket</code> fallback.
      </p>
      <form onSubmit={(e) => void handleRun(e)} className="flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Explain how SSE works"'
          rows={2}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'running' || !prompt.trim()}
          className="w-fit rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'running' ? 'Streaming…' : 'Run with stream →'}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/20 bg-rose-950/30 p-3 text-sm text-rose-300">
          ⚠ {error}
        </p>
      )}

      {events.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            {events.map((ev, i) => (
              <span
                key={i}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  ev.type === 'complete'
                    ? ev.status === 'success'
                      ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                      : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
                    : ev.type === 'generating'
                      ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                      : 'border-sky-500/40 bg-sky-950/40 text-sky-300'
                }`}
              >
                {STAGE_LABEL[ev.type]}
                {ev.provider && ev.model ? ` · ${ev.provider}/${ev.model}` : ''}
              </span>
            ))}
          </div>
          {lastComplete?.status === 'success' && lastComplete.response && (
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200">
              {lastComplete.response}
            </pre>
          )}
          {lastComplete?.status === 'error' && (
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-rose-700 bg-rose-950 p-3 text-xs text-rose-200">
              {lastComplete.error}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
