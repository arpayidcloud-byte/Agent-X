'use client';

import { useState } from 'react';
import {
  fetchWaitlistAdmin,
  inviteWaitlistEntry,
  clearToken,
  getToken,
  type WaitlistEntry,
} from '../lib/api';

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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Admin — Waitlist Management</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load entries'}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-red-900/60 px-3 py-1 text-sm hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>
      {!tokenPresent && (
        <p className="text-sm text-slate-500">
          Token tidak tersedia di browser — login dulu lewat form di atas.
        </p>
      )}
      {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
      {entries === null ? (
        <p className="text-sm text-slate-500">
          Klik &quot;Load entries&quot; untuk mengambil daftar waitlist (memerlukan role admin).
        </p>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-2">Total: {total} entries</p>
          {entries.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada pendaftar.</p>
          ) : (
            <ul className="space-y-2">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm"
                >
                  <span className="font-mono">{e.email}</span>
                  <span className="text-xs text-slate-400">
                    {e.name ?? '-'} · {e.source ?? 'direct'}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      e.status === 'active'
                        ? 'bg-green-900/60 text-green-300'
                        : e.status === 'invited'
                          ? 'bg-amber-900/60 text-amber-300'
                          : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {e.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(e.createdAt).toLocaleString()}
                  </span>
                  {e.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => void updateStatus(e.id, 'invited')}
                      className="rounded bg-indigo-900/60 px-2 py-0.5 text-xs hover:bg-indigo-800"
                    >
                      Invite
                    </button>
                  )}
                  {e.status === 'invited' && (
                    <button
                      type="button"
                      onClick={() => void updateStatus(e.id, 'active')}
                      className="rounded bg-green-900/60 px-2 py-0.5 text-xs hover:bg-green-800"
                    >
                      Activate
                    </button>
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
