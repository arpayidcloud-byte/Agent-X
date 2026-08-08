'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, KeyRound, User, Shield } from 'lucide-react';
import {
  fetchMe,
  loginAccount,
  setToken,
  clearToken,
  changePassword,
  setPassword,
  isAuthed,
  type AuthUser,
} from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import SocialAuthButtons from './social-auth-buttons';
import TurnstileWidget from './turnstile-widget';

// User settings: profile + change password with inline login when not authed.
export default function SettingsView() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authed, setAuthed] = useState(() => isAuthed());
  const [loading, setLoading] = useState(authed);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Change-password form state
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    void fetchMe()
      .then((d) => {
        if (!cancelled) setUser(d.user);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authed]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginAccount(loginEmail, loginPassword, turnstileToken ?? undefined);
      setToken(res.tokens.accessToken);
      setAuthed(true);
      setLoginPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function handleLogout() {
    clearToken();
    setAuthed(false);
    setUser(null);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwErr(null);
    setPwMsg(null);
    if (next !== confirm) {
      setPwErr('New password and confirmation do not match');
      return;
    }
    try {
      await changePassword(current, next);
      setPwMsg('Password updated. Use it on your next login.');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : String(err));
    }
  }

  /** OAuth-only accounts (no password yet): set the first one. */
  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setPwErr(null);
    setPwMsg(null);
    if (next !== confirm) {
      setPwErr('New password and confirmation do not match');
      return;
    }
    try {
      await setPassword(next);
      setPwMsg('Password set. You can now also log in with email and password.');
      setNext('');
      setConfirm('');
      setUser((u) => (u ? { ...u, hasPassword: true } : u));
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : String(err));
    }
  }

  if (!authed) {
    return (
      <Card className="mx-auto max-w-md rounded-2xl p-6 sm:p-8">
        <h2 className="mb-4 text-base font-semibold text-slate-100">Sign in to manage settings</h2>
        {error && (
          <div className="mb-3 rounded-xl border border-rose-500/25 bg-rose-500/5 p-3">
            <p className="text-xs text-rose-300">⚠ {error}</p>
          </div>
        )}
        <form onSubmit={(e) => void handleLogin(e)} className="space-y-3">
          <Input
            type="email"
            required
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <Input
            type="password"
            required
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <TurnstileWidget onVerify={setTurnstileToken} />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-3 text-center text-xs">
          <Link
            href="/forgot-password"
            className="font-medium text-accent-300 hover:text-accent-200"
          >
            Forgot password?
          </Link>
        </p>
        <div className="mt-4">
          <SocialAuthButtons />
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          New here?{' '}
          <Link href="/signup" className="font-medium text-accent-300 hover:text-accent-200">
            Create an account
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <div className="section grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-accent-400" aria-hidden /> Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : user ? (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </dt>
                <dd className="mt-1 text-slate-200">{user.email}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Roles
                </dt>
                <dd className="mt-1">
                  {user.roles.map((r) => (
                    <Badge key={r} tone={r === 'admin' ? 'warning' : 'neutral'} className="mr-1">
                      {r}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  User ID
                </dt>
                <dd className="mt-1 font-mono text-xs text-slate-400">{user.id}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-rose-300">⚠ {error ?? 'Failed to load profile'}</p>
          )}
          <Button variant="ghost" size="sm" className="mt-4" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Sign out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-accent-400" aria-hidden />
            {user?.hasPassword === false ? 'Set password' : 'Change password'}
          </CardTitle>
          <CardDescription>
            {user?.hasPassword === false
              ? 'Your account was created with Google/GitHub — set a password to also log in with email.'
              : 'Update your account password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pwMsg && (
            <div className="mb-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3">
              <p className="text-xs text-emerald-300">✓ {pwMsg}</p>
            </div>
          )}
          {pwErr && (
            <div className="mb-3 rounded-xl border border-rose-500/25 bg-rose-500/5 p-3">
              <p className="text-xs text-rose-300">⚠ {pwErr}</p>
            </div>
          )}
          {user?.hasPassword === false ? (
            <form onSubmit={(e) => void handleSetPassword(e)} className="space-y-3">
              <Input
                type="password"
                required
                minLength={8}
                placeholder="New password (min 8 chars)"
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
              <Input
                type="password"
                required
                minLength={8}
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <Button type="submit" className="w-full">
                <Shield className="h-4 w-4" strokeWidth={2} aria-hidden />
                Set password
              </Button>
            </form>
          ) : (
            <form onSubmit={(e) => void handleChangePassword(e)} className="space-y-3">
              <Input
                type="password"
                required
                placeholder="Current password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
              <Input
                type="password"
                required
                placeholder="New password (min 8 chars)"
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
              <Input
                type="password"
                required
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <Button type="submit" className="w-full">
                <Shield className="h-4 w-4" strokeWidth={2} aria-hidden />
                Update password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
