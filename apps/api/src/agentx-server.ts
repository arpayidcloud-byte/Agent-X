import express from 'express';
import { llmMetrics, alertManager, healthChecker } from '@agent-xai/observability';
import { LLMRouter } from '@agent-xai/llm-router';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ─── Router instance (singleton) ────
export const router = new LLMRouter();

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

    const response = await router.execute(request, prompt);
    res.json(response);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
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
      console.error('[HealthMonitor] error:', e);
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
      console.error('[ThresholdMonitor] error:', e);
    }
  })();
}, THRESHOLD_CHECK_INTERVAL_MS);

// ─── Start server ────
const server = app.listen(PORT, () => {
  console.log(`Agent-X server running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET  /metrics          — Prometheus metrics');
  console.log('  GET  /health           — provider health report');
  console.log('  POST /v1/agentx/run    — LLM router execution');
  console.log(`Health monitor: every ${HEALTH_MONITOR_INTERVAL_MS}ms`);
  console.log(`Threshold check: every ${THRESHOLD_CHECK_INTERVAL_MS}ms`);
});

export default server;
