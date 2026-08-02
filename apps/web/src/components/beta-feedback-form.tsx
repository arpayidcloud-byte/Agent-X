'use client';

import { useState } from 'react';
import { submitFeedback } from '../lib/api';

const CATEGORIES = ['bug', 'feature', 'performance', 'ux', 'other'];

export default function BetaFeedbackForm() {
  const [category, setCategory] = useState('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setResult('');
    try {
      const res = await submitFeedback({
        category,
        message,
        email: email || undefined,
        rating,
      });
      setStatus('success');
      setResult(`Feedback #${res.total} tersimpan (${res.entry.category})`);
      setMessage('');
    } catch (err) {
      setStatus('error');
      setResult(err instanceof Error ? err.message : 'Gagal kirim feedback');
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
              category === c
                ? 'bg-accent-500 text-slate-950'
                : 'bg-surface-2 text-slate-400 hover:bg-surface-3 hover:text-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <textarea
        required
        minLength={3}
        placeholder="Ceritakan masalah / ide fitur..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
        rows={3}
      />
      <div className="flex items-center gap-3">
        <input
          type="email"
          placeholder="email (opsional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
        />
        <label className="text-sm text-slate-300">
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="ml-2 rounded-lg border border-surface-3 bg-surface-0 px-2 py-1 text-sm text-slate-100 focus:border-accent-500/60 focus:outline-none"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r}★
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-400 disabled:opacity-50"
        >
          {status === 'loading' ? 'Mengirim...' : 'Kirim'}
        </button>
      </div>
      {status === 'success' && <p className="text-sm text-emerald-400">{result}</p>}
      {status === 'error' && <p className="text-sm text-red-400">{result}</p>}
    </form>
  );
}
