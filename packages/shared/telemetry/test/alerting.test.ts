import { describe, it, expect, vi } from 'vitest';
import { AlertEngine, SlackNotifier, WebhookNotifier } from '../src/alerting.js';
import type { DashboardMetrics } from '../src/interfaces.js';

describe('AlertEngine', () => {
  it('evaluates rules and triggers notifications', async () => {
    const engine = new AlertEngine();
    const mockNotify = vi.fn().mockResolvedValue(undefined);

    engine.addRule({
      id: 'high-errors',
      name: 'High Error Rate',
      condition: (m: DashboardMetrics) => m.errorRate > 10,
      notify: mockNotify,
      enabled: true,
    });

    const events = await engine.evaluate({
      activeTasks: 5,
      completedToday: 10,
      totalCostUsd: 0.5,
      avgLatencyMs: 200,
      errorRate: 15,
    });

    expect(events).toHaveLength(1);
    expect(events[0].ruleName).toBe('High Error Rate');
    expect(mockNotify).toHaveBeenCalledOnce();
  });

  it('skips disabled rules', async () => {
    const engine = new AlertEngine();
    const mockNotify = vi.fn().mockResolvedValue(undefined);

    engine.addRule({
      id: 'disabled-rule',
      name: 'Disabled',
      condition: () => true,
      notify: mockNotify,
      enabled: false,
    });

    const events = await engine.evaluate({
      activeTasks: 0,
      completedToday: 0,
      totalCostUsd: 0,
      avgLatencyMs: 0,
      errorRate: 0,
    });

    expect(events).toHaveLength(0);
    expect(mockNotify).not.toHaveBeenCalled();
  });

  it('removes rules', async () => {
    const engine = new AlertEngine();
    engine.addRule({
      id: 'r1',
      name: 'Rule 1',
      condition: () => true,
      notify: vi.fn(),
      enabled: true,
    });
    expect(engine.getRules()).toHaveLength(1);
    engine.removeRule('r1');
    expect(engine.getRules()).toHaveLength(0);
  });

  it('does not trigger when condition is false', async () => {
    const engine = new AlertEngine();
    const mockNotify = vi.fn().mockResolvedValue(undefined);
    engine.addRule({
      id: 'r1',
      name: 'Low Errors',
      condition: (m) => m.errorRate > 50,
      notify: mockNotify,
      enabled: true,
    });

    const events = await engine.evaluate({
      activeTasks: 0,
      completedToday: 10,
      totalCostUsd: 0,
      avgLatencyMs: 0,
      errorRate: 5,
    });

    expect(events).toHaveLength(0);
  });
});

describe('SlackNotifier', () => {
  it('sends webhook payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    const notifier = new SlackNotifier('https://hooks.slack.com/test');
    await notifier.send({
      ruleId: 'r1',
      ruleName: 'Test Alert',
      message: 'test',
      metrics: {
        activeTasks: 1,
        completedToday: 5,
        totalCostUsd: 0.1,
        avgLatencyMs: 100,
        errorRate: 10,
      },
      timestamp: new Date(),
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });
});

describe('WebhookNotifier', () => {
  it('sends JSON payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    const notifier = new WebhookNotifier('https://example.com/webhook');
    await notifier.send({
      ruleId: 'r1',
      ruleName: 'Test',
      message: 'test',
      metrics: {
        activeTasks: 0,
        completedToday: 0,
        totalCostUsd: 0,
        avgLatencyMs: 0,
        errorRate: 0,
      },
      timestamp: new Date(),
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });
});
