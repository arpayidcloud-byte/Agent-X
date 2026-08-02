'use client';

import { useEffect, useState } from 'react';
import {
  fetchMe,
  loginAccount,
  setToken,
  clearToken,
  changePassword,
  isAuthed,
  type AuthUser,
} from '@/lib/api';

// Web Pro user settings: profile (id/email/roles) + change password.
// Requires a Bearer token; shows an inline login form when not authed.
export default function SettingsView() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authed, setAuthed] = useState(() => isAuthed());
  const [loading, setLoading] = useState(authed);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  if (!authed) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-slate-700/50 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Sign in to manage settings</h2>
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

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Profile</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : user ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-0.5 text-slate-200">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Roles</dt>
              <dd className="mt-0.5">
                {user.roles.map((r) => (
                  <span
                    key={r}
                    className={`mr-1 rounded px-2 py-0.5 text-xs font-medium ${
                      r === 'admin' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {r}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">User ID</dt>
              <dd className="mt-0.5 font-mono text-xs text-slate-400">{user.id}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-rose-300">⚠ {error ?? 'Failed to load profile'}</p>
        )}
        <button
          onClick={handleLogout}
          className="mt-5 rounded-lg border border-slate-700 px-4 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>

      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Change password</h3>
        {pwMsg && (
          <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-300">
            ✓ {pwMsg}
          </p>
        )}
        {pwErr && (
          <p className="mb-3 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
            ⚠ {pwErr}
          </p>
        )}
        <form onSubmit={(e) => void handleChangePassword(e)} className="space-y-3">
          <input
            type="password"
            required
            placeholder="Current password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="New password (min 8 chars)"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-600 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
