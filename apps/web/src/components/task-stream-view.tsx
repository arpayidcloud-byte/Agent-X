'use client';

import { useState, useRef, useEffect } from 'react';
import { Inbox, Check, Cog, Send, RotateCcw, Sparkles, Zap, Clock } from 'lucide-react';
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

export default function TaskStreamView() {
  const [prompt, setPrompt] = useState('');
  const [events, setEvents] = useState<TaskStreamEvent[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const sourceRef = useRef<StreamHandle | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => { requestNotifyPermission(); return () => { sourceRef.current?.close(); }; }, []);
  useEffect(() => { const el = textareaRef.current; if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 200)}px`; } }, [prompt]);

  async function handleRun(e?: React.FormEvent) {
    e?.preventDefault();
    if (!prompt.trim() || status === 'running') return;
    setError(null); setEvents([]); setTaskId(null); setStatus('running');
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
          handle.close(); sourceRef.current = null;
        }
      });
      sourceRef.current = handle;
    } catch (err) { setStatus('error'); setError(err instanceof Error ? err.message : String(err)); }
  }

  function reset() {
    sourceRef.current?.close(); sourceRef.current = null;
    setEvents([]); setStatus('idle'); setError(null); setTaskId(null); setPrompt('');
  }

  const lastComplete = [...events].reverse().find((e) => e.type === 'complete');
  const generating = events.some((e) => e.type === 'generating');

  if (status === 'idle') {
    return (
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-surface-1/80 via-surface-1/60 to-surface-0/60 p-7 backdrop-blur-xl sm:p-9">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-500/10 via-secondary-500/8 to-accent-500/10 blur-3xl" />
        <div className="relative text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-secondary-600 shadow-[0_0_24px_rgba(99,102,241,0.35)]">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl">What would you like AgentX to accomplish?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">Describe a task — AgentX routes it through the LLM mesh and streams progress live.</p>
        </div>
        <form onSubmit={(e) => void handleRun(e)} className="relative mt-7">
          <div className="relative rounded-2xl border border-white/[0.08] bg-surface-2/60 p-2 shadow-inner backdrop-blur-md transition-all focus-within:border-accent-500/25 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleRun(); } }}
              placeholder="Describe your task…"
              rows={2}
              autoFocus
              className="w-full resize-none bg-transparent p-3 pr-12 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              aria-label="Run task"
              className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-400 text-white shadow-[0_4px_16px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(79,70,229,0.5)] active:translate-y-0 disabled:opacity-30 disabled:shadow-none disabled:hover:translate-y-0"
            >
              <Send className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] tracking-wide text-slate-600">Enter to run · Shift+Enter for newline</p>
        </form>
        <div className="relative mt-6 flex flex-wrap justify-center gap-2">
          {QUICK_PROMPTS.map((q) => (
            <button key={q.text} type="button" onClick={() => setPrompt(q.text)} className="rounded-full border border-white/[0.06] bg-surface-2/40 px-3.5 py-1.5 text-xs text-slate-400 backdrop-blur-sm transition-all hover:border-accent-500/20 hover:bg-accent-500/5 hover:text-accent-200">
              <span className="mr-1.5">{q.icon}</span>{q.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1/60 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.04] bg-gradient-to-r from-surface-1/80 to-transparent px-5 py-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${status === 'done' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : status === 'error' ? 'bg-rose-400 shadow-[0_0_10px_rgba(248,113,113,0.4)]' : 'animate-pulse bg-accent-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`} />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-100">{prompt}</p>
              {taskId && <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-slate-600"><Zap className="h-3 w-3" /> task {taskId.slice(0, 12)}</p>}
            </div>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={reset} className="shrink-0"><RotateCcw className="h-3.5 w-3.5" /> New task</Button>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.04] bg-surface-2/30 p-2">
            {STAGE_ORDER.map((stage, i) => {
              const active = stage === 'accepted' ? events.length > 0 : stage === 'generating' ? generating : status === 'done' || status === 'error';
              const { label, Icon } = STAGE_META[stage];
              return (
                <div key={stage} className="flex flex-1 items-center gap-1">
                  <Badge tone={active ? (stage === 'complete' ? (status === 'error' ? 'danger' : 'success') : stage === 'generating' ? 'warning' : 'info') : 'neutral'} className="flex-1 justify-center">
                    <Icon className="h-3 w-3" /> {label}
                  </Badge>
                  {i < STAGE_ORDER.length - 1 && <span className="hidden h-px flex-1 bg-white/[0.06] sm:block" />}
                </div>
              );
            })}
          </div>
          {error && <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3"><p className="text-xs text-rose-300">⚠ {error}</p></div>}
          {lastComplete?.status === 'success' && lastComplete.response && (
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-surface-0/80 p-4 font-mono text-xs leading-relaxed text-slate-300">{lastComplete.response}</pre>
          )}
          {lastComplete?.status === 'error' && (
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 font-mono text-xs text-rose-200">{lastComplete.error}</pre>
          )}
          {status === 'running' && (
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-surface-2/40 px-4 py-3.5">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface-4 border-t-accent-400" />
              <span className="flex items-center gap-1.5 text-xs text-slate-400"><Clock className="h-3 w-3" />{generating ? 'Generating response…' : 'Waiting for task to start…'}</span>
              <span className="ml-auto hidden text-[11px] text-slate-600 sm:inline">Streaming via SSE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
