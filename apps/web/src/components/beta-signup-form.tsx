'use client';

import { useState } from 'react';
import { signupWaitlist } from '../lib/api';

export default function BetaSignupForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await signupWaitlist({ email, name: name || undefined, source: 'beta-page' });
      setStatus('success');
      setMessage(`Terdaftar! #${res.total} di waitlist — cek email ${res.entry.email}`);
      setEmail('');
      setName('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Gagal mendaftar');
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
      <input
        type="email"
        required
        placeholder="email@contoh.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="Nama (opsional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {status === 'loading' ? 'Mendaftar...' : 'Daftar Sekarang'}
      </button>
      {status === 'success' && <p className="text-sm text-emerald-400">{message}</p>}
      {status === 'error' && <p className="text-sm text-red-400">{message}</p>}
    </form>
  );
}
