'use client';

import { usePathname } from 'next/navigation';
import AppShell from './app-shell';

/**
 * Renders the workspace chrome (sidebar shell) for app routes and skips it
 * entirely for the public marketing landing (`/landing`), which owns its own
 * full-page layout. Kept out of the root layout so the landing page never
 * inherits the workspace sidebar/nav.
 */
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/landing')) {
    return <>{children}</>;
  }
  return <AppShell>{children}</AppShell>;
}
