/**
 * Quota middleware — caps the number of agent runs per user per day.
 *
 * Follows the same dual-mode pattern as `maybeRequireAdmin`:
 *  - AUTH_ENABLED=false (dev / tests) → pass-through, no enforcement
 *  - AUTH_ENABLED=true  → require valid Bearer token, enforce 100 tasks/day
 *
 * In-memory counters reset at midnight UTC (sufficient for single-instance;
 * swap to a DB-backed counter for multi-instance deployments).
 */
import type { Response, NextFunction } from 'express';
import { AUTH_ENABLED, verifyToken, type AuthenticatedRequest } from '../auth.js';

const DAILY_LIMIT = 100;

interface QuotaBucket {
  count: number;
  /** ISO date string (YYYY-MM-DD) in UTC — resets when day rolls over. */
  date: string;
}

const counters = new Map<string, QuotaBucket>();

function todayKey(): string {
  // e.g. "2026-08-10"
  return new Date().toISOString().slice(0, 10);
}

/**
 * Middleware guard for `/v1/agentx/run*` routes.
 *
 * Checks the authenticated user's daily run count against `DAILY_LIMIT`.
 * When the limit is reached, responds with **429** and does NOT call `next()`.
 */
export function maybeRequireQuota(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  // Dev / test mode: no enforcement
  if (!AUTH_ENABLED) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: 'Missing Bearer token' });
    return;
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (e) {
    res.status(401).json({ error: e instanceof Error ? e.message : 'Unauthorized' });
    return;
  }

  // Attach auth context so downstream handlers can read req.auth
  req.auth = payload;

  const userId = payload.sub;
  const today = todayKey();
  const bucket = counters.get(userId);

  if (!bucket || bucket.date !== today) {
    // New day (or first request) — reset counter
    counters.set(userId, { count: 1, date: today });
    next();
    return;
  }

  if (bucket.count >= DAILY_LIMIT) {
    res.status(429).json({
      error: 'Daily task quota exceeded',
      limit: DAILY_LIMIT,
      resetAt: `${today}T23:59:59Z`,
    });
    return;
  }

  bucket.count += 1;
  next();
}
