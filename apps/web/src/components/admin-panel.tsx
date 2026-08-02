'use client';

import { useState } from 'react';
import { RefreshCw, LogOut, UserPlus, UserCheck } from 'lucide-react';
import {
  fetchWaitlistAdmin,
  inviteWaitlistEntry,
  clearToken,
  getToken,
  type WaitlistEntry,
} from '../lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [entries, setEntries] = useState<WaitlistEntry[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWaitlistAdmin(100);
      setEntries(res.entries);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: 'invited' | 'active') {
    setError(null);
    try {
      await inviteWaitlistEntry(id, status);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function handleLogout() {
    clearToken();
    onLogout();
  }

  const tokenPresent = getToken() !== null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Waitlist Management</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`}
              strokeWidth={2}
              aria-hidden
            />
            {loading ? 'Loading…' : 'Load entries'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Logout
          </Button>
        </div>
      </div>
      {!tokenPresent && (
        <p className="text-sm text-slate-500">
          Token tidak tersedia di browser — login dulu lewat form di atas.
        </p>
      )}
      {error && (
        <p className="mb-2 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
          ⚠ {error}
        </p>
      )}
      {entries === null ? (
        <p className="text-sm text-slate-500">
          Klik &quot;Load entries&quot; untuk mengambil daftar waitlist (memerlukan role admin).
        </p>
      ) : (
        <>
          <p className="mb-2 text-sm text-slate-400">Total: {total} entries</p>
          {entries.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada pendaftar.</p>
          ) : (
            <ul className="space-y-2">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-3 bg-surface-1 p-3 text-sm"
                >
                  <span className="font-mono text-slate-200">{e.email}</span>
                  <span className="text-xs text-slate-400">
                    {e.name ?? '-'} · {e.source ?? 'direct'}
                  </span>
                  <Badge
                    tone={
                      e.status === 'active'
                        ? 'success'
                        : e.status === 'invited'
                          ? 'warning'
                          : 'neutral'
                    }
                  >
                    {e.status}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {new Date(e.createdAt).toLocaleString()}
                  </span>
                  {e.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void updateStatus(e.id, 'invited')}
                    >
                      <UserPlus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Invite
                    </Button>
                  )}
                  {e.status === 'invited' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void updateStatus(e.id, 'active')}
                    >
                      <UserCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Activate
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
