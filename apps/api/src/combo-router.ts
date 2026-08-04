// Combo provider resolution layer.
//
// A combo group is a named set of member providers (managed in the admin
// panel). When a request pins provider = <combo-name>, this layer resolves
// the member chain and executes with automatic failover:
//   - priority: members tried in stored order
//   - round-robin: rotation per group (in-process counter)
// Failover triggers on retryable errors (5xx, 429/rate-limit, timeouts,
// network errors). Non-retryable errors (e.g. 400 invalid request) fail fast.
//
// When provider is pinned to a REGULAR provider (not a combo), the request is
// passed through — LLMRouter.selectBestModel now honors req.provider pinning.

import type { LLMRouter, RouteRequest, LLMResponse } from '@agent-xai/llm-router';
import { getGroup } from './provider-group-store.js';

/** In-process round-robin rotation counter per group name. */
const rrCounters = new Map<string, number>();

/** Errors that justify failing over to the next combo member. */
export function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /429|5\d\d|timeout|timed out|ECONNRESET|ECONNREFUSED|ETIMEDOUT|fetch failed|rate\s*limit|too many requests|network error|unavailable/i.test(
    msg,
  );
}

/**
 * Resolve a combo group name to the ordered member provider chain.
 * Returns null when the name is not an enabled combo group.
 */
export async function resolveComboChain(groupName: string): Promise<string[] | null> {
  const group = await getGroup(groupName);
  if (!group || !group.enabled) return null;
  const members = group.members
    .map((m) => m.provider?.trim())
    .filter((p): p is string => Boolean(p));
  if (members.length === 0) return null;

  if (group.strategy === 'round-robin') {
    const n = rrCounters.get(groupName) ?? 0;
    rrCounters.set(groupName, n + 1);
    const rot = n % members.length;
    return [...members.slice(rot), ...members.slice(0, rot)];
  }
  return members;
}

/** True when the given name matches an existing combo group (enabled or not). */
export async function isComboName(name: string): Promise<boolean> {
  return (await getGroup(name)) !== null;
}

/**
 * Execute a route request, resolving combo provider names to their member
 * chain with failover. Non-combo requests pass straight through to the router.
 */
export async function executeRoute(
  router: LLMRouter,
  request: RouteRequest,
  prompt: string,
): Promise<LLMResponse> {
  if (!request.provider) {
    return router.execute(request, prompt);
  }

  const chain = await resolveComboChain(request.provider);
  if (chain) {
    const errors: string[] = [];
    for (const member of chain) {
      if (!router.getProvider(member)) {
        errors.push(`${member}: not registered`);
        continue;
      }
      try {
        // Prevent the router's internal fallback chain — the combo layer
        // handles failover itself.  Without this, a non-retryable error from
        // member A could be silently retried by the router with member B,
        // defeating the combo layer's failover logic.
        return await router.execute(
          { ...request, provider: member, _noFallback: true } as RouteRequest,
          prompt,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${member}: ${msg.slice(0, 80)}`);
        if (!isRetryableError(err)) throw err; // fail fast on non-retryable
      }
    }
    throw new Error(
      `Combo "${request.provider}" exhausted ${chain.length} member(s): ${errors.join('; ')}`,
    );
  }

  // Pinned to a regular provider (or unknown name) — let the router handle it.
  return router.execute(request, prompt);
}
