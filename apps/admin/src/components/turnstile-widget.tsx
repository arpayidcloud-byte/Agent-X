'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: string;
          appearance?: string;
          execution?: string;
        },
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

/**
 * Cloudflare Turnstile managed widget with robust mobile support:
 * - Shows loading spinner while script loads
 * - Shows error + retry button if script/widget fails
 * - Auto-retries up to 3 times on failure
 * - Provides reset() to refresh token before submission
 */
export default function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retries, setRetries] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    onTokenRef.current = onToken;
  });

  const renderWidget = () => {
    if (!containerRef.current || !window.turnstile) return;
    // Clean up previous widget if any
    if (widgetIdRef.current) {
      try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
    }
    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: 'dark',
        appearance: 'interaction-only',
        callback: (token) => {
          setStatus('ready');
          onTokenRef.current(token);
        },
        'error-callback': () => { setStatus('error'); },
        'expired-callback': () => {
          setStatus('loading');
          try { if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current); } catch { /* ignore */ }
        },
      });
    } catch { setStatus('error'); }
  };

  const loadScript = () => {
    setStatus('loading');
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => { setTimeout(renderWidget, 200); };
    script.onerror = () => { setStatus('error'); };
    document.head.appendChild(script);
  };

  // Expose reset on the container element so the parent can call it before submit.
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    (el as HTMLDivElement & { resetTurnstile?: () => void }).resetTurnstile = () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.reset(widgetIdRef.current); } catch { renderWidget(); }
      }
    };
    return () => {
      delete (el as HTMLDivElement & { resetTurnstile?: () => void }).resetTurnstile;
    };
  }, []);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    let cancelled = false;

    const init = () => {
      if (cancelled) return;
      if (window.turnstile) {
        renderWidget();
      } else {
        loadScript();
      }
    };

    init();

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
    // renderWidget/loadScript are stable (use refs only) — run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    if (retries >= maxRetries) return;
    setRetries((r) => r + 1);
    // Remove old script and reload
    const oldScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (oldScript) oldScript.remove();
    delete window.turnstile;
    widgetIdRef.current = null;
    loadScript();
  };

  if (!SITE_KEY) return null;

  return (
    <div className="space-y-1">
      <div
        ref={containerRef}
        data-testid="turnstile-widget"
        className="min-h-[44px] flex items-center justify-center"
      />
      {status === 'loading' && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          Memuat verifikasi keamanan…
        </div>
      )}
      {status === 'error' && retries < maxRetries && (
        <button
          type="button"
          onClick={handleRetry}
          className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors"
        >
          <RefreshCw className="h-3 w-3" aria-hidden />
          Verifikasi gagal muat — klik untuk coba lagi ({retries}/{maxRetries})
        </button>
      )}
      {status === 'error' && retries >= maxRetries && (
        <p className="text-[10px] text-red-400">
          Verifikasi keamanan tidak bisa dimuat. Coba refresh halaman atau gunakan browser lain.
        </p>
      )}
    </div>
  );
}
