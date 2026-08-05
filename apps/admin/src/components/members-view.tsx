'use client';

import { useEffect, useState } from 'react';
import { Users, Plus, Trash2, Shield, User, Loader2, RefreshCw, X } from 'lucide-react';
import {
  adminListUsers,
  adminCreateUser,
  adminDeleteUser,
  adminUpdateUserRoles,
  type TeamMember,
} from '@/lib/api';

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-accent-500/10 text-accent-300 border-accent-500/25',
  user: 'bg-surface-3/60 text-slate-400 border-white/[0.06]',
};

export default function MembersView() {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete confirmation
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await adminListUsers();
        if (!cancelled) setUsers(res.users);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setError(null);
    void (async () => {
      try {
        const res = await adminListUsers();
        setUsers(res.users);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setRefreshing(false);
      }
    })();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      await adminCreateUser({
        email: newEmail,
        password: newPassword,
        roles: [newRole],
      });
      setNewEmail('');
      setNewPassword('');
      setNewRole('user');
      setShowCreate(false);
      const res = await adminListUsers();
      setUsers(res.users);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await adminDeleteUser(id);
      const res = await adminListUsers();
      setUsers(res.users);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleRole(id: string, currentRoles: string[]) {
    const newRoles = currentRoles.includes('admin')
      ? currentRoles.filter((r) => r !== 'admin')
      : [...currentRoles, 'admin'];
    try {
      await adminUpdateUserRoles(id, newRoles);
      const res = await adminListUsers();
      setUsers(res.users);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="section space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Members</h1>
          <p className="mt-1 text-sm text-slate-500">
            {users.length} registered account{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-surface-3/80 px-3 text-xs font-medium text-slate-300 transition-all hover:bg-surface-4 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(!showCreate)}
            className="flex h-9 items-center gap-2 rounded-xl bg-accent-500 px-3 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)] transition-all hover:bg-accent-600 hover:shadow-[0_4px_16px_rgba(79,70,229,0.4)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
          <p className="text-sm text-rose-300">⚠ {error}</p>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleCreate(e);
          }}
          className="glass-card rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Invite New Member</h3>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {createError && (
            <p className="rounded-lg border border-rose-500/25 bg-rose-500/5 px-3 py-2 text-xs text-rose-300">
              {createError}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400">Email</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/15 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="min 8 characters"
                className="w-full rounded-xl border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/15 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full rounded-xl border border-white/[0.06] bg-surface-2/60 px-3 py-2 text-sm text-slate-200 focus:border-accent-500/40 focus:outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl border border-white/[0.06] bg-surface-3/80 px-4 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-surface-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-accent-600 disabled:opacity-50"
            >
              {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Create Account
            </button>
          </div>
        </form>
      )}

      {/* User list */}
      {users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.06] bg-surface-1/30 p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-slate-600" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-slate-500">No members yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {users.map((user) => {
            const isAdmin = user.roles.includes('admin');
            return (
              <div
                key={user.id}
                className="glass-card flex items-center gap-4 rounded-xl px-4 py-3.5"
              >
                {/* Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isAdmin ? 'bg-accent-500/10 text-accent-300' : 'bg-surface-3/60 text-slate-400'}`}
                >
                  {isAdmin ? (
                    <Shield className="h-5 w-5" strokeWidth={1.8} />
                  ) : (
                    <User className="h-5 w-5" strokeWidth={1.8} />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">{user.email}</p>
                  <p className="mt-0.5 text-[11px] font-mono text-slate-600">
                    id: {user.id} · joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Roles */}
                <div className="flex items-center gap-1.5">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${ROLE_STYLES[role] ?? ROLE_STYLES.user}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleToggleRole(user.id, user.roles)}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.06] bg-surface-3/80 px-2.5 text-[11px] font-medium text-slate-300 transition-all hover:bg-surface-4 hover:text-white"
                    title={isAdmin ? 'Remove admin role' : 'Make admin'}
                  >
                    <Shield className="h-3 w-3" />
                    {isAdmin ? 'Demote' : 'Promote'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(user.id)}
                    disabled={deleting === user.id}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 text-[11px] font-medium text-rose-300 transition-all hover:bg-rose-500/10 disabled:opacity-50"
                    title="Delete account"
                  >
                    {deleting === user.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
