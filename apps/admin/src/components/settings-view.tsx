'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Download,
  KeyRound,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TerminalSquare,
  Upload,
  XCircle,
} from 'lucide-react';
import {
  changeAccountPassword,
  adminExportProviders,
  adminImportProviders,
  adminGetCliToken,
  adminCreateCliToken,
  adminRevokeCliToken,
  type ImportResult,
  type CliTokenView,
} from '@/lib/api';

// ─── Shared card shell ────
function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-surface-3 bg-surface-1 p-6 shadow-soft">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <span className="text-accent-400">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const inputCls =
  'w-full rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-accent-400 focus:outline-none';

// ─── Card 1: change password ────
function ChangePasswordCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setMessage(null);
    if (next.length < 8) {
      setMessage({ ok: false, text: 'Password baru minimal 8 karakter.' });
      return;
    }
    if (next !== confirm) {
      setMessage({ ok: false, text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }
    setBusy(true);
    try {
      await changeAccountPassword(current, next);
      setMessage({ ok: true, text: 'Password berhasil diganti.' });
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : 'Gagal mengganti password.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Ganti Password" icon={<KeyRound className="h-4 w-4" strokeWidth={1.8} />}>
      <form onSubmit={(e) => void submit(e)} className="space-y-3">
        <div>
          <label htmlFor="cur-pw" className="mb-1.5 block text-xs font-medium text-slate-400">
            Password saat ini
          </label>
          <input
            id="cur-pw"
            type="password"
            required
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="new-pw" className="mb-1.5 block text-xs font-medium text-slate-400">
            Password baru
          </label>
          <input
            id="new-pw"
            type="password"
            required
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cf-pw" className="mb-1.5 block text-xs font-medium text-slate-400">
            Konfirmasi password baru
          </label>
          <input
            id="cf-pw"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputCls}
          />
        </div>
        {message && (
          <p
            className={`flex items-center gap-1.5 text-xs ${
              message.ok ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {message.ok ? (
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
            ) : (
              <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            )}
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-400 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-accent-300 disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />}
          Simpan Password
        </button>
      </form>
    </Card>
  );
}

// ─── Card 2: backup & restore ────
function BackupCard() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const doExport = async () => {
    if (exporting) return;
    setExporting(true);
    setMessage(null);
    try {
      const data = await adminExportProviders();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agentx-providers-${data.exportedAt.slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({
        ok: true,
        text: `Export berhasil — ${data.providers.length} provider (API key tidak disertakan).`,
      });
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : 'Export gagal.',
      });
    } finally {
      setExporting(false);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (importing) return;
    setImporting(true);
    setResult(null);
    setMessage(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { providers?: unknown };
      if (!Array.isArray(parsed.providers)) {
        throw new Error('Format file tidak valid — butuh {"providers": [...]}.');
      }
      const res = await adminImportProviders(parsed.providers as never[]);
      setResult(res);
      setMessage({
        ok: res.errors.length === 0,
        text:
          res.errors.length === 0
            ? 'Import selesai tanpa error.'
            : `Import selesai dengan ${res.errors.length} error.`,
      });
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : 'Import gagal.',
      });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Card
      title="Backup & Restore Konfigurasi"
      icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.8} />}
    >
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Export menyimpan konfigurasi provider (nama, type, baseUrl, model) tanpa API key. Pada
        import, provider baru butuh API key diisi ulang; provider yang sudah ada tetap memakai key
        lama kecuali kamu sertakan key baru di file.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void doExport()}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-400 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-accent-300 disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : (
            <Download className="h-4 w-4" strokeWidth={1.8} />
          )}
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          className="inline-flex items-center gap-2 rounded-lg border border-surface-3 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-surface-2 disabled:opacity-50"
        >
          {importing ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : (
            <Upload className="h-4 w-4" strokeWidth={1.8} />
          )}
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => void onFile(e)}
        />
      </div>
      {result && (
        <div className="mt-4 space-y-2 rounded-lg border border-surface-3 bg-surface-0 p-4 text-xs">
          <p className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
            {result.imported} provider baru dibuat, {result.updated} provider diperbarui.
          </p>
          {result.errors.length > 0 && (
            <ul className="space-y-1 text-red-400">
              {result.errors.map((er) => (
                <li key={er.name} className="flex gap-1.5">
                  <XCircle className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={1.8} />
                  <span>
                    <span className="font-medium">{er.name}</span>: {er.error}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => setResult(null)}
            className="mt-1 inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-slate-200"
          >
            <RefreshCw className="h-3 w-3" strokeWidth={1.8} />
            Tutup hasil
          </button>
        </div>
      )}
      {message && !result && (
        <p
          className={`mt-4 flex items-center gap-1.5 text-xs ${
            message.ok ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {message.ok ? (
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
          ) : (
            <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
          )}
          {message.text}
        </p>
      )}
    </Card>
  );
}

// ─── Card 3: CLI sync ────
function CliSyncCard() {
  const [token, setToken] = useState<CliTokenView | null>(null);
  const [loading, setLoading] = useState(true);
  const [freshToken, setFreshToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminGetCliToken()
      .then((d) => {
        if (!cancelled) setToken(d.token);
      })
      .catch(() => {
        if (!cancelled) setMessage({ ok: false, text: 'Gagal memuat status token CLI.' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const generate = async () => {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const d = await adminCreateCliToken();
      setToken(d.view);
      setFreshToken(d.token); // plaintext — shown once
      setCopied(false);
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'Gagal generate token.' });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    if (busy || !token) return;
    setBusy(true);
    setMessage(null);
    try {
      await adminRevokeCliToken();
      setToken(null);
      setFreshToken('');
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'Gagal revoke token.' });
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!freshToken) return;
    try {
      await navigator.clipboard.writeText(freshToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage({ ok: false, text: 'Gagal menyalin — salin manual dari kotak di bawah.' });
    }
  };

  const exampleCmd = (withToken: string) =>
    `agentx config pull --token ${withToken} --api https://api.id-tech.cloud`;

  return (
    <Card title="CLI Sync" icon={<TerminalSquare className="h-4 w-4" strokeWidth={1.8} />}>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Sinkronkan konfigurasi provider ke CLI (
        <code className="text-slate-300">agentx config pull</code>). Token hanya ditampilkan{' '}
        <span className="text-slate-300">sekali</span> saat dibuat dan disimpan sebagai hash di
        server — generate ulang akan menonaktifkan token lama.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Memuat status…
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-lg border border-surface-3 bg-surface-0 p-3 text-xs">
            {token ? (
              <div className="space-y-1.5">
                <p className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Token aktif: <span className="font-medium text-slate-200">{token.name}</span>
                </p>
                <p className="text-slate-500">
                  Dibuat {new Date(token.createdAt).toLocaleString('id-ID')}
                  {token.lastUsedAt
                    ? ` · terakhir dipakai ${new Date(token.lastUsedAt).toLocaleString('id-ID')}`
                    : ' · belum pernah dipakai'}
                </p>
              </div>
            ) : (
              <p className="text-slate-500">Belum ada token CLI aktif.</p>
            )}
          </div>

          {freshToken && (
            <div className="mb-4 rounded-lg border border-secondary-500/30 bg-secondary-500/5 p-3">
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-secondary-300">
                <KeyRound className="h-3 w-3" strokeWidth={1.8} />
                Token baru — salin sekarang, hanya tampil sekali:
              </p>
              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-md bg-surface-0 px-2.5 py-1.5 font-mono text-[11px] text-secondary-200">
                  {freshToken}
                </code>
                <button
                  type="button"
                  onClick={() => void copy()}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-surface-3 px-2 py-1.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-surface-2"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" strokeWidth={2} />
                  ) : (
                    <Copy className="h-3 w-3" strokeWidth={2} />
                  )}
                  {copied ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <pre className="mt-2.5 overflow-x-auto rounded-md bg-surface-0 p-2.5 font-mono text-[11px] leading-relaxed text-slate-300">
                {exampleCmd(freshToken)}
              </pre>
            </div>
          )}

          {message && (
            <p
              className={`mb-3 flex items-center gap-1.5 text-xs ${
                message.ok ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {message.ok ? (
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
              ) : (
                <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
              )}
              {message.text}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void generate()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-400 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-accent-300 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : (
                <KeyRound className="h-4 w-4" strokeWidth={1.8} />
              )}
              {token ? 'Generate Ulang' : 'Generate Token'}
            </button>
            {token && (
              <button
                type="button"
                onClick={() => void revoke()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" strokeWidth={1.8} />
                Revoke
              </button>
            )}
          </div>

          <div className="mt-4 space-y-1 rounded-lg border border-surface-3 bg-surface-0 p-3 text-[11px] text-slate-500">
            <p className="font-medium text-slate-400">Cara pakai di CLI:</p>
            <pre className="overflow-x-auto font-mono leading-relaxed">
              {`agentx config pull --token <token>          # tarik konfigurasi provider\nagentx config set providers.<name>.apiKey <key>  # isi API key lokal\nagentx config get                                # lihat config`}
            </pre>
            <p className="pt-1">
              API key provider tidak dikirim dari server — CLI menyimpan key secara lokal per mesin.
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

export default function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Keamanan akun &amp; backup konfigurasi.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChangePasswordCard />
        <BackupCard />
      </div>
      <CliSyncCard />
    </div>
  );
}
