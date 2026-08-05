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

    // Reset Turnstile to get a fresh token right before submission
    const widgetEl = document.querySelector('[data-testid="turnstile-widget"]');
    if (
      widgetEl &&
      typeof (widgetEl as unknown as { resetTurnstile?: () => void }).resetTurnstile === 'function'
    ) {
      (widgetEl as unknown as { resetTurnstile: () => void }).resetTurnstile();
      // Brief wait for the token callback to fire
      await new Promise((r) => setTimeout(r, 500));
    }

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
      const message = err instanceof Error ? err.message : '';
      if (status === 403 && message.toLowerCase().includes('human verification')) {
        setError('Verifikasi manusia gagal — coba lagi.');
      } else if (status === 403) {
        setError('Akun ini tidak memiliki akses admin.');
      } else {
        setError(message || 'Login gagal. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-secondary-600 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
            <ShieldAlert className="h-7 w-7" strokeWidth={1.8} aria-hidden />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AgentX <span className="text-gradient">Panel</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Secure administration configuration</p>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="glass-card space-y-5 rounded-3xl p-8"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
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
              className="glass-input w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
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
                className="glass-input w-full rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder:text-slate-600"
              />
              <Lock
                className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                strokeWidth={2}
                aria-hidden
              />
            </div>
          </div>

          <div className="pt-2">
            <TurnstileWidget onToken={setTurnstileToken} />
          </div>

          {error && (
            <p className="rounded-xl border border-rose-500/20 bg-rose-950/20 px-4 py-3 text-xs text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <LogIn className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            )}
            {loading ? 'Authenticating...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-600">
          Need access? Request at{' '}
          <a
            href="https://app.id-tech.cloud"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent-300 hover:text-white transition-colors"
          >
            app.id-tech.cloud
          </a>
        </p>
      </div>
    </div>
  );
}
