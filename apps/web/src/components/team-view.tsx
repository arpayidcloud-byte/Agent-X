'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, Users, Shield, Mail, Calendar, Crown, UserCheck } from 'lucide-react';
import { fetchTeam, loginAccount, setToken, clearToken, isAuthed, type TeamMember } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SocialAuthButtons from './social-auth-buttons';

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
    void fetchTeam().then((d) => { if (!cancelled) setUsers(d.users); }).catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [authed]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    try { const res = await loginAccount(loginEmail, loginPassword); setToken(res.tokens.accessToken); setAuthed(true); setLoginPassword(''); }
    catch (err) { setError(err instanceof Error ? err.message : String(err)); }
  }
  function handleLogout() { clearToken(); setAuthed(false); setUsers(null); }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1/60 backdrop-blur-xl">
          <div className="border-b border-white/[0.04] bg-gradient-to-r from-surface-1/80 to-transparent px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-secondary-600 shadow-[0_0_16px_rgba(99,102,241,0.25)]">
                <Shield className="h-5 w-5 text-white" strokeWidth={1.7} />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-white">Sign in required</h2>
                <p className="text-xs text-slate-500">Team management is admin-only.</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {error && <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3"><p className="text-xs text-rose-300">⚠ {error}</p></div>}
            <form onSubmit={(e) => void handleLogin(e)} className="space-y-3">
              <Input type="email" required placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <Input type="password" required placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <Button type="submit" className="w-full">Sign in</Button>
            </form>
            <div className="mt-4"><SocialAuthButtons /></div>
            <p className="mt-4 text-center text-xs text-slate-500">New here? <Link href="/signup" className="font-medium text-accent-300 hover:text-accent-200">Create an account</Link></p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !users) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
        <p className="text-sm text-rose-300">⚠ {error}</p>
        {error.includes('403') && <p className="mt-2 text-xs text-slate-400">Your account does not have the admin role. Sign in with an admin account.</p>}
        <Button variant="secondary" size="sm" className="mt-4" onClick={handleLogout}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="section space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.05] bg-surface-1/50 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-secondary-600 shadow-[0_0_16px_rgba(99,102,241,0.2)]">
            <Users className="h-4.5 w-4.5 text-white" strokeWidth={1.7} />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-white">Workspace members</h2>
            <p className="text-[11px] text-slate-500">{users ? `${users.length} registered · ${users.filter((u) => u.roles.includes('admin')).length} admins` : 'Loading…'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/8 px-3 py-1.5 text-[11px] font-medium text-emerald-300 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Admin session
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-3.5 w-3.5" /> Sign out</Button>
        </div>
      </div>
      {loading && !users ? (
        <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      ) : users ? (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-white/[0.05] bg-surface-1/50 backdrop-blur-sm sm:block">
            <table className="data-table">
              <thead>
                <tr className="border-b border-white/[0.04] bg-surface-2/30">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500"><span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email</span></th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Roles</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500"><span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Joined</span></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/[0.03] last:border-0 transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-200">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles.map((r) => (
                          <Badge key={r} tone={r === 'admin' ? 'warning' : 'neutral'} className="text-[11px]">
                            {r === 'admin' ? <Crown className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}{r}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 sm:hidden">
            {users.map((u) => (
              <div key={u.id} className="rounded-2xl border border-white/[0.05] bg-surface-1/50 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-200">{u.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {u.roles.map((r) => <Badge key={r} tone={r === 'admin' ? 'warning' : 'neutral'}>{r}</Badge>)}
                </div>
                <p className="mt-2 font-mono text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
