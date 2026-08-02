'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import {
  fetchTeam,
  loginAccount,
  setToken,
  clearToken,
  isAuthed,
  type TeamMember,
} from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SocialAuthButtons from './social-auth-buttons';

// Web Pro team management (basic): admin-only user table. Shows an inline
// login form when not authed; non-admin users get a 403 message.
export default function TeamView() {
  const [users, setUsers] = useState<TeamMember[] | null>(null);
  const [authed, setAuthed] = useState(() => isAuthed());
  const [loading, setLoading] = useState(authed);
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    void fetchTeam()
      .then((d) => {
        if (!cancelled) setUsers(d.users);
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
      const res = await loginAccount(loginEmail, loginPassword);
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
    setUsers(null);
  }

  if (!authed) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-surface-3 bg-surface-1 p-6 sm:p-8">
        <h2 className="mb-1 text-lg font-semibold text-slate-100">Sign in</h2>
        <p className="mb-4 text-xs text-slate-500">
          Team management lists registered users. Only accounts with the{' '}
          <code className="text-amber-300">admin</code> role can view it.
        </p>
        {error && (
          <p className="mb-3 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
            ⚠ {error}
          </p>
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
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="mt-4">
          <SocialAuthButtons />
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          New here?{' '}
          <Link href="/signup" className="font-medium text-accent-300 hover:text-accent-200">
            Create an account
          </Link>
        </p>
      </div>
    );
  }

  if (error && !users) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-5">
        <p className="text-sm text-rose-300">⚠ {error}</p>
        {error.includes('403') && (
          <p className="mt-2 text-xs text-slate-400">
            Your account does not have the admin role. Sign in with an admin account.
          </p>
        )}
        <Button variant="secondary" size="sm" className="mt-4" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {users ? `${users.length} registered user${users.length === 1 ? '' : 's'}` : '…'}
        </p>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Sign out
        </Button>
      </div>

      {loading && !users ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : users ? (
        <div className="overflow-hidden rounded-xl border border-surface-3 bg-surface-1">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-3 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Roles</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-surface-3/60 last:border-0">
                  <td className="px-4 py-3 text-slate-200">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.roles.map((r) => (
                      <Badge key={r} tone={r === 'admin' ? 'warning' : 'neutral'} className="mr-1">
                        {r}
                      </Badge>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
