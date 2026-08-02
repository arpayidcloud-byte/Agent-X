'use client';

import { useEffect, useState } from 'react';
import {
  fetchTeam,
  loginAccount,
  setToken,
  clearToken,
  isAuthed,
  type TeamMember,
} from '@/lib/api';

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
      <div className="mx-auto max-w-md rounded-xl border border-slate-700/50 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Admin sign in</h2>
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
          <input
            type="email"
            required
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-600 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  if (error && !users) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-5">
        <p className="text-sm text-rose-300">⚠ {error}</p>
        {error.includes('403') && (
          <p className="mt-2 text-xs text-slate-400">
            Your account does not have the admin role. Sign in with an admin account.
          </p>
        )}
        <button
          onClick={handleLogout}
          className="mt-4 rounded-lg border border-slate-700 px-4 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {users ? `${users.length} registered user${users.length === 1 ? '' : 's'}` : '…'}
        </p>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>

      {loading && !users ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : users ? (
        <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/50 last:border-0">
                  <td className="px-4 py-3 text-slate-200">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.roles.map((r) => (
                      <span
                        key={r}
                        className={`mr-1 rounded px-2 py-0.5 text-xs font-medium ${
                          r === 'admin'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {r}
                      </span>
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
