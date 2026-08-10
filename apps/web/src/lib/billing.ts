/**
 * Web billing API helpers — fetch plans, checkout, get current subscription.
 */
import { API_URL } from './api';

export interface BillingPlan {
  slug: string;
  name: string;
  priceUsd: number;
  interval: string;
  maxTasksPerMonth: number;
  maxMembers: number;
  features?: Record<string, unknown>;
}

export interface BillingSubscription {
  id: string;
  orgId: string;
  planId: string;
  status: string;
  gateway: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan?: BillingPlan;
}

export interface BillingEntitlement {
  orgId: string;
  tasksUsed: number;
  periodStart: string;
  periodEnd: string;
}

export interface BillingMe {
  orgId: string | null;
  subscription: BillingSubscription | null;
  entitlement: BillingEntitlement | null;
  invoices: Array<{
    id: string;
    amountCents: number;
    currency: string;
    status: string;
    hostedInvoiceUrl: string | null;
    pdfUrl: string | null;
    periodStart: string | null;
    periodEnd: string | null;
    paidAt: string | null;
    createdAt: string;
  }>;
  trialEndsAt: string | null;
  daysLeft: number | null;
  canConsume: boolean;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export async function fetchBillingPlans(): Promise<{ plans: BillingPlan[] }> {
  const r = await fetch(`${API_URL}/v1/billing/plans`);
  if (!r.ok) return { plans: [] };
  return r.json() as Promise<{ plans: BillingPlan[] }>;
}

export async function startCheckout(
  planSlug: string,
  gateway: 'stripe' | 'midtrans' = 'stripe',
): Promise<{ gateway: string; url?: string; token?: string; redirectUrl?: string }> {
  const token = getToken();
  const r = await fetch(`${API_URL}/v1/billing/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ planSlug, gateway }),
  });
  const body = (await r.json()) as {
    url?: string;
    token?: string;
    redirectUrl?: string;
    gateway?: string;
    error?: string;
  };
  if (!r.ok) throw new Error(body.error ?? 'Checkout failed');
  return { gateway: body.gateway ?? gateway, ...body };
}

export async function fetchBillingMe(): Promise<BillingMe> {
  const token = getToken();
  const r = await fetch(`${API_URL}/v1/billing/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!r.ok) {
    const body = (await r.json()) as { error?: string };
    throw new Error(body.error ?? 'Failed to load billing');
  }
  return r.json() as Promise<BillingMe>;
}

export async function cancelBilling(): Promise<{ ok: boolean }> {
  const token = getToken();
  const r = await fetch(`${API_URL}/v1/billing/cancel`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!r.ok) {
    const body = (await r.json()) as { error?: string };
    throw new Error(body.error ?? 'Cancel failed');
  }
  return r.json() as Promise<{ ok: boolean }>;
}

export async function fetchBillingPortal(): Promise<{ url?: string }> {
  const token = getToken();
  const r = await fetch(`${API_URL}/v1/billing/portal`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const body = (await r.json()) as { url?: string; error?: string };
  if (!r.ok) throw new Error(body.error ?? 'Portal unavailable');
  return body;
}
