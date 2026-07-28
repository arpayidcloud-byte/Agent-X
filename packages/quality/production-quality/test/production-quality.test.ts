/**
 * @module production-quality/production-quality.test
 * @description Comprehensive unit and integration verification matching targets (>99% coverage).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  QualityEngine,
  CoverageValidator,
  MutationValidator,
  BranchValidator,
  EdgeCaseValidator,
  FailurePathValidator,
  DeterministicValidator,
  RaceConditionValidator,
  ResourceValidator,
  TimeoutValidator,
  RetryValidator,
  AuditValidator,
  EventValidator,
  SnapshotValidator,
  ChecksumValidator,
  DependencyValidator,
  QualityGates,
  QualityRules,
  QualityError,
  QualityGateError,
  DeterministicError,
  ResourceValidationError,
  DependencyError,
} from '../src/index.js';

describe('Quality Errors', () => {
  it('covers error instantiation', () => {
    const errs = [QualityGateError, DeterministicError, ResourceValidationError, DependencyError];

    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }

    const base = new QualityError('msg', 'code', 'src');
    expect(base.message).toBe('msg');
    expect(base.source).toBe('src');
    expect(base.code).toBe('code');
  });
});

describe('Coverage Validator', () => {
  it('validates correct and incorrect coverages', () => {
    const validator = new CoverageValidator();
    expect(
      validator.validate({ statements: 99, branches: 95, functions: 100, lines: 99 }).passed,
    ).toBe(true);

    expect(() =>
      validator.validate({ statements: 98, branches: 95, functions: 100, lines: 99 }),
    ).toThrow(QualityGateError);
    expect(() =>
      validator.validate({ statements: 99, branches: 90, functions: 100, lines: 99 }),
    ).toThrow(QualityGateError);
    expect(() =>
      validator.validate({ statements: 99, branches: 95, functions: 99, lines: 99 }),
    ).toThrow(QualityGateError);
    expect(() =>
      validator.validate({ statements: 99, branches: 95, functions: 100, lines: 98 }),
    ).toThrow(QualityGateError);
  });
});

describe('Mutation and Branch Validators', () => {
  it('validates mutation rate', () => {
    const validator = new MutationValidator();
    expect(validator.validate(90, 100).passed).toBe(true);
    expect(validator.validate(80, 100).passed).toBe(false);
    expect(validator.validate(0, 0).passed).toBe(true);
  });

  it('validates uncovered branch lists', () => {
    const validator = new BranchValidator();
    expect(validator.validate([]).passed).toBe(true);
    const result = validator.validate(['branch-1', 'branch-2']);
    expect(result.passed).toBe(false);
    expect(result.score).toBe(90);
  });
});

describe('Edge Case and Failure Validators', () => {
  it('validates required edge cases', () => {
    const validator = new EdgeCaseValidator();
    const all = [
      'null',
      'undefined',
      'empty_array',
      'empty_object',
      'invalid_id',
      'duplicate_id',
      'expired_session',
    ];
    expect(validator.validate(all).passed).toBe(true);

    const missing = validator.validate(['null']);
    expect(missing.passed).toBe(false);
    expect(missing.score).toBe(40);
  });

  it('validates required fail-closed failure scenarios', () => {
    const validator = new FailurePathValidator();
    const all = [
      'ProviderFailure',
      'WorkflowFailure',
      'AgentCrash',
      'ToolFailure',
      'QueueFailure',
      'StorageFailure',
      'LockFailure',
    ];
    expect(validator.validate(all).passed).toBe(true);

    const missing = validator.validate(['ProviderFailure']);
    expect(missing.passed).toBe(false);
    expect(missing.score).toBe(10);
  });
});

describe('Deterministic and Race Condition Validators', () => {
  it('validates identical outputs', () => {
    const validator = new DeterministicValidator();
    expect(validator.validate([{ a: 1 }, { a: 1 }]).passed).toBe(true);
    expect(validator.validate([{ a: 1 }]).passed).toBe(true);
    expect(() => validator.validate([{ a: 1 }, { a: 2 }])).toThrow(DeterministicError);
  });

  it('validates concurrent parallel runs', () => {
    const validator = new RaceConditionValidator();
    expect(validator.validate([true, true]).passed).toBe(true);

    const result = validator.validate([true, false]);
    expect(result.passed).toBe(false);
    expect(result.score).toBe(80);
  });
});

describe('Resource, Timeout, and Retry Validators', () => {
  it('validates resource usage bounds', () => {
    const validator = new ResourceValidator();
    const usage = { cpuUsagePercent: 50, memoryUsageMb: 256, tokens: 1000, cost: 10 };
    const ceilings = { maxCpu: 80, maxMemory: 512, maxTokens: 2000, maxCost: 20 };

    expect(validator.validate(usage, ceilings).passed).toBe(true);

    expect(() => validator.validate({ ...usage, cpuUsagePercent: 90 }, ceilings)).toThrow(
      ResourceValidationError,
    );
    expect(() => validator.validate({ ...usage, memoryUsageMb: 600 }, ceilings)).toThrow(
      ResourceValidationError,
    );
    expect(() => validator.validate({ ...usage, tokens: 3000 }, ceilings)).toThrow(
      ResourceValidationError,
    );
    expect(() => validator.validate({ ...usage, cost: 50 }, ceilings)).toThrow(
      ResourceValidationError,
    );
  });

  it('validates timeouts', () => {
    const validator = new TimeoutValidator();
    expect(validator.validate([{ component: 'c1', durationMs: 10, timeoutMs: 20 }]).passed).toBe(
      true,
    );

    const invalid = validator.validate([{ component: 'c1', durationMs: 30, timeoutMs: 20 }]);
    expect(invalid.passed).toBe(false);
    expect(invalid.score).toBe(90);
  });

  it('validates retry logic', () => {
    const validator = new RetryValidator();
    expect(validator.validate({ count: 1, maxRetries: 3, exhausted: false }).passed).toBe(true);

    const invalidExhaust = validator.validate({ count: 3, maxRetries: 3, exhausted: false });
    expect(invalidExhaust.passed).toBe(false);

    const exceedBudget = validator.validate({ count: 4, maxRetries: 3, exhausted: true });
    expect(exceedBudget.passed).toBe(false);
  });
});

describe('Audit, Event, Snapshot, Checksum and Dependency Validators', () => {
  it('validates audits', () => {
    const validator = new AuditValidator();
    const logs = [{ traceId: 't1', timestamp: new Date(), sessionId: 's1', metadata: {} }];
    expect(validator.validate(logs).passed).toBe(true);

    const badLogs = [
      { traceId: '', timestamp: new Date(), sessionId: 's1', metadata: {} } as any,
      { traceId: 't1', timestamp: undefined, sessionId: 's1', metadata: {} } as any,
      { traceId: 't1', timestamp: new Date(), sessionId: '', metadata: {} } as any,
    ];
    expect(validator.validate(badLogs).passed).toBe(false);
  });

  it('validates event envelopes', () => {
    const validator = new EventValidator();
    const events = [
      {
        traceId: 't1',
        timestamp: new Date(),
        sessionId: 's1',
        workflowId: 'w1',
        correlationId: 'c1',
        source: 'src',
        version: '1.0',
        payload: {},
      },
    ];
    expect(validator.validate(events).passed).toBe(true);

    const badEvents = [
      {
        traceId: '',
        timestamp: new Date(),
        sessionId: 's',
        workflowId: 'w',
        correlationId: 'c',
        source: 's',
        version: 'v',
        payload: {},
      } as any,
      {
        traceId: 't',
        timestamp: undefined,
        sessionId: 's',
        workflowId: 'w',
        correlationId: 'c',
        source: 's',
        version: 'v',
        payload: {},
      } as any,
      {
        traceId: 't',
        timestamp: new Date(),
        sessionId: '',
        workflowId: 'w',
        correlationId: 'c',
        source: 's',
        version: 'v',
        payload: {},
      } as any,
      {
        traceId: 't',
        timestamp: new Date(),
        sessionId: 's',
        workflowId: '',
        correlationId: 'c',
        source: 's',
        version: 'v',
        payload: {},
      } as any,
      {
        traceId: 't',
        timestamp: new Date(),
        sessionId: 's',
        workflowId: 'w',
        correlationId: '',
        source: 's',
        version: 'v',
        payload: {},
      } as any,
      {
        traceId: 't',
        timestamp: new Date(),
        sessionId: 's',
        workflowId: 'w',
        correlationId: 'c',
        source: '',
        version: 'v',
        payload: {},
      } as any,
      {
        traceId: 't',
        timestamp: new Date(),
        sessionId: 's',
        workflowId: 'w',
        correlationId: 'c',
        source: 's',
        version: '',
        payload: {},
      } as any,
    ];
    expect(validator.validate(badEvents).passed).toBe(false);
  });

  it('validates snapshot immutability', () => {
    const validator = new SnapshotValidator();
    const snap = Object.freeze({ id: '1', checksum: 'abc' });
    expect(validator.validate(snap).passed).toBe(true);

    const nonFrozen = { id: '1', checksum: 'abc' };
    expect(validator.validate(nonFrozen).passed).toBe(false);
    expect(validator.validate({ id: '1' } as any).passed).toBe(false);
  });

  it('validates SHA-256 checksums', () => {
    const validator = new ChecksumValidator();
    const expected = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'; // SHA256 of "hello"
    expect(validator.validate('hello', expected).passed).toBe(true);
    expect(validator.validate('hello', 'wrong').passed).toBe(false);
  });

  it('validates dependencies', () => {
    const validator = new DependencyValidator();
    expect(validator.validate({ runtime: ['shared'] }).passed).toBe(true);
    expect(() => validator.validate({ runtime: ['redis'] })).toThrow(DependencyError);
    expect(() => validator.validate({ runtime: ['runtime'] })).toThrow(DependencyError);
  });
});

describe('Rules and Gates', () => {
  it('covers quality gates and rules', () => {
    const gates = new QualityGates();
    expect(gates.validate({ statements: 99, branches: 95, functions: 100, lines: 99 }).passed).toBe(
      true,
    );

    const rules = new QualityRules();
    expect(rules.getGrade(100)).toBe('Production Elite');
    expect(rules.getGrade(97)).toBe('Production Ready');
    expect(rules.getGrade(92)).toBe('Enterprise Ready');
    expect(rules.getGrade(85)).toBe('Stable');
    expect(rules.getGrade(75)).toBe('Beta');
    expect(rules.getGrade(50)).toBe('Rejected');

    // Score calculations
    const scores = rules.calculateScore({
      coverage: 100,
      deterministic: 100,
      resource: 100,
      dependency: 100,
      timeout: 100,
      retry: 100,
      observability: 100,
      architecture: 100,
    });
    expect(scores.overallScore).toBe(100);
  });
});

describe('Quality Engine Orchestration', () => {
  let engine: QualityEngine;

  beforeEach(() => {
    engine = new QualityEngine();
  });

  it('orchestrates complete package validation successfully', async () => {
    const context = { traceId: 't1', packageId: 'pkg-1' };
    const coverage = { statements: 100, branches: 100, functions: 100, lines: 100 };

    const extra = {
      mutantsKilled: 95,
      totalMutants: 100,
      uncoveredBranches: [],
      edgeCases: [
        'null',
        'undefined',
        'empty_array',
        'empty_object',
        'invalid_id',
        'duplicate_id',
        'expired_session',
      ],
      failures: [
        'ProviderFailure',
        'WorkflowFailure',
        'AgentCrash',
        'ToolFailure',
        'QueueFailure',
        'StorageFailure',
        'LockFailure',
      ],
      deterministicOutputs: [{ a: 1 }, { a: 1 }],
      raceResults: [true, true],
      resourceUsage: { cpuUsagePercent: 50, memoryUsageMb: 256, tokens: 1000, cost: 10 },
      resourceCeilings: { maxCpu: 80, maxMemory: 512, maxTokens: 2000, maxCost: 20 },
      timeoutRuns: [{ component: 'c1', durationMs: 10, timeoutMs: 20 }],
      retries: { count: 1, maxRetries: 3, exhausted: false },
      auditLogs: [{ traceId: 't1', timestamp: new Date(), sessionId: 's1', metadata: {} }],
      events: [
        {
          traceId: 't1',
          timestamp: new Date(),
          sessionId: 's1',
          workflowId: 'w1',
          correlationId: 'c1',
          source: 'src',
          version: '1.0',
          payload: {},
        },
      ],
      snapshot: Object.freeze({ id: '1', checksum: 'abc' }),
      checksumData: 'hello',
      expectedChecksum: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      dependencies: { runtime: ['shared'] },
    };

    const report = await engine.validatePackage(context, coverage, extra);
    expect(report.grade).toBe('Production Elite');
    expect(engine.metrics.getMetrics().totalValidations).toBe(1);
    expect(engine.metrics.getMetrics().totalFailures).toBe(0);

    engine.metrics.reset();
    expect(engine.metrics.getMetrics().totalValidations).toBe(0);
  });

  it('orchestrates package validation warning correctly', async () => {
    const context = { traceId: 't1', packageId: 'pkg-1' };
    const coverage = { statements: 100, branches: 100, functions: 100, lines: 100 };
    const extra = {
      mutantsKilled: 10,
      totalMutants: 100,
      uncoveredBranches: Array(20).fill('br'),
      edgeCases: ['null'],
      failures: ['ProviderFailure'],
      deterministicOutputs: [{ a: 1 }, { a: 1 }],
      raceResults: Array(20).fill(false),
      resourceUsage: { cpuUsagePercent: 50, memoryUsageMb: 256, tokens: 1000, cost: 10 },
      resourceCeilings: { maxCpu: 80, maxMemory: 512, maxTokens: 2000, maxCost: 20 },
      timeoutRuns: Array(10).fill({ component: 'c1', durationMs: 50, timeoutMs: 20 }),
      retries: { count: 50, maxRetries: 3, exhausted: false },
      auditLogs: Array(10).fill({ traceId: '', timestamp: undefined, sessionId: '', metadata: {} }),
      events: [
        {
          traceId: 't1',
          timestamp: new Date(),
          sessionId: 's1',
          workflowId: 'w1',
          correlationId: 'c1',
          source: 'src',
          version: '1.0',
          payload: {},
        },
      ],
      snapshot: Object.freeze({ id: '1', checksum: 'abc' }),
      checksumData: 'hello',
      expectedChecksum: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      dependencies: { runtime: ['shared'] },
    };
    const report = await engine.validatePackage(context, coverage, extra);
    expect(report.grade).toBe('Rejected');
  });
});
