import express from 'express';
import { llmMetrics, alertManager, healthChecker, Logger } from '@agent-xai/observability';
import { LLMRouter, OpenAIMock, DeepSeekMock, AnthropicMock } from '@agent-xai/llm-router';
import { createRequestLogger } from './request-logger.js';
import { notifySlack } from './slack.js';
import { getBetaBackend } from './beta-store.js';
import type { WaitlistEntry, FeedbackEntry } from './beta-store.js';
import { maybeRequireAdmin } from './auth.js';
import { registerAuthRoutes } from './auth-routes.js';

export { waitlistStore, feedbackStore, resetBetaStores } from './beta-store.js';

const logger = new Logger('agentx-api');

const app: express.Express = express();
app.use(express.json());
app.use(createRequestLogger());

registerAuthRoutes(app);

const PORT = process.env.PORT || 4000;

// ─── In-memory task store (dashboard API) ────
export interface TaskRecord {
  id: string;
  prompt: string;
  description: string;
  status: 'pending' | 'success' | 'error';
  provider?: string;
  model?: string;
  response?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export const taskStore = new Map<string, TaskRecord>();

function recordTask(task: TaskRecord): void {
  taskStore.set(task.id, task);
  // Cap the store to the latest 200 tasks (memory-friendly)
  if (taskStore.size > 200) {
    const oldest = [...taskStore.keys()].shift();
    if (oldest) taskStore.delete(oldest);
  }
}

// ─── Router instance (singleton) ────
export const router = new LLMRouter();

// ─── Dev/demo providers (no API keys required) ────
// Set ENABLE_MOCK_PROVIDER=true to register mock providers so the API is
// fully usable locally for development, testing and monitoring demos.
if (process.env.ENABLE_MOCK_PROVIDER === 'true') {
  router.registerProvider(OpenAIMock);
  router.registerProvider(DeepSeekMock);
  router.registerProvider(AnthropicMock);
  logger.info('Mock providers registered (ENABLE_MOCK_PROVIDER=true)', {
    providers: ['openai', 'deepseek', 'anthropic'],
  });
}

// ─── Metrics endpoint (Prometheus scrape) ────
app.get('/metrics', async (_req, res) => {
  try {
    const metricsData = await llmMetrics.getMetrics();
    res.set('Content-Type', 'text/plain; version=0.0.4');
    res.send(metricsData);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Health endpoint (live provider status) ────
app.get('/health', async (_req, res) => {
  try {
    const health = healthChecker.getHealthReport();
    res.json(health);
  } catch (e) {
    res.status(500).json({ status: 'unhealthy', error: String(e) });
  }
});

// ─── LLM run endpoint (wired to router) ────
app.post('/v1/agentx/run', async (req, res): Promise<void> => {
  try {
    const { prompt, taskId, description, complexity, type, budget } = req.body ?? {};

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Missing required field: prompt (string)' });
      return;
    }

    const request = {
      taskId: taskId ?? `api-${Date.now()}`,
      description: description ?? prompt.slice(0, 120),
      complexity: complexity ?? 'medium',
      type: type ?? 'reasoning',
      budget: budget ?? 'medium',
    };

    const startedAt = new Date().toISOString();
    recordTask({
      id: request.taskId,
      prompt,
      description: request.description,
      status: 'pending',
      createdAt: startedAt,
    });

    try {
      const response = await router.execute(request, prompt);
      const completed = taskStore.get(request.taskId);
      if (completed) {
        completed.status = 'success';
        completed.completedAt = new Date().toISOString();
        completed.provider = response.provider;
        completed.model = response.model;
        completed.response = response.message;
      }
      res.json(response);
    } catch (runErr) {
      const err = runErr instanceof Error ? runErr.message : String(runErr);
      const failed = taskStore.get(request.taskId);
      if (failed) {
        failed.status = 'error';
        failed.completedAt = new Date().toISOString();
        failed.error = err;
      }
      res.status(500).json({ error: err });
    }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// ─── Task list endpoint (dashboard) ────
app.get('/v1/agentx/tasks', async (_req, res) => {
  try {
    const limitRaw = Number(_req.query.limit ?? 50);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 200) : 50;
    const tasks = [...taskStore.values()]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
    res.json({ tasks, total: taskStore.size });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Compact stats endpoint (dashboard) ────
app.get('/v1/agentx/stats', async (_req, res) => {
  try {
    const registry = llmMetrics.getRegistry();
    const json = await registry.getMetricsAsJSON();
    const stats: Record<string, number> = {};
    for (const metric of json) {
      const total = metric.values.reduce((acc, v) => acc + (Number(v.value) || 0), 0);
      stats[metric.name] = total;
    }
    res.json({ stats, generatedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta waitlist & feedback (Phase 3 Week 19-20: beta recruitment) ────
// Storage backend: Prisma/PostgreSQL when DATABASE_URL is reachable,
// otherwise in-memory Maps (see beta-store.ts). Tests stay DB-less.

// ─── Beta waitlist: signup ────
app.post('/v1/beta/waitlist', async (req, res): Promise<void> => {
  try {
    const { email, name, source } = req.body ?? {};
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Missing or invalid field: email (valid string required)' });
      return;
    }
    const normalized = email.trim().toLowerCase();
    const backend = await getBetaBackend();
    const existing = await backend.waitlistFindByEmail(normalized);
    if (existing) {
      res.status(409).json({ error: 'Email already on waitlist', entry: existing });
      return;
    }
    const entry: WaitlistEntry = {
      id: `wl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: normalized,
      name: typeof name === 'string' ? name.slice(0, 120) : undefined,
      source: typeof source === 'string' ? source.slice(0, 60) : undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await backend.waitlistCreate(entry);
    const { total } = await backend.waitlistStats();
    logger.info('Beta waitlist signup', { id: entry.id, email: normalized });
    void notifySlack(`:tada: New beta waitlist signup: ${normalized}`, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New waitlist signup*\nEmail: ${normalized}\nSource: ${entry.source ?? 'direct'}`,
        },
      },
    ]);
    res.status(201).json({ entry, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta waitlist: admin list ────
app.get('/v1/beta/waitlist', maybeRequireAdmin, async (_req, res) => {
  try {
    const limitRaw = Number(_req.query.limit ?? 100);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 1000) : 100;
    const backend = await getBetaBackend();
    const [entries, { total }] = await Promise.all([
      backend.waitlistFindAll(limit),
      backend.waitlistStats(),
    ]);
    res.json({ entries, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta waitlist: admin invite (update status) ────
app.patch('/v1/beta/waitlist/:id/status', maybeRequireAdmin, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = typeof id === 'string' ? id : '';
    const { status } = req.body ?? {};
    const validStatuses = ['invited', 'active'];
    if (!validStatuses.includes(status)) {
      res
        .status(400)
        .json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }
    const backend = await getBetaBackend();
    const entry = await backend.waitlistUpdateStatus(idStr, status);
    if (!entry) {
      res.status(404).json({ error: 'Waitlist entry not found' });
      return;
    }
    logger.info('Beta waitlist status updated', { id, email: entry.email, status });
    void notifySlack(`:envelope: Waitlist update: ${entry.email} -> *${status}*`, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Waitlist update*\nEmail: ${entry.email}\nStatus: ${status}`,
        },
      },
    ]);
    res.json({ entry });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta waitlist: stats (dashboard) ────
app.get('/v1/beta/waitlist/stats', async (_req, res) => {
  try {
    const backend = await getBetaBackend();
    const stats = await backend.waitlistStats();
    res.json({ ...stats, generatedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta feedback: submit ────
app.post('/v1/beta/feedback', async (req, res): Promise<void> => {
  try {
    const { email, category, message, rating } = req.body ?? {};
    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      res.status(400).json({ error: 'Missing or invalid field: message (min 3 chars)' });
      return;
    }
    const validCategories = ['bug', 'feature', 'performance', 'ux', 'other'];
    const cat = typeof category === 'string' ? category.toLowerCase() : 'other';
    if (!validCategories.includes(cat)) {
      res
        .status(400)
        .json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
      return;
    }
    const ratingNum = rating === undefined ? undefined : Number(rating);
    if (
      ratingNum !== undefined &&
      (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5)
    ) {
      res.status(400).json({ error: 'Invalid rating. Must be integer 1-5' });
      return;
    }
    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: typeof email === 'string' ? email.trim().toLowerCase().slice(0, 200) : undefined,
      category: cat,
      message: message.trim().slice(0, 2000),
      rating: ratingNum === undefined ? undefined : Math.round(ratingNum),
      createdAt: new Date().toISOString(),
    };
    const backend = await getBetaBackend();
    await backend.feedbackCreate(entry);
    const total = await backend.feedbackCount();
    logger.info('Beta feedback submitted', { id: entry.id, category: cat });
    void notifySlack(
      `:speech_balloon: New beta feedback [${cat}]: ${entry.message.slice(0, 120)}`,
      [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New beta feedback*\nCategory: ${cat}\nRating: ${entry.rating ?? '-'}/5\n\n${entry.message.slice(0, 500)}`,
          },
        },
      ],
    );
    res.status(201).json({ entry, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta feedback: list ────
app.get('/v1/beta/feedback', maybeRequireAdmin, async (_req, res) => {
  try {
    const limitRaw = Number(_req.query.limit ?? 100);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 1000) : 100;
    const backend = await getBetaBackend();
    const [entries, total] = await Promise.all([
      backend.feedbackFindAll(limit),
      backend.feedbackCount(),
    ]);
    res.json({ entries, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Blocker 2: Dynamic health monitor (setInterval) ────
const HEALTH_MONITOR_INTERVAL_MS = Number(process.env.HEALTH_MONITOR_INTERVAL_MS ?? 30_000);

setInterval(() => {
  void (async () => {
    try {
      const health = healthChecker.getHealthReport();
      const unhealthy = health.providers.filter((p) => p.status === 'unhealthy');
      const degraded = health.providers.filter((p) => p.status === 'degraded');

      if (unhealthy.length > 0) {
        await alertManager.sendAlert(
          'critical',
          `[HealthMonitor] ${unhealthy.length} provider(s) UNHEALTHY: ${unhealthy.map((p) => p.name).join(', ')}`,
          { health },
        );
      } else if (degraded.length > 0) {
        await alertManager.sendAlert(
          'warning',
          `[HealthMonitor] ${degraded.length} provider(s) DEGRADED: ${degraded.map((p) => p.name).join(', ')}`,
          { health },
        );
      }
    } catch (e) {
      logger.error('[HealthMonitor] error:', e instanceof Error ? e : new Error(String(e)));
    }
  })();
}, HEALTH_MONITOR_INTERVAL_MS);

// ─── Blocker 3: Threshold rules + periodic check ────
alertManager.addThreshold({
  metric: 'llm_request_latency_seconds',
  max: 5,
  min: 0,
  level: 'critical',
});
alertManager.addThreshold({ metric: 'llm_errors_total', max: 10, min: 0, level: 'warning' });
alertManager.addThreshold({ metric: 'llm_fallbacks_total', max: 5, min: 0, level: 'warning' });

const THRESHOLD_CHECK_INTERVAL_MS = Number(process.env.THRESHOLD_CHECK_INTERVAL_MS ?? 30_000);

setInterval(() => {
  void (async () => {
    try {
      const metricsText = await llmMetrics.getMetrics();
      const parsed: Record<string, number> = {};

      // Parse Prometheus text format: "name value"
      for (const line of metricsText.split('\n')) {
        if (!line || line.startsWith('#')) continue;
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const metricName = parts[0]?.split('{')[0];
          const value = Number(parts[parts.length - 1]);
          if (metricName && !Number.isNaN(value)) {
            // Sum multi-label series into single number
            parsed[metricName] = (parsed[metricName] ?? 0) + value;
          }
        }
      }

      await alertManager.checkThresholds(parsed);
    } catch (e) {
      logger.error('[ThresholdMonitor] error:', e instanceof Error ? e : new Error(String(e)));
    }
  })();
}, THRESHOLD_CHECK_INTERVAL_MS);

// ─── Start server ────
export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Agent-X server running at http://localhost:${PORT}`, { port: PORT });
    logger.info('Endpoints:', {
      endpoints: ['/metrics', '/health', '/v1/agentx/run', '/v1/agentx/tasks', '/v1/agentx/stats'],
    });
    logger.info(`Health monitor: every ${HEALTH_MONITOR_INTERVAL_MS}ms`, {
      intervalMs: HEALTH_MONITOR_INTERVAL_MS,
    });
    logger.info(`Threshold check: every ${THRESHOLD_CHECK_INTERVAL_MS}ms`, {
      intervalMs: THRESHOLD_CHECK_INTERVAL_MS,
    });
  });
}
