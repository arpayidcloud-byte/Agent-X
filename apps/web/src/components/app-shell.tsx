'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthed } from '@/lib/api';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: '⌂', exact: true },
  { href: '/chat', label: 'Chat', icon: '💬' },
  { href: '/multi-agent', label: 'Multi-Agent', icon: '🤝' },
  { href: '/agents', label: 'Agents', icon: '🤖' },
  { href: '/quality', label: 'Quality', icon: '🏅' },
  { href: '/feedback', label: 'Feedback', icon: '🔁' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/team', label: 'Team', icon: '👥' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

function isActive(item: NavItem, pathname: string): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function NavLinks({
  pathname,
  authed,
  onNavigate,
}: {
  pathname: string;
  authed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="w-5 text-center text-base leading-none">{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className={`h-2 w-2 rounded-full ${authed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          {authed ? (
            <Link href="/settings" className="hover:text-slate-300">
              Signed in · Settings →
            </Link>
          ) : (
            <Link href="/settings" className="hover:text-slate-300">
              Guest · Sign in →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 px-4 py-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-black text-slate-950">
        ◆
      </span>
      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
        AgentX
      </span>
    </Link>
  );
}

// Devin-style app shell: persistent sidebar on desktop, slide-in drawer with
// hamburger on mobile. Every page renders inside <main> — the shell owns the
// background, navigation, and responsive layout.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const authed = isAuthed();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop sidebar (fixed, hidden on mobile) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur lg:block">
        <Brand />
        <div className="px-3 pb-3">
          <NavLinks pathname={pathname} authed={authed} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center gap-3 border-b border-slate-800 bg-slate-950/80 px-3 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:bg-slate-800"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
        </button>
        <Link href="/" className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-cyan-400 to-violet-500 text-[10px] font-black text-slate-950">
            ◆
          </span>
          <span className="text-sm font-bold text-slate-200">AgentX</span>
        </Link>
      </header>

      {/* Mobile drawer + backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-slate-800 bg-slate-900 shadow-2xl">
            <Brand />
            <div className="px-3 pb-3">
              <NavLinks
                pathname={pathname}
                authed={authed}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="pt-12 lg:pl-64 lg:pt-0">
        <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
