'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageSquare,
  Users,
  Bot,
  Medal,
  Repeat,
  BarChart3,
  Users2,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { isAuthed } from '@/lib/api';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, exact: true },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/multi-agent', label: 'Multi-Agent', icon: Users },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/quality', label: 'Quality', icon: Medal },
  { href: '/feedback', label: 'Feedback', icon: Repeat },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/team', label: 'Team', icon: Users2 },
  { href: '/settings', label: 'Settings', icon: Settings },
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
      <nav className="flex flex-col gap-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? 'bg-surface-2 text-white'
                  : 'text-slate-400 hover:bg-surface-2/60 hover:text-slate-200'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${active ? 'text-accent-400' : 'text-slate-500'}`}
                strokeWidth={1.8}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-surface-3 px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${authed ? 'bg-emerald-400' : 'bg-slate-600'}`}
          />
          {authed ? (
            <Link href="/settings" className="hover:text-slate-300">
              Signed in · Settings
            </Link>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                href="/settings"
                className="rounded-md px-1.5 py-0.5 hover:bg-surface-2 hover:text-slate-300"
              >
                Sign in
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                href="/signup"
                className="rounded-md bg-accent-500/15 px-1.5 py-0.5 font-medium text-accent-300 hover:bg-accent-500/25"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-secondary-500 text-slate-950 shadow-soft">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2 4 7v10l8 5 8-5V7l-8-5Zm0 2.2 6 3.75v7.1l-6 3.75-6-3.75v-7.1l6-3.75Z" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-slate-100">AgentX</span>
    </Link>
  );
}

// App shell: persistent sidebar on desktop, slide-in drawer with hamburger
// on mobile. Every page renders inside <main> — the shell owns the background,
// navigation, and responsive layout.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const authed = isAuthed();

  return (
    <div className="min-h-screen bg-surface-0 text-slate-100">
      {/* Desktop sidebar (fixed, hidden on mobile) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-surface-3 bg-surface-1/70 backdrop-blur lg:block">
        <Brand />
        <NavLinks pathname={pathname} authed={authed} />
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-13 items-center gap-3 border-b border-surface-3 bg-surface-0/80 px-3 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-surface-2"
        >
          <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden />
        </button>
        <Link href="/" className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-accent-400 to-secondary-500 text-[10px] font-black text-slate-950">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2 4 7v10l8 5 8-5V7l-8-5Z" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-slate-200">AgentX</span>
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
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-surface-3 bg-surface-1 shadow-2xl">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-surface-2 hover:text-slate-200"
              >
                <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              </button>
            </div>
            <NavLinks pathname={pathname} authed={authed} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="pt-13 lg:pl-60 lg:pt-0">
        <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
