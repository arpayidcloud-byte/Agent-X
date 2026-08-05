'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Cable,
  History,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  Settings,
  X,
  ShieldCheck,
  CheckSquare,
  Bot,
  BarChart3,
} from 'lucide-react';
import { isAuthed, clearToken, fetchMe, isAdminUser, type AuthUser } from '@/lib/api';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/providers', label: 'LLM Providers', icon: Cable },
  { href: '/groups', label: 'Combo Providers', icon: Layers },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/audit', label: 'Audit Log', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-secondary-500 text-slate-950 shadow-soft">
        <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2} aria-hidden />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-slate-100">
        AgentX<span className="text-accent-400"> Panel</span>
      </span>
    </Link>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 px-2">
      {NAV_ITEMS.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
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
  );
}

function UserFooter({ user, onLogout }: { user: AuthUser | null; onLogout: () => void }) {
  if (!user) {
    return (
      <div className="mt-auto border-t border-surface-3 px-5 py-4 text-xs text-slate-500">
        Signed out
      </div>
    );
  }
  return (
    <div className="mt-auto border-t border-surface-3 px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-300">{user.email}</p>
          <p className="text-[11px] text-slate-500">
            {isAdminUser(user) ? 'Administrator' : 'No admin access'}
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Sign out"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-surface-2 hover:text-slate-200"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default function PanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);
  const authed = isAuthed();

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    void fetchMe()
      .then((d) => {
        if (!cancelled) setUser(d.user);
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [authed]);

  // Non-admin users are shown a locked screen (UI layer; the API enforces
  // this too with 403 on every /v1/admin/* call).
  const locked = authed && user !== null && !isAdminUser(user) && checked;

  const handleLogout = () => {
    clearToken();
    setUser(null);
    router.replace('/login');
  };

  const navAndFooter = (
    <>
      <NavLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
      <UserFooter user={user} onLogout={handleLogout} />
    </>
  );

  const sidebar = (
    <>
      <Brand />
      {navAndFooter}
    </>
  );

  return (
    <div className="min-h-screen bg-surface-0 text-slate-100">
      {!authed || locked ? (
        <main className="min-h-screen">{children}</main>
      ) : (
        <>
          <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-surface-3 bg-surface-1/70 backdrop-blur lg:flex lg:flex-col">
            {sidebar}
          </aside>

          <header className="fixed inset-x-0 top-0 z-40 flex h-13 items-center gap-3 border-b border-surface-3 bg-surface-0/80 px-3 backdrop-blur lg:hidden">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setDrawerOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-surface-2"
            >
              <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden />
            </button>
            <span className="text-sm font-semibold text-slate-200">
              AgentX<span className="text-accent-400"> Panel</span>
            </span>
          </header>

          {drawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setDrawerOpen(false)}
                aria-hidden
              />
              <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-surface-3 bg-surface-1 shadow-2xl">
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
                {navAndFooter}
              </aside>
            </div>
          )}

          <main className="pt-13 lg:pl-60 lg:pt-0">
            <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </>
      )}
    </div>
  );
}
