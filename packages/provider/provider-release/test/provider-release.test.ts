/**
 * @module provider-release/provider-release.test
 * @description Comprehensive unit tests for PCMRC matching >99% coverage targets (M4.2.95).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  CompatibilityEngine,
  SemanticVersion,
  APICompatibility,
  BreakingChangeDetector,
  MigrationAnalyzer,
  DeprecationManager,
  ReleasePolicy,
  CompatibilityScoreCalculator,
  ReleaseRegistry,
  CompatibilityMatrix,
  CompatibilityMetricsCollector,
  ReleaseEventEmitter,
  CompatibilityAuditLogger,
  ProviderManifest,
  ReleaseError,
  IncompatibleVersionError,
  BreakingChangeError,
  CertificationFailedError,
  RegistryError,
} from '../src/index.js';

describe('Release Errors', () => {
  it('covers error instantiation', () => {
    const errs = [
      IncompatibleVersionError,
      BreakingChangeError,
      CertificationFailedError,
      RegistryError,
    ];

    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }

    const base = new ReleaseError('msg', 'code', 'src');
    expect(base.message).toBe('msg');
    expect(base.source).toBe('src');
    expect(base.code).toBe('code');
  });
});

describe('Compatibility Metrics Collector', () => {
  it('records and resets metrics', () => {
    const metrics = new CompatibilityMetricsCollector();
    metrics.compatibleProviders = 1;
    metrics.recordScore(95);
    expect(metrics.getMetrics().compatibleProviders).toBe(1);
    expect(metrics.getMetrics().averageCompatibilityScore).toBe(95);
    metrics.reset();
    expect(metrics.getMetrics().compatibleProviders).toBe(0);
    expect(metrics.getMetrics().averageCompatibilityScore).toBe(0);
  });
});

describe('Compatibility Audit Logger', () => {
  it('logs and clears records', () => {
    const logger = new CompatibilityAuditLogger();
    logger.log({
      id: '1',
      timestamp: new Date(),
      traceId: 't1',
      provider: 'p1',
      version: '1.0',
      tester: 'sys',
      environment: 'test',
      score: 100,
      status: 'PASS',
    });
    expect(logger.getAll()).toHaveLength(1);
    logger.clear();
    expect(logger.getAll()).toHaveLength(0);
  });
});

describe('Release Event Emitter', () => {
  it('emits and clears events', () => {
    const emitter = new ReleaseEventEmitter();
    emitter.emit('test.event', { a: 1 });
    expect(emitter.getEvents()).toHaveLength(1);
    expect(emitter.getEvents()[0].type).toBe('test.event');
    emitter.clear();
    expect(emitter.getEvents()).toHaveLength(0);
  });
});

describe('Semantic Version Parser', () => {
  it('parses version bounds correctly', () => {
    const semver = new SemanticVersion();
    expect(semver.isCompatible('1.0.0', '1.2.3')).toBe(true);
    expect(semver.isCompatible('1.0.0', '2.0.0')).toBe(false);
  });
});

describe('API Compatibility', () => {
  it('detects added and removed methods', () => {
    const api = new APICompatibility();
    const changes = api.compare(['enqueue', 'dequeue'], ['enqueue', 'purge']);
    expect(changes.find((c) => c.type === 'removed')?.method).toBe('dequeue');
    expect(changes.find((c) => c.type === 'added')?.method).toBe('purge');
  });
});

describe('Breaking Change Detector', () => {
  it('categorizes breaking changes', () => {
    const detector = new BreakingChangeDetector();
    const changes = detector.detect([
      { method: 'dequeue', type: 'removed' },
      { method: 'purge', type: 'added' },
    ]);
    expect(changes).toHaveLength(1);
  });
});

describe('Migration Analyzer', () => {
  it('generates migration plans', () => {
    const analyzer = new MigrationAnalyzer();
    const plan = analyzer.analyze('p1', '1.0.0', '2.0.0', ['removed dequeue']);
    expect(plan.breakingChanges).toContain('removed dequeue');
  });
});

describe('Deprecation Manager', () => {
  it('tracks deprecated versions', () => {
    const manager = new DeprecationManager();
    manager.deprecate('1.0.0', '1.1.0');
    expect(manager.isDeprecated('1.0.0')).toBe(true);
    expect(manager.getDeprecation('1.0.0')?.replacement).toBe('1.1.0');
    manager.clear();
    expect(manager.isDeprecated('1.0.0')).toBe(false);
  });
});

describe('Release Policy', () => {
  it('evaluates release requirements', () => {
    const policy = new ReleasePolicy();
    expect(policy.validateStatus('Stable', 75, true)).toBe(true);
    expect(policy.validateStatus('Stable', 50, true)).toBe(false);
    expect(policy.validateStatus('Stable', 95, false)).toBe(false);
    expect(policy.validateStatus('UnknownStatus' as any, 95, true)).toBe(false);
  });
});

describe('Compatibility Score Calculator', () => {
  it('evaluates cumulative compatibility score', () => {
    const calc = new CompatibilityScoreCalculator();
    const score = calc.calculate({
      api: 100,
      runtime: 100,
      feature: 100,
      performance: 100,
      security: 100,
    });
    expect(score.overall).toBe(100);
  });
});

describe('Release Registry', () => {
  let registry: ReleaseRegistry;

  beforeEach(() => {
    registry = new ReleaseRegistry();
  });

  it('registers and resolves releases', () => {
    const manifest = { providerId: 'p1', releaseStatus: 'Stable' } as any;
    registry.register(manifest);
    expect(registry.resolve('p1')).toBeDefined();
    expect(registry.isReleaseCompatible('p1')).toBe(true);

    registry.clear();
    expect(registry.resolve('p1')).toBeUndefined();
  });

  it('throws on duplicate register', () => {
    const manifest = { providerId: 'p1' } as any;
    registry.register(manifest);
    expect(() => registry.register(manifest)).toThrow(RegistryError);
  });
});

describe('Compatibility Matrix', () => {
  it('stores and asserts cross compatibility', () => {
    const matrix = new CompatibilityMatrix();
    matrix.setCompatibility('p1', 'r1', true);
    expect(matrix.isCompatible('p1', 'r1')).toBe(true);
    expect(matrix.getMatrix()['p1']['r1']).toBe(true);
  });
});

describe('Compatibility Engine Orchestration', () => {
  let engine: CompatibilityEngine;
  const manifest: ProviderManifest = {
    id: 'memory-queue',
    name: 'Memory Queue',
    version: '1.0.0',
    type: 'queue',
    capabilities: ['enqueue', 'dequeue'],
    dependencies: {},
    supportedRuntimeVersions: ['1.0.0'],
  };

  beforeEach(() => {
    engine = new CompatibilityEngine();
  });

  it('validates and certifies compatible release', async () => {
    const result = await engine.validateAndCertify(manifest, '1.0.0', 'Stable', [
      'enqueue',
      'dequeue',
    ]);
    expect(result.certificate.status).toBe('VALID');
    expect(engine.registry.isReleaseCompatible('memory-queue')).toBe(true);

    // Test Development status coverage in the same isolated engine
    const devResult = await engine.validateAndCertify(
      { ...manifest, id: 'test-dev', name: 'Test Dev' },
      '1.0.0',
      'Development',
      ['enqueue', 'dequeue'],
    );
    expect(devResult.manifest.releaseStatus).toBe('Development');
  });

  it('throws IncompatibleVersionError on runtime version mismatch', async () => {
    await expect(engine.validateAndCertify(manifest, '2.0.0', 'Stable')).rejects.toThrow(
      IncompatibleVersionError,
    );
  });

  it('throws BreakingChangeError when breaking changes are detected', async () => {
    await expect(
      engine.validateAndCertify(manifest, '1.0.0', 'Stable', ['enqueue', 'dequeue', 'purge']),
    ).rejects.toThrow(BreakingChangeError);
  });

  it('throws CertificationFailedError when policy is not met', async () => {
    // Override policy validation mock to force a failure
    vi.spyOn(engine['policy'], 'validateStatus').mockReturnValue(false);
    await expect(engine.validateAndCertify(manifest, '1.0.0', 'Production')).rejects.toThrow(
      CertificationFailedError,
    );
  });

  it('generates upgrade planner correctly', () => {
    const plan = engine.generateUpgradePlan(manifest, '1.0.0', []);
    expect(plan.providerId).toBe('memory-queue');
  });
});
