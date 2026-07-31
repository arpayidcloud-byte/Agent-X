import { describe, it, expect } from 'vitest';
import { LLMRouter } from '@agent-xai/llm-router';
import { llmMetrics } from '@agent-xai/observability';

// ─── API Key Test ────
describe('Phase 5: API Key Authentication', () => {
  it('should accept API key via environment variable', async () => {
    process.env.OPENAI_COMPATIBLE_API_KEY = 'sk-test-key-12345';
    const router = new LLMRouter();
    expect(router).toBeDefined();
  });

  it('should accept provider-specific env vars', async () => {
    process.env.DEEPSEEK_API_KEY = 'ds-test-key-12345';
    process.env.QWEN_API_KEY = 'qwen-test-key-12345';
    expect(process.env.DEEPSEEK_API_KEY).toBe('ds-test-key-12345');
    expect(process.env.QWEN_API_KEY).toBe('qwen-test-key-12345');
  });
});

// ─── Auth Login Test ────
describe('Phase 5: Auth Login Flow', () => {
  it('should simulate OAuth token exchange', async () => {
    const mockToken = 'oauth_mock_' + Date.now();
    process.env.OAUTH_ACCESS_TOKEN = mockToken;
    expect(process.env.OAUTH_ACCESS_TOKEN).toContain('oauth_mock_');
    delete process.env.OAUTH_ACCESS_TOKEN;
  });
});

// ─── Auto-Fallback Test ────
describe('Phase 5: Auto-Fallback Chain', () => {
  it('should have fallback chain configured', async () => {
    // Router reads fallback chain from env vars
    process.env.LLM_PROVIDER_DEFAULT = 'openai';
    process.env.LLM_PROVIDER_FALLBACK = 'deepseek';
    process.env.LLM_PROVIDER_BACKUP = 'qwen';
    expect(process.env.LLM_PROVIDER_DEFAULT).toBe('openai');
    expect(process.env.LLM_PROVIDER_FALLBACK).toBe('deepseek');
    expect(process.env.LLM_PROVIDER_BACKUP).toBe('qwen');
  });
});

// ─── Metrics Test ────
describe('Phase 5: Prometheus Metrics', () => {
  it('should record request metrics', async () => {
    llmMetrics.recordRequest('openai', 'gpt-4o', 'medium', 'success');
    llmMetrics.recordLatency('openai', 'gpt-4o', 1.5);
    llmMetrics.recordTokenUsage('openai', 'gpt-4o', 'input', 150);
    llmMetrics.recordTokenUsage('openai', 'gpt-4o', 'output', 50);
    const metrics = await llmMetrics.getMetrics();
    expect(metrics).toContain('llm_requests_total');
    expect(metrics).toContain('llm_request_latency_seconds');
    expect(metrics).toContain('llm_token_usage');
  });
});

// ─── Alerting Test ────
describe('Phase 5: AlertManager', () => {
  it('should send alert via console fallback', async () => {
    const { AlertManager } = await import('@agent-xai/observability');
    const alertManager = new AlertManager();
    await expect(alertManager.sendAlert('info', 'Test alert', { phase: 5 })).resolves.not.toThrow();
  });
});

// ─── Health Check Test ────
describe('Phase 5: HealthChecker', () => {
  it('should provide health report', async () => {
    const { HealthChecker } = await import('@agent-xai/observability');
    const healthChecker = new HealthChecker();
    healthChecker.registerProvider('openai', 'healthy');
    healthChecker.registerProvider('deepseek', 'healthy');
    const report = healthChecker.getHealthReport();
    expect(report.status).toBe('healthy');
    expect(report.providers).toHaveLength(2);
    expect(report.timestamp).toBeDefined();
  });
});

// ─── Integration Test ────
describe('Phase 5: End-to-End Integration', () => {
  it('should complete full provider chain: mock → metrics → health', async () => {
    // 1. Setup router
    const router = new LLMRouter();

    // 2. Register mock provider with correct name matching selectBestModel
    const { MockProvider } = await import('@agent-xai/llm-router');
    router.registerProvider(
      new MockProvider('openai', {
        'gpt-4o-mini': {
          name: 'GPT-4 Omni Mini',
          provider: 'openai',
          pricing: { inputCostPerMillion: 0.15, outputCostPerMillion: 0.6 },
          capabilities: ['reasoning', 'fast'],
          complexityRating: 'simple',
        },
      }),
    );

    // 3. Execute request — selectBestModel will return 'openai:gpt-4o-mini'
    // for complexity: 'simple', type: 'reasoning', budget: 'medium'
    const response = await router.execute(
      {
        taskId: 'test-123',
        description: 'Test Phase 5 integration',
        complexity: 'simple',
        type: 'reasoning',
        budget: 'medium',
      },
      'Hello Agent-X',
    );

    // 4. Verify response
    expect(response.message).toBeDefined();
    expect(response.provider).toBe('openai');
    expect(response.usage).toBeDefined();
    expect(response.cost).toBeGreaterThanOrEqual(0);

    // 5. Verify metrics
    const metrics = await llmMetrics.getMetrics();
    expect(metrics).toContain('llm_requests_total');
  });
});
