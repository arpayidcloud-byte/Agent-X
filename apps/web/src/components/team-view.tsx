'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, Users } from 'lucide-react';
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
import { Card } from '@/components/ui/card';
import SocialAuthButtons from './social-auth-buttons';

// Team management: admin-only user table with inline login when not authed.
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
      <Card className="mx-auto max-w-md rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-500/10">
            <Users className="h-4 w-4 text-accent-300" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100">Sign in</h2>
            <p className="text-[11px] text-slate-500">Team management lists registered users.</p>
          </div>
        </div>
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
      </Card>
    );
  }

  if (error && !users) {
    return (
      <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-5">
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
    <div className="section space-y-4">
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
        <div className="glass-card overflow-hidden rounded-xl">
          <table className="data-table">
            <thead>
              <tr>
                <th className="font-medium">Email</th>
                <th className="font-medium">Roles</th>
                <th className="font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="text-slate-200">{u.email}</td>
                  <td>
                    {u.roles.map((r) => (
                      <Badge key={r} tone={r === 'admin' ? 'warning' : 'neutral'} className="mr-1">
                        {r}
                      </Badge>
                    ))}
                  </td>
                  <td className="text-xs text-slate-500">
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
