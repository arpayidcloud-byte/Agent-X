'use client';

import { useEffect, useState } from 'react';
import { API_URL, getToken, fetchMe } from '@/lib/api';
import { DollarSign, CreditCard, Activity, AlertCircle } from 'lucide-react';

interface BillingData {
  plan: { slug: string; name: string; priceUsd: number; interval: string };
  subscription: {
    status: string;
    currentPeriodEnd: string;
    trialEndsAt: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  usage: { tasksUsed: number; tasksLimit: number; costUsed: number; costLimit: number };
  invoices: Array<{
    id: string;
    amountCents: number;
    currency: string;
    status: string;
    createdAt: string;
  }>;
}

async function authFetch<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export default function BillingView() {
  const [data, setData] = useState<BillingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [_user, setUser] = useState<{ roles: string[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((d) => {
        if (!cancelled) setUser(d.user);
      })
      .catch(() => {});
    authFetch<BillingData>('/v1/billing/summary')
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
        <AlertCircle className="h-5 w-5 shrink-0" /> {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
          Loading billing...
        </div>
      </div>
    );
  }

  const { plan, subscription, usage, invoices } = data;
  const priceDisplay = plan.priceUsd === 0 ? 'Free' : `$${plan.priceUsd / 100}/${plan.interval}`;
  const tasksPct =
    usage.tasksLimit > 0 ? Math.round((usage.tasksUsed / usage.tasksLimit) * 100) : 0;
  const costPct = usage.costLimit > 0 ? Math.round((usage.costUsed / usage.costLimit) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Billing</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your plan, usage, and invoices</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-surface-1 px-4 py-2">
          <CreditCard className="h-4 w-4 text-accent-400" />
          <span className="text-sm font-medium text-white">{plan.name}</span>
          <span className="text-xs text-slate-500">· {priceDisplay}</span>
        </div>
      </div>

      {subscription && (
        <div className="rounded-xl border border-white/[0.06] bg-surface-1 p-5">
          <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Activity className="h-4 w-4" /> Subscription
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Status</span>
              <span
                className={`ml-2 font-medium ${subscription.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}
              >
                {subscription.status}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Period ends</span>
              <span className="ml-2 text-slate-200">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
            {subscription.trialEndsAt && (
              <div>
                <span className="text-slate-500">Trial ends</span>
                <span className="ml-2 text-slate-200">
                  {new Date(subscription.trialEndsAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {subscription.cancelAtPeriodEnd && (
              <div className="col-span-2 rounded bg-yellow-500/10 px-3 py-1.5 text-yellow-400">
                Cancels at period end
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-surface-1 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Tasks used</span>
            <span className="font-medium text-white">
              {usage.tasksUsed} / {usage.tasksLimit === 999999 ? '∞' : usage.tasksLimit}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent-500 transition-all"
              style={{ width: `${Math.min(tasksPct, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">{tasksPct}% of monthly limit</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-surface-1 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Cost this month</span>
            <span className="font-medium text-white">
              ${usage.costUsed.toFixed(4)} / ${usage.costLimit.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(costPct, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">{costPct}% of budget</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-surface-1 p-5">
        <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <DollarSign className="h-4 w-4" /> Invoices
        </h2>
        {invoices.length === 0 ? (
          <p className="mt-3 text-xs text-slate-500">No invoices yet.</p>
        ) : (
          <div className="mt-3 space-y-1">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-lg bg-surface-0 px-3 py-2 text-xs"
              >
                <span className="text-slate-300">
                  ${(inv.amountCents / 100).toFixed(2)} {inv.currency.toUpperCase()}
                </span>
                <span className="text-slate-500">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`font-medium ${inv.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}
                >
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
