'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus } from 'lucide-react';
import { registerAccount, setToken } from '../lib/api';
import SocialAuthButtons from './social-auth-buttons';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { tokens } = await registerAccount(email, password);
      setToken(tokens.accessToken);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-surface-3 bg-surface-1 p-6 shadow-soft sm:p-8">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-secondary-500 text-slate-950 shadow-soft">
          <UserPlus className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <h1 className="text-lg font-semibold tracking-tight text-slate-100">Create your account</h1>
        <p className="mt-1 text-xs text-slate-500">
          Sign up to run tasks, chat, and manage agents on AgentX.
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
          ⚠ {error}
        </p>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Password</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            placeholder="min 8 characters"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Confirm password</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            placeholder="repeat password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <div className="mt-5">
        <SocialAuthButtons />
      </div>

      <p className="mt-5 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/settings" className="font-medium text-accent-300 hover:text-accent-200">
          Sign in
        </Link>
      </p>
    </div>
  );
}
