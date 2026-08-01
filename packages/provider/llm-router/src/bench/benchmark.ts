/**
 * @module llm-router/bench
 * @description Performance & behavior baseline benchmark for the LLM router.
 *
 * Run: pnpm --filter @agent-xai/llm-router bench
 *
 * Measures with REAL executed requests (mock providers, deterministic):
 *   A. Latency (p50/p95/p99) & cost per complexity tier
 *   B. Pure router overhead (near-zero provider latency)
 *   C. Cache effectiveness (cold vs warm request)
 *   D. Fallback resilience (primary provider failing)
 *   E. Throughput under concurrency
 *   F. Cost baseline per scenario (for OKR "70% cost reduction")
 *
 * All numbers are produced by actual code execution — no fixtures.
 */

import { LLMRouter, MockProvider, DeepSeekMock, OpenAIMock, AnthropicMock } from '../index.js';
import type { LLMProvider, RouteRequest, LLMResponse } from '../types.js';

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

function stats(label: string, values: number[]): void {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  console.log(
    `  ${label.padEnd(38)} mean=${mean.toFixed(1)}ms  p50=${percentile(sorted, 50).toFixed(1)}ms  ` +
      `p95=${percentile(sorted, 95).toFixed(1)}ms  p99=${percentile(sorted, 99).toFixed(1)}ms  n=${values.length}`,
  );
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[idx] ?? 0;
}

/** Fast mock for measuring pure router overhead / throughput. */
class FastMock extends MockProvider {
  constructor(
    name: string,
    models: MockProvider['models'],
    private latencyMs: number,
  ) {
    super(name, models);
  }
  override async generate(
    model: string,
    prompt: string,
    options?: RouteRequest,
  ): Promise<LLMResponse> {
    const start = Date.now();
    const res = await super.generate(model, prompt, options);
    await sleep(this.latencyMs);
    return { ...res, latencyMs: Date.now() - start };
  }
}

/** Provider whose generate() always throws — simulates an outage. */
class FailingProvider extends MockProvider {
  constructor(name: string, models: MockProvider['models']) {
    super(name, models);
  }
  override async generate(): Promise<LLMResponse> {
    throw new Error(`[bench] ${this.name} is DOWN (simulated outage)`);
  }
}

function routerWith(...providers: LLMProvider[]): LLMRouter {
  const router = new LLMRouter();
  for (const p of providers) router.registerProvider(p);
  return router;
}

const PROMPT =
  'Write a production-grade TypeScript function to parse and validate CSV input. '.repeat(40); // ~4000 chars ≈ 1000 tokens

const REQ: RouteRequest = { taskId: 'bench', description: 'benchmark task' };

async function runScenarioA(): Promise<void> {
  console.log('\n=== A. Latency & cost per complexity tier (real mock latency ~500ms) ===');
  const tiers: Array<{ label: string; req: RouteRequest }> = [
    { label: 'simple', req: { ...REQ, complexity: 'simple' } },
    { label: 'medium (default)', req: { ...REQ } },
    { label: 'complex', req: { ...REQ, complexity: 'complex' } },
    { label: 'expert', req: { ...REQ, complexity: 'expert' } },
    { label: 'budget=low', req: { ...REQ, budget: 'low' } },
    { label: 'type=code, complex', req: { ...REQ, type: 'code', complexity: 'complex' } },
  ];
  for (const { label, req } of tiers) {
    const router = routerWith(OpenAIMock, DeepSeekMock, AnthropicMock);
    const latencies: number[] = [];
    let totalCost = 0;
    let model = '';
    for (let i = 0; i < 10; i++) {
      const res = await router.execute({ ...req, taskId: `bench-a-${i}` }, PROMPT);
      latencies.push(res.latencyMs);
      totalCost += res.cost;
      model = `${res.provider}:${res.model}`;
    }
    stats(`A. ${label} → ${model}`, latencies);
    console.log(`  ${''.padEnd(38)} mean cost/req = $${(totalCost / 10).toFixed(6)}`);
  }
}

async function runScenarioB(): Promise<void> {
  console.log('\n=== B. Pure router overhead (provider latency ~0ms) ===');
  const fast = new FastMock('deepseek', DeepSeekMock.models, 0);
  const router = routerWith(fast);
  const latencies: number[] = [];
  for (let i = 0; i < 20; i++) {
    const res = await router.execute({ ...REQ, taskId: `bench-b-${i}` }, PROMPT);
    latencies.push(res.latencyMs);
  }
  stats('B. overhead per request (medium)', latencies);
}

async function runScenarioC(): Promise<void> {
  console.log('\n=== C. Cache effectiveness (identical request, warm after cold) ===');
  const router = routerWith(DeepSeekMock);
  const req: RouteRequest = { ...REQ, taskId: 'bench-c-same', complexity: 'medium' };
  const cold = await router.execute(req, PROMPT);
  const warm = await router.execute(req, PROMPT);
  console.log(
    `  cold: latency=${cold.latencyMs}ms cost=$${cold.cost.toFixed(6)} cached=${cold.cached}`,
  );
  console.log(
    `  warm: latency=${warm.latencyMs}ms cost=$${warm.cost.toFixed(6)} cached=${warm.cached}`,
  );
  const saved = cold.cost > 0 ? (1 - warm.cost / cold.cost) * 100 : 0;
  console.log(
    `  cost saved by cache: ${saved.toFixed(1)}%  latency saved: ${cold.latencyMs > 0 ? (1 - warm.latencyMs / cold.latencyMs) * 100 : 0}%`,
  );
}

async function runScenarioD(): Promise<void> {
  console.log('\n=== D. Fallback resilience (primary provider DOWN) ===');
  const down = new FailingProvider('openai', OpenAIMock.models);
  const router = routerWith(down, DeepSeekMock, AnthropicMock);
  const req: RouteRequest = { ...REQ, taskId: 'bench-d', complexity: 'complex' };
  const start = Date.now();
  try {
    const res = await router.execute(req, PROMPT);
    console.log(
      `  SUCCESS via ${res.provider}:${res.model} — latency=${res.latencyMs}ms total=${Date.now() - start}ms cost=$${res.cost.toFixed(6)}`,
    );
  } catch (err) {
    console.log(`  FAILED: ${err instanceof Error ? err.message : String(err)}`);
    console.log('  → fallback chain did NOT produce a response with current mocks');
  }
}

async function runScenarioE(): Promise<void> {
  console.log('\n=== E. Throughput under concurrency (provider latency ~10ms) ===');
  const fast = new FastMock('deepseek', DeepSeekMock.models, 10);
  const router = routerWith(fast);
  const CONCURRENCY = 10;
  const TOTAL = 100;
  const start = Date.now();
  const run = async (): Promise<void> => {
    await router.execute({ ...REQ, taskId: `bench-e-${Math.random()}` }, PROMPT);
  };
  let done = 0;
  const worker = async (): Promise<void> => {
    while (done < TOTAL) {
      done++;
      await run();
    }
  };
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);
  const elapsed = (Date.now() - start) / 1000;
  console.log(
    `  ${TOTAL} requests, concurrency=${CONCURRENCY}, elapsed=${elapsed.toFixed(2)}s → ${(TOTAL / elapsed).toFixed(1)} req/s`,
  );
}

function runScenarioF(): void {
  console.log('\n=== F. Cost baseline per scenario (OKR "70% cost reduction") ===');
  const router = routerWith(OpenAIMock, DeepSeekMock, AnthropicMock);
  const combos: Array<{ label: string; req: RouteRequest }> = [];
  const complexities: Array<RouteRequest['complexity']> = ['simple', 'medium', 'complex', 'expert'];
  const budgets: Array<RouteRequest['budget']> = ['low', 'medium', 'high'];
  for (const c of complexities) {
    for (const b of budgets) {
      combos.push({ label: `reasoning/${c}/${b}`, req: { ...REQ, complexity: c, budget: b } });
    }
  }
  for (const t of ['code', 'creative', 'analysis'] as const) {
    for (const c of ['simple', 'medium', 'complex'] as Array<RouteRequest['complexity']>) {
      combos.push({
        label: `${t}/${c}/medium`,
        req: { ...REQ, type: t, complexity: c, budget: 'medium' },
      });
    }
  }
  let total = 0;
  for (const { label, req } of combos) {
    const modelStr = router.selectBestModel(req);
    const [prov, model] = modelStr.split(':') as [string, string];
    const provider = router['providers'].get(prov) as LLMProvider | undefined;
    const meta = provider?.models[model];
    const inputTokens = Math.floor(PROMPT.length / 4);
    const cost = meta
      ? (inputTokens / 1_000_000) * meta.pricing.inputCostPerMillion +
        (100 / 1_000_000) * meta.pricing.outputCostPerMillion
      : 0;
    total += cost;
    console.log(`  F. ${label.padEnd(28)} → ${modelStr.padEnd(42)} $${cost.toFixed(6)}/req`);
  }
  console.log(
    `  F. total (21 scenarios) = $${total.toFixed(6)}  → mean $${(total / combos.length).toFixed(6)}/req`,
  );
}

async function main(): Promise<void> {
  console.log(`Agent-X LLM Router — performance baseline benchmark`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(
    `Prompt size: ${PROMPT.length} chars (~${Math.floor(PROMPT.length / 4)} input tokens, 100 output tokens mock)`,
  );

  await runScenarioA();
  await runScenarioB();
  await runScenarioC();
  await runScenarioD();
  await runScenarioE();
  runScenarioF();
  console.log('\nBenchmark complete.');
}

main().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
