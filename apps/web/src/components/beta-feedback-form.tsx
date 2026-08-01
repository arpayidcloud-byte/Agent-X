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
      <div className="flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded px-3 py-1 text-xs font-medium ${
              category === c
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
        className="w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
        rows={3}
      />
      <div className="flex items-center gap-3">
        <input
          type="email"
          placeholder="email (opsional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
        />
        <label className="text-sm text-slate-300">
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="ml-2 rounded border border-slate-600 bg-slate-950 px-2 py-1 text-sm"
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
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === 'loading' ? 'Mengirim...' : 'Kirim'}
        </button>
      </div>
      {status === 'success' && <p className="text-sm text-emerald-400">{result}</p>}
      {status === 'error' && <p className="text-sm text-red-400">{result}</p>}
    </form>
  );
}
