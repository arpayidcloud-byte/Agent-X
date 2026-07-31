'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { runTask } from '@/lib/api';

export default function SubmitForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await runTask(prompt.trim());
      setResult(
        `[${res.provider}/${res.model}] ${res.message} (${res.latencyMs}ms, $${res.cost.toFixed(6)})`,
      );
      setPrompt('');
      router.refresh(); // re-fetch server-rendered task list
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/40 p-6">
      <h2 className="mb-3 text-lg font-semibold text-cyan-400">Run a task</h2>
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Build a REST API with Node.js"'
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-fit rounded-lg bg-cyan-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Running…' : 'Run task →'}
        </button>
      </form>
      {result && (
        <p className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-3 text-sm text-emerald-300">
          {result}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-500/20 bg-red-950/30 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
