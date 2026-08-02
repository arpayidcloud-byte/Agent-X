'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { setToken } from '@/lib/api';

// OAuth callback landing page: the API redirects here with accessToken +
// refreshToken in the query string after a successful Google/GitHub sign-in.
// We stash them in localStorage (same as email/password auth) and go home.
function OAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    if (accessToken) {
      setToken(accessToken);
      if (refreshToken) {
        window.localStorage.setItem('agentx_refresh_token', refreshToken);
      }
      router.replace('/');
    } else {
      router.replace('/settings?oauth=error');
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-slate-500">Completing sign-in…</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-slate-500">Completing sign-in…</p>
        </div>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
}
