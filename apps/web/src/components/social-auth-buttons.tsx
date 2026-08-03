'use client';

import { useState } from 'react';
import { API_URL } from '../lib/api';

function GithubIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.04 11.04 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

// "Continue with Google / GitHub" buttons. The backend redirects the browser
// to the provider; the callback exchanges the code and bounces back to
// /oauth/callback with tokens. If the provider is not configured on the API
// side, we surface a friendly notice instead of a dead link.
export default function SocialAuthButtons() {
  const [notice, setNotice] = useState<string | null>(null);

  const PROVIDER_LABELS: Record<'google' | 'github' | 'apple', { label: string; env: string }> = {
    google: { label: 'Google', env: 'GOOGLE_CLIENT_ID' },
    github: { label: 'GitHub', env: 'GITHUB_CLIENT_ID' },
    apple: { label: 'Apple', env: 'APPLE_CLIENT_ID' },
  };

  async function start(provider: 'google' | 'github' | 'apple') {
    setNotice(null);
    try {
      const res = await fetch(`${API_URL}/v1/auth/oauth/${provider}`, {
        redirect: 'manual',
      });
      if (res.status === 501) {
        const info = PROVIDER_LABELS[provider];
        setNotice(
          `${info.label} sign-in is not configured yet — the admin needs to add ${info.env} env vars.`,
        );
        return;
      }
      // Redirect (302) — follow it manually so the browser lands on the
      // provider's login page.
      const location = res.headers.get('location');
      if (location) {
        window.location.assign(location);
      } else {
        window.location.assign(`${API_URL}/v1/auth/oauth/${provider}`);
      }
    } catch {
      window.location.assign(`${API_URL}/v1/auth/oauth/${provider}`);
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-surface-3" />
        <span className="text-[11px] uppercase tracking-wide text-slate-500">or continue with</span>
        <span className="h-px flex-1 bg-surface-3" />
      </div>

      <button
        type="button"
        onClick={() => void start('google')}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-surface-3 bg-surface-0 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-surface-3 hover:bg-surface-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
          />
        </svg>
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => void start('github')}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-surface-3 bg-surface-0 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-surface-3 hover:bg-surface-2"
      >
        <GithubIcon className="h-4 w-4" />
        Continue with GitHub
      </button>

      <button
        type="button"
        onClick={() => void start('apple')}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-surface-3 bg-surface-0 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-surface-3 hover:bg-surface-2"
      >
        <svg viewBox="0 0 384 512" fill="currentColor" className="h-4 w-4" aria-hidden>
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        Continue with Apple
      </button>

      {notice && (
        <p className="rounded-lg border border-amber-500/25 bg-amber-950/20 px-3 py-2 text-[11px] leading-relaxed text-amber-300">
          {notice}
        </p>
      )}
    </div>
  );
}
