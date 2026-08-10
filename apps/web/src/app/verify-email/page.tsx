'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { verifyEmail } from '@/lib/api';

type Status = 'loading' | 'verified' | 'error' | 'no-token';

function VerifyEmailInner() {
  const params = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'no-token');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    verifyEmail(token)
      .then(() => {
        if (!cancelled) setStatus('verified');
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : String(err));
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="w-full max-w-md rounded-xl border border-surface-3 bg-surface-1 p-5">
      {status === 'loading' && (
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-400" aria-hidden />
          <p className="mt-3 text-sm text-slate-400">Memverifikasi email…</p>
        </div>
      )}

      {status === 'no-token' && (
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-400" aria-hidden />
          <h1 className="mt-3 text-base font-semibold text-slate-100">Token tidak ditemukan</h1>
          <p className="mt-2 text-sm text-slate-400">
            Tautan verifikasi tidak valid. Silakan periksa email Anda dan klik tautan yang benar.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-400"
          >
            Kembali ke login
          </Link>
        </div>
      )}

      {status === 'verified' && (
        <div className="text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-emerald-400" aria-hidden />
          <h1 className="mt-3 text-base font-semibold text-slate-100">
            Email berhasil diverifikasi
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Akun Anda sudah aktif. Silakan masuk untuk melanjutkan.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-400"
          >
            Masuk
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-400" aria-hidden />
          <h1 className="mt-3 text-base font-semibold text-slate-100">Verifikasi gagal</h1>
          <p className="mt-2 text-sm text-slate-400">
            {errorMessage ||
              'Terjadi kesalahan saat memverifikasi email. Silakan coba lagi atau minta tautan baru.'}
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-400"
          >
            Kembali ke login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-sm text-slate-500">Memuat…</p>
          </div>
        }
      >
        <VerifyEmailInner />
      </Suspense>
    </main>
  );
}
