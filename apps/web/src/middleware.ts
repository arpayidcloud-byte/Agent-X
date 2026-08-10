import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Host-based routing for the id-tech.cloud domains.
 *
 * One Next.js app serves two hosts (PLAN-FIX L1/L2, no extra service):
 *   - `id-tech.cloud` / `www.id-tech.cloud` → marketing landing (`/landing`)
 *   - `app.id-tech.cloud` → private workspace (existing routes, untouched)
 *
 * Asset paths (`/_next/*`, favicon) pass through so the landing page can
 * load its static chunks even though the browser URL stays on the apex host.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host')?.replace(/:.*/, '') ?? '';
  const isApex = host === 'id-tech.cloud' || host === 'www.id-tech.cloud';

  if (isApex) {
    const url = req.nextUrl.clone();
    // Never rewrite framework assets or API traffic — always forward as-is.
    if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    // Rewrite the apex root to the marketing landing page. The browser URL
    // stays `https://id-tech.cloud/`; the route is served from /landing.
    if (url.pathname === '/') {
      url.pathname = '/landing';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
