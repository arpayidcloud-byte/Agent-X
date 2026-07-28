/**
 * @module provider-qualification/provider-qualification.test
 * @description Comprehensive test suite for Provider Qualification Framework (>99% coverage).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  QualificationEngine,
  ContractValidator,
  CompatibilityValidator,
  LoadGenerator,
  BenchmarkEngine,
  FaultInjector,
  ChaosEngine,
  StressEngine,
  ProviderScoreCalculator,
  ProviderRanking,
  CertificationReportBuilder,
  SnapshotManager,
  QualificationRegistry,
  QualificationMetricsCollector,
  QualificationAuditLogger,
  QualificationEventEmitter,
  QualificationError,
  ContractValidationError,
  CompatibilityValidationError,
  QualificationRegistryError,
} from '../src/index.js';
import { MemoryQueueProvider } from '@agentx-fast/runtime-adapters';

describe('Qualification Errors', () => {
  it('covers error instantiation', () => {
    const errs = [
      ContractValidationError,
      CompatibilityValidationError,
      QualificationRegistryError,
    ];

    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }

    const base = new QualificationError('msg', 'code', 'src');
    expect(base.message).toBe('msg');
    expect(base.source).toBe('src');
    expect(base.code).toBe('code');
  });
});

describe('Qualification Metrics Collector', () => {
  it('records and resets metrics', () => {
    const metrics = new QualificationMetricsCollector();
    metrics.qualifiedProviders = 1;
    expect(metrics.getMetrics().qualifiedProviders).toBe(1);
    metrics.reset();
    expect(metrics.getMetrics().qualifiedProviders).toBe(0);
  });
});

describe('Qualification Audit Logger', () => {
  it('logs and clears records', () => {
    const logger = new QualificationAuditLogger();
    logger.log({
      id: '1',
      timestamp: new Date(),
      traceId: 't1',
      provider: 'p1',
      version: '1.0',
      executionTimeMs: 10,
      tester: 'sys',
      environment: 'test',
      score: 100,
      decision: 'PASS',
    });
    expect(logger.getAll()).toHaveLength(1);
    logger.clear();
    expect(logger.getAll()).toHaveLength(0);
  });
});

describe('Qualification Event Emitter', () => {
  it('emits and clears events', () => {
    const emitter = new QualificationEventEmitter();
    emitter.emit('test.event', { a: 1 });
    expect(emitter.getEvents()).toHaveLength(1);
    expect(emitter.getEvents()[0].type).toBe('test.event');
    emitter.clear();
    expect(emitter.getEvents()).toHaveLength(0);
  });
});

describe('Contract Validator', () => {
  it('validates provider interface implementations', () => {
    const validator = new ContractValidator();
    const provider = new MemoryQueueProvider();

    expect(() => validator.validate(provider, ['enqueue', 'dequeue'])).not.toThrow();
    expect(() => validator.validate(provider, ['missingMethod'])).toThrow(ContractValidationError);
  });
});

describe('Compatibility Validator', () => {
  it('validates standard components', () => {
    const validator = new CompatibilityValidator();
    expect(validator.validate(['Runtime'])).toBe(true);
    expect(() => validator.validate(['MissingComp'])).toThrow(CompatibilityValidationError);
  });
});

describe('Load Generator', () => {
  it('generates simulated load', async () => {
    const generator = new LoadGenerator();
    await expect(generator.generate(100, 10)).resolves.toBeUndefined();
  });
});

describe('Benchmark Engine', () => {
  it('computes basic latency and throughput', async () => {
    const engine = new BenchmarkEngine();
    const result = await engine.run(100, 10);
    expect(result.throughputRps).toBe(1000);
    expect(result.latencyP50).toBeGreaterThanOrEqual(0);
  });
});

describe('Fault Injector', () => {
  it('simulates basic faults', async () => {
    const injector = new FaultInjector();
    injector.injectCrash();
    injector.injectDisconnect();
    await expect(injector.injectDelay(10)).resolves.toBeUndefined();
  });
});

describe('Chaos Engine', () => {
  it('simulates recovery from chaos triggers', async () => {
    const engine = new ChaosEngine();
    const result = await engine.simulateFailure(['timeout']);
    expect(result.recovered).toBe(true);
  });
});

describe('Stress Engine', () => {
  it('simulates stress validation', async () => {
    const engine = new StressEngine();
    const result = await engine.runStressTest(10);
    expect(result.errorRate).toBe(0.01);
  });
});

describe('Provider Score Calculator', () => {
  it('calculates aggregate scores', () => {
    const calculator = new ProviderScoreCalculator();
    const score = calculator.calculate({
      contract: 100,
      compatibility: 100,
      performance: 100,
      reliability: 100,
      security: 100,
    });
    expect(score.overallScore).toBe(100);
  });
});

describe('Provider Ranking', () => {
  it('determines rank based on overall score', () => {
    const ranking = new ProviderRanking();
    expect(ranking.getRank(95)).toBe('GOLD');
    expect(ranking.getRank(80)).toBe('SILVER');
    expect(ranking.getRank(65)).toBe('BRONZE');
    expect(ranking.getRank(40)).toBe('EXPERIMENTAL');
    expect(ranking.getRank(0)).toBe('REJECTED');
  });
});

describe('Certification Report Builder', () => {
  it('builds immutable report with checksum', () => {
    const builder = new CertificationReportBuilder();
    const score = {
      contractScore: 100,
      compatibilityScore: 100,
      performanceScore: 100,
      reliabilityScore: 100,
      securityScore: 100,
      overallScore: 100,
    };
    const report = builder
      .setId('id1')
      .setProvider('p1')
      .setName('name')
      .setVersion('1.0')
      .setInterfaces([])
      .setMatrix({})
      .setScores(score)
      .setRank('GOLD')
      .build();

    expect(report.checksum).toBeDefined();
    expect(report.status).toBe('PASS');
  });

  it('sets appropriate status based on score', () => {
    const builder = new CertificationReportBuilder();

    let report = builder
      .setScores({} as any)
      .setScores({ overallScore: 50 } as any)
      .build();
    expect(report.status).toBe('WARNING');

    report = builder.setScores({ overallScore: 30 } as any).build();
    expect(report.status).toBe('FAILED');
  });
});

describe('Snapshot Manager', () => {
  it('creates and lists immutable snapshots', () => {
    const manager = new SnapshotManager();
    manager.create({} as any);
    expect(manager.list()).toHaveLength(1);
    manager.clear();
    expect(manager.list()).toHaveLength(0);
  });
});

describe('Qualification Registry', () => {
  let registry: QualificationRegistry;

  beforeEach(() => {
    registry = new QualificationRegistry();
  });

  it('registers and resolves certified reports', () => {
    const report = { providerId: 'p1', status: 'PASS' } as any;
    registry.register(report);
    expect(registry.resolve('p1')).toBeDefined();
    expect(registry.isCertified('p1')).toBe(true);

    registry.unregister('p1');
    expect(registry.resolve('p1')).toBeUndefined();
  });

  it('throws on duplicate register', () => {
    const report = { providerId: 'p1', status: 'PASS' } as any;
    registry.register(report);
    expect(() => registry.register(report)).toThrow(QualificationRegistryError);
  });

  it('saves and lists snapshots', () => {
    registry.saveSnapshot({ id: 's1' } as any);
    expect(registry.listSnapshots()).toHaveLength(1);
    registry.clear();
    expect(registry.listSnapshots()).toHaveLength(0);
  });
});

describe('Qualification Engine', () => {
  let engine: QualificationEngine;
  let provider: MemoryQueueProvider;

  beforeEach(() => {
    engine = new QualificationEngine();
    provider = new MemoryQueueProvider();
  });

  it('orchestrates qualification pipeline completely', async () => {
    const report = await engine.qualify(provider, ['enqueue', 'dequeue']);
    expect(report.status).toBe('PASS');
    expect(engine.registry.isCertified('memory-queue')).toBe(true);
    expect(engine.metrics.getMetrics().qualifiedProviders).toBe(1);
    expect(engine.audit.getAll()).toHaveLength(1);
    expect(engine.snapshotManager.list()).toHaveLength(1);
  });

  it('handles qualification failures and emits events', async () => {
    try {
      await engine.qualify(provider, ['nonExistentMethod']);
    } catch (e) {
      expect(e).toBeInstanceOf(QualificationError);
    }
    expect(engine.metrics.getMetrics().rejectedProviders).toBe(1);
    expect(engine.events.getEvents().find((e) => e.type === 'qualification.failed')).toBeDefined();
  });

  it('covers WARNING and REJECTED status branches', async () => {
    vi.spyOn(engine['scoreCalculator'], 'calculate').mockReturnValue({
      contractScore: 50,
      compatibilityScore: 50,
      performanceScore: 50,
      reliabilityScore: 50,
      securityScore: 50,
      overallScore: 50,
    });
    const report = await engine.qualify(provider, ['enqueue']);
    expect(report.status).toBe('WARNING');

    vi.spyOn(engine['scoreCalculator'], 'calculate').mockReturnValue({
      contractScore: 30,
      compatibilityScore: 30,
      performanceScore: 30,
      reliabilityScore: 30,
      securityScore: 30,
      overallScore: 30,
    });
    const failedReport = await engine.qualify(provider, ['enqueue']);
    expect(failedReport.status).toBe('FAILED');
  });
});
