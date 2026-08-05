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
  Hexagon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { isAuthed } from '@/lib/api';

/* ─── Navigation config ──────────────────────────────────────── */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  group: 'core' | 'insights' | 'admin';
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, exact: true, group: 'core' },
  { href: '/chat', label: 'Chat', icon: MessageSquare, group: 'core' },
  { href: '/multi-agent', label: 'Multi-Agent', icon: Users, group: 'core' },
  { href: '/agents', label: 'Agents', icon: Bot, group: 'core' },
  { href: '/quality', label: 'Quality', icon: Medal, group: 'insights' },
  { href: '/feedback', label: 'Feedback', icon: Repeat, group: 'insights' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, group: 'insights' },
  { href: '/team', label: 'Team', icon: Users2, group: 'admin' },
  { href: '/settings', label: 'Settings', icon: Settings, group: 'admin' },
];

const GROUP_LABELS: Record<string, string> = {
  core: undefined as unknown as string,
  insights: 'Insights',
  admin: 'Administration',
};

function isActive(item: NavItem, pathname: string): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/* ─── Sidebar nav links ──────────────────────────────────────── */

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const seenGroups = new Set<string>();

  return (
    <nav className="flex flex-col gap-1 px-3 py-2">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item, pathname);
        const Icon = item.icon;
        const isFirstInGroup = !seenGroups.has(item.group);
        if (isFirstInGroup) seenGroups.add(item.group);
        const showGroup = isFirstInGroup && GROUP_LABELS[item.group];

        return (
          <div key={item.href}>
            {showGroup && (
              <p className="mt-4 mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                {GROUP_LABELS[item.group]}
              </p>
            )}
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                active
                  ? 'bg-surface-2 text-white'
                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
              }`}
            >
              {/* Active indicator — indigo gradient bar */}
              {active && (
                <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full bg-gradient-to-b from-accent-400 to-secondary-400" />
              )}
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                  active ? 'text-accent-300' : 'text-slate-500 group-hover:text-slate-300'
                }`}
                strokeWidth={1.8}
                aria-hidden
              />
              {item.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Brand ──────────────────────────────────────────────────── */

function Brand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 px-5 py-5 transition-transform active:scale-[0.98]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-secondary-600 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-shadow group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]">
        <Hexagon className="h-4.5 w-4.5" strokeWidth={2} fill="currentColor" />
      </span>
      <div className="flex flex-col">
        <span className="text-[17px] font-bold tracking-tight text-white group-hover:text-accent-300 transition-colors">
          AgentX
        </span>
        <span className="text-[10px] font-medium tracking-wider text-slate-600 uppercase">
          AI Workspace
        </span>
      </div>
    </Link>
  );
}

/* ─── Sidebar footer ─────────────────────────────────────────── */

function SidebarFooter({ authed }: { authed: boolean }) {
  return (
    <div className="mt-auto border-t border-white/[0.04] px-5 py-4">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span
          className={`relative flex h-2 w-2 items-center justify-center ${
            authed ? 'text-emerald-400' : 'text-slate-600'
          }`}
        >
          <span
            className={`absolute h-full w-full animate-ping rounded-full opacity-75 ${
              authed ? 'bg-emerald-400' : 'bg-slate-600'
            }`}
          />
          <span
            className={`relative h-1.5 w-1.5 rounded-full ${
              authed ? 'bg-emerald-400' : 'bg-slate-600'
            }`}
          />
        </span>
        {authed ? (
          <Link href="/settings" className="hover:text-accent-300 transition-colors">
            Connected · System
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/settings" className="hover:text-accent-300 transition-colors">
              Sign in
            </Link>
            <span className="text-slate-700">·</span>
            <Link
              href="/signup"
              className="font-medium text-accent-300 hover:text-white transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main shell ─────────────────────────────────────────────── */

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const authed = isAuthed();

  return (
    <div className="min-h-screen bg-surface-0 text-slate-100">
      {/* ── Desktop sidebar (fixed, hidden on mobile) ── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-white/[0.04] bg-surface-1/80 backdrop-blur-xl lg:flex lg:flex-col">
        <Brand />
        <div className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </div>
        <SidebarFooter authed={authed} />
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-13 items-center gap-3 border-b border-white/[0.04] bg-surface-0/80 px-3 backdrop-blur-xl lg:hidden">
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
            <Hexagon width="10" height="10" strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="text-sm font-semibold text-slate-200">AgentX</span>
        </Link>
      </header>

      {/* ── Mobile drawer + backdrop ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-white/[0.04] bg-surface-1 shadow-2xl animate-slide-in-left">
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
            <div className="flex-1 overflow-y-auto">
              <NavLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <SidebarFooter authed={authed} />
          </aside>
        </div>
      )}

      {/* ── Main content area ── */}
      <main className="pt-13 lg:pl-60 lg:pt-0">
        <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
