'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, MailCheck } from 'lucide-react';
import { forgotPassword } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-surface-3 bg-surface-1 p-5">
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto h-10 w-10 text-emerald-400" aria-hidden />
            <h1 className="mt-3 text-base font-semibold text-slate-100">Check your email</h1>
            <p className="mt-2 text-sm text-slate-400">
              If an account exists for <span className="font-medium text-slate-200">{email}</span>,
              a password reset link (valid 30 minutes) is on its way.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block text-sm font-medium text-accent-300 hover:text-accent-200"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-base font-semibold text-slate-100">Forgot password</h1>
            <p className="mt-1 text-sm text-slate-400">
              Enter your account email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 space-y-3">
              <label className="mb-1 block text-xs text-slate-400">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
                placeholder="you@example.com"
              />
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
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-slate-500">
              Remembered it?{' '}
              <Link href="/" className="font-medium text-accent-300 hover:text-accent-200">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
