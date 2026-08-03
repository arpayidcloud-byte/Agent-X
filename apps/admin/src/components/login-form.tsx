'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, LogIn, ShieldAlert } from 'lucide-react';
import TurnstileWidget from '@/components/turnstile-widget';
import { loginAccount, setToken, isAdminUser } from '@/lib/api';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await loginAccount(email, password, turnstileToken || undefined);
      if (!isAdminUser(res.user)) {
        setError('Akun ini tidak memiliki akses admin. Hubungi administrator.');
        return;
      }
      setToken(res.tokens.accessToken);
      router.replace('/providers');
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 403) {
        setError('Akun ini tidak memiliki akses admin.');
      } else {
        setError(err instanceof Error ? err.message : 'Login gagal. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-secondary-500 text-slate-950 shadow-glow">
            <ShieldAlert className="h-6 w-6" strokeWidth={1.8} aria-hidden />
          </span>
          <h1 className="text-xl font-semibold text-slate-100">AgentX Panel</h1>
          <p className="mt-1 text-sm text-slate-500">
            Konfigurasi LLM provider untuk app &amp; CLI
          </p>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="space-y-4 rounded-xl border border-surface-3 bg-surface-1 p-6 shadow-soft"
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-accent-500/60"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-400">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 pl-9 text-sm text-slate-200 placeholder:text-slate-600 focus:border-accent-500/60"
              />
              <Lock
                className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                strokeWidth={1.8}
                aria-hidden
              />
            </div>
          </div>

          <TurnstileWidget onToken={setTurnstileToken} />

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <LogIn className="h-4 w-4" strokeWidth={2} aria-hidden />
            )}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-600">
          Belum punya akun? Daftar di{' '}
          <a
            href="https://app.id-tech.cloud/signup"
            target="_blank"
            rel="noreferrer"
            className="text-accent-400 hover:text-accent-300"
          >
            app.id-tech.cloud
          </a>
        </p>
      </div>
    </div>
  );
}
