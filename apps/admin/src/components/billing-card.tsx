'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, ExternalLink, Loader2, XCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface BillingPlan {
  slug: string;
  name: string;
  priceUsd: number;
  interval: string;
  maxTasksPerMonth: number;
  maxMembers: number;
}

interface BillingSubscription {
  status: string;
  gateway: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan?: BillingPlan | null;
}

interface BillingMe {
  orgId: string | null;
  subscription: BillingSubscription | null;
  entitlement: { tasksUsed: number; periodStart: string; periodEnd: string } | null;
  trialEndsAt: string | null;
  daysLeft: number | null;
  canConsume: boolean;
}

function fmtPrice(cents: number): string {
  return cents === 0 ? 'Gratis' : '$' + (cents / 100).toFixed(0);
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-surface-3 bg-surface-1 p-6 shadow-soft">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <span className="text-accent-400">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function BillingCard() {
  const [me, setMe] = useState<BillingMe | null>(null);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (t) headers.Authorization = 'Bearer ' + t;
      const [meRes, plansRes] = await Promise.all([
        fetch(API_URL + '/v1/billing/me', { headers, cache: 'no-store' }),
        fetch(API_URL + '/v1/billing/plans', { cache: 'no-store' }),
      ]);
      if (meRes.ok) setMe((await meRes.json()) as BillingMe);
      if (plansRes.ok) {
        const d = (await plansRes.json()) as { plans?: BillingPlan[] };
        setPlans(d.plans ?? []);
      }
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : 'Gagal memuat billing.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const checkout = async (slug: string) => {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const r = await fetch(API_URL + '/v1/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(t ? { Authorization: 'Bearer ' + t } : {}),
        },
        body: JSON.stringify({ planSlug: slug, gateway: 'stripe' }),
      });
      const body = (await r.json()) as { url?: string; error?: string };
      if (!r.ok) throw new Error(body.error ?? 'Checkout failed');
      if (body.url) window.location.href = body.url;
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : 'Checkout gagal.' });
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (busy) return;
    if (!confirm('Batalkan subscription aktif? Berlaku sampai akhir periode.')) return;
    setBusy(true);
    setMessage(null);
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const r = await fetch(API_URL + '/v1/billing/cancel', {
        method: 'POST',
        headers: t ? { Authorization: 'Bearer ' + t } : {},
      });
      if (!r.ok) {
        const body = (await r.json()) as { error?: string };
        throw new Error(body.error ?? 'Cancel failed');
      }
      setMessage({ ok: true, text: 'Subscription dibatalkan. Tetap aktif sampai akhir periode.' });
      void load();
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : 'Cancel gagal.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card
      title="Billing & Subscription"
      icon={<CreditCard className="h-4 w-4" strokeWidth={1.8} />}
    >
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Memuat billing…
        </div>
      ) : !me ? (
        <p className="text-xs text-slate-500">Belum login — billing tidak tersedia</p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-surface-3 bg-surface-0 p-4">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Plan Saat Ini</p>
            <p className="mt-1 text-base font-semibold text-slate-100">
              {me.subscription?.plan?.name ?? 'Free'}
            </p>
            <div className="mt-2 space-y-1 text-[11px] text-slate-500">
              <p>
                Status:{' '}
                <span
                  className={
                    me.subscription?.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                  }
                >
                  {me.subscription?.status ?? '—'}
                </span>
              </p>
              {me.subscription?.currentPeriodEnd && (
                <p>
                  Berakhir: {new Date(me.subscription.currentPeriodEnd).toLocaleString('id-ID')}
                </p>
              )}
              {me.trialEndsAt && me.subscription?.status === 'trialing' && (
                <p className="text-amber-400">Trial berakhir dalam {me.daysLeft} hari</p>
              )}
              {me.entitlement && (
                <p>
                  Quota bulan ini:{' '}
                  <span className="text-slate-300">
                    {me.entitlement.tasksUsed.toLocaleString()} terpakai
                  </span>
                </p>
              )}
            </div>
          </div>

          {message && (
            <p
              className={`flex items-center gap-1.5 text-xs ${
                message.ok ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {message.ok ? (
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
              ) : (
                <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
              )}
              {message.text}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {me.subscription?.status === 'active' && !me.subscription.cancelAtPeriodEnd && (
              <button
                type="button"
                onClick={() => void cancel()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
              >
                Cancel Subscription
              </button>
            )}
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-400 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-accent-300"
            >
              Lihat Paket
              <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
            </a>
          </div>

          {plans.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">
                Upgrade / Switch Plan
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {plans
                  .filter((p) => p.slug !== me.subscription?.plan?.slug)
                  .map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => void checkout(p.slug)}
                      disabled={busy}
                      className="flex items-center justify-between rounded-lg border border-surface-3 bg-surface-0 px-3 py-2 text-left text-xs transition-colors hover:border-accent-400 hover:bg-surface-2 disabled:opacity-50"
                    >
                      <div>
                        <p className="font-medium text-slate-200">{p.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {fmtPrice(p.priceUsd)}/{p.interval}
                        </p>
                      </div>
                      {busy ? (
                        <Loader2 className="h-3 w-3 animate-spin text-slate-400" strokeWidth={2} />
                      ) : (
                        <span className="text-[11px] font-medium text-accent-400">Pilih</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
