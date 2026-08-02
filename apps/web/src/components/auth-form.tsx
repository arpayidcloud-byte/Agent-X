'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { loginAccount, registerAccount, setToken } from '../lib/api';

interface AuthFormProps {
  onAuthed: (email: string, roles: string[]) => void;
}

export default function AuthForm({ onAuthed }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fn = mode === 'login' ? loginAccount : registerAccount;
      const { user, tokens } = await fn(email, password);
      setToken(tokens.accessToken);
      onAuthed(user.email, user.roles);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-surface-3 bg-surface-1 p-5">
      <div className="mb-4 flex gap-2 rounded-lg bg-surface-0 p-1">
        {(['login', 'register'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              mode === m ? 'bg-accent-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {m === 'login' ? 'Login' : 'Register'}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            placeholder="min 8 chars"
          />
        </div>
        {error && (
          <p className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
            ⚠ {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
}
