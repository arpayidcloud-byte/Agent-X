/**
 * @module workflow-hardening/workflow-hardening.test
 * @description Comprehensive tests for M5.5.1 Workflow Hardening, Replay & Recovery.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  WorkflowReplayEngine,
  ReplayValidator,
  WorkflowSnapshotDiff,
  WorkflowVersionRegistry,
  WorkflowCertificationEngine,
  RecoveryCertificationEngine,
  CompensationEngine,
  WorkflowIntegrityValidator,
  WorkflowAuditEngine,
  HardeningError,
  ReplayMismatchError,
  CheckpointCorruptionError,
  IntegrityError,
  CompensationError,
  CertificationError,
  VersionRollbackError,
  ReplayConfig,
  ReplayResult,
  SnapshotDiffResult,
  WorkflowVersion,
  WorkflowCertificate,
  RecoveryCertification,
  CompensationStep,
  WorkflowState,
} from '../src/index.js';

const replayResult = (overrides: Partial<ReplayResult> = {}): ReplayResult => ({
  sessionId: 's1',
  success: true,
  stepsExecuted: 3,
  checksumValid: true,
  stateValid: true,
  eventsValid: true,
  decisionsValid: true,
  deterministic: true,
  durationMs: 10,
  ...overrides,
});

const workflowState = (overrides: Partial<WorkflowState> = {}): WorkflowState => ({
  taskStates: { t1: 'DONE' },
  decisions: ['d1'],
  resources: { cpu: 1 },
  metrics: { time: 100 },
  ...overrides,
});

// ERRORS
describe('Hardening Errors', () => {
  it('instantiates all error types', () => {
    const errs = [
      ReplayMismatchError,
      CheckpointCorruptionError,
      IntegrityError,
      CompensationError,
      CertificationError,
      VersionRollbackError,
    ];
    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }
    const base = new HardeningError('msg', 'CODE', 'src');
    expect(base.code).toBe('CODE');
  });
});

// REPLAY ENGINE
describe('WorkflowReplayEngine', () => {
  let engine: WorkflowReplayEngine;
  beforeEach(() => {
    engine = new WorkflowReplayEngine();
  });

  it('executes full replay', async () => {
    const result = await engine.fullReplay('s1', ['step1', 'step2', 'step3']);
    expect(result.stepsExecuted).toBe(3);
    expect(result.deterministic).toBe(true);
    expect(engine.getHistory()).toHaveLength(1);
  });

  it('executes partial replay', async () => {
    const result = await engine.partialReplay('s1', ['step1', 'step2', 'step3'], 0, 2);
    expect(result.stepsExecuted).toBe(2);
  });

  it('replays from checkpoint', async () => {
    const result = await engine.replayFromCheckpoint('s1', { state: 'saved' });
    expect(result.stepsExecuted).toBe(1);
    expect(result.stateValid).toBe(true);
  });

  it('replays until step', async () => {
    const result = await engine.replayUntilStep('s1', ['s1', 's2', 's3'], 2);
    expect(result.stepsExecuted).toBe(2);
  });

  it('validates replay results', () => {
    expect(engine.validateReplay(replayResult())).toBe(true);
    expect(engine.validateReplay(replayResult({ deterministic: false }))).toBe(false);
  });

  it('replay with empty steps', async () => {
    const result = await engine.fullReplay('s_empty', []);
    expect(result.stepsExecuted).toBe(0);
  });

  it('multiple replays produce consistent history', async () => {
    await engine.fullReplay('s1', ['a', 'b']);
    await engine.fullReplay('s2', ['c', 'd']);
    expect(engine.getHistory()).toHaveLength(2);
  });

  it('replay with large steps', async () => {
    const steps = Array.from({ length: 100 }, (_, i) => `step-${i}`);
    const result = await engine.fullReplay('s_large', steps);
    expect(result.stepsExecuted).toBe(100);
  });
});

// REPLAY VALIDATOR
describe('ReplayValidator', () => {
  const validator = new ReplayValidator();

  it('validates deterministic replay', () => {
    const r1 = replayResult();
    const r2 = replayResult();
    expect(() => validator.validateDeterminism([r1, r2])).not.toThrow();
  });

  it('throws on mismatch', () => {
    const r1 = replayResult({ stepsExecuted: 5 });
    const r2 = replayResult({ stepsExecuted: 3 });
    expect(() => validator.validateDeterminism([r1, r2])).toThrow(ReplayMismatchError);
  });

  it('handles empty/single results', () => {
    expect(() => validator.validateDeterminism([])).not.toThrow();
    expect(() => validator.validateDeterminism([replayResult()])).not.toThrow();
  });

  it('validates replay integrity', () => {
    expect(() => validator.validateReplayIntegrity(replayResult())).not.toThrow();
    expect(() => validator.validateReplayIntegrity(replayResult({ deterministic: false }))).toThrow(
      ReplayMismatchError,
    );
  });

  it('compares replay results', () => {
    const a = replayResult();
    const b = replayResult();
    const c = replayResult({ stepsExecuted: 99 });
    expect(validator.compareResults(a, b)).toBe(true);
    expect(validator.compareResults(a, c)).toBe(false);
  });
});

// SNAPSHOT DIFF
describe('WorkflowSnapshotDiff', () => {
  const diff = new WorkflowSnapshotDiff();

  it('detects added, removed, modified', () => {
    const result = diff.diff({ a: 1, b: 2 }, { b: 3, c: 4 });
    expect(result.added).toContain('c');
    expect(result.removed).toContain('a');
    expect(result.modified).toContain('b');
  });

  it('identical snapshots', () => {
    expect(diff.diff({ x: 1, y: 2 }, { x: 1, y: 2 }).checksumDelta).toBe('identical');
  });

  it('empty snapshots', () => {
    const result = diff.diff({}, {});
    expect(result.executionDelta).toBe(0);
  });
});

// VERSION REGISTRY
describe('WorkflowVersionRegistry', () => {
  let reg: WorkflowVersionRegistry;
  beforeEach(() => {
    reg = new WorkflowVersionRegistry();
  });

  it('registers and retrieves versions', () => {
    reg.register('wf1', '1.0.0', 'minor');
    expect(reg.get('wf1', '1.0.0')).toBeDefined();
    expect(reg.history()).toHaveLength(1);
  });

  it('freezes and prevents rollback', () => {
    reg.register('wf1', '1.0.0');
    reg.freeze('wf1', '1.0.0');
    expect(() => reg.rollback('wf1', '1.0.0')).toThrow(VersionRollbackError);
  });

  it('allows rollback of non-frozen', () => {
    reg.register('wf1', '1.0.0');
    expect(reg.rollback('wf1', '1.0.0')).toBe(true);
    expect(reg.get('wf1', '1.0.0')).toBeUndefined();
  });

  it('retrieves undefined for missing', () => {
    expect(reg.get('m', '1.0.0')).toBeUndefined();
  });

  it('multiple versions of same workflow', () => {
    reg.register('wf1', '1.0.0', 'major');
    reg.register('wf1', '1.1.0', 'minor');
    expect(reg.history()).toHaveLength(2);
  });
});

// CERTIFICATION ENGINE
describe('WorkflowCertificationEngine', () => {
  const engine = new WorkflowCertificationEngine();

  it('certifies successfully', async () => {
    const cert = await engine.certify('wf1', workflowState(), '1.0.0');
    expect(cert.status).toBe('CERTIFIED');
    expect(cert.checksum).toBeDefined();
  });

  it('rejects empty state', async () => {
    const cert = await engine.certify('wf1', workflowState({ taskStates: {} }), '1.0.0');
    expect(cert.status).toBe('REJECTED');
    expect(cert.score).toBeLessThan(100);
    expect(cert.issues).toContain('Empty task states');
  });
});

// RECOVERY CERTIFICATION
describe('RecoveryCertificationEngine', () => {
  it('certifies recovery', async () => {
    const cert = await new RecoveryCertificationEngine().certifyRecovery('wf1');
    expect(cert.score).toBe(100);
    expect(cert.checksum).toBeDefined();
  });

  it('certifies empty workflow as valid', async () => {
    const cert = await new RecoveryCertificationEngine().certifyRecovery('');
    expect(cert.score).toBe(0);
    expect(cert.recoveryCorrectness).toBe(false);
  });
});

// COMPENSATION ENGINE
describe('CompensationEngine', () => {
  it('executes compensation steps', async () => {
    const engine = new CompensationEngine();
    const steps: CompensationStep[] = [
      { id: 's1', action: 'a', undoAction: 'ua', order: 2 },
      { id: 's2', action: 'b', undoAction: 'ub', order: 1 },
    ];
    const result = await engine.executeCompensation(steps);
    expect(result).toBe(true);
    expect(engine.getHistory()).toHaveLength(2);
  });

  it('fails on invalid compensation step', async () => {
    const engine = new CompensationEngine();
    const steps: CompensationStep[] = [{ id: 's1', action: '', undoAction: '', order: 1 }];
    const result = await engine.executeCompensation(steps);
    expect(result).toBe(false);
    expect(engine.getHistory()).toHaveLength(1);
    expect(engine.getHistory()[0].result).toBe(false);
  });

  it('fails on negative order', async () => {
    const engine = new CompensationEngine();
    const steps: CompensationStep[] = [{ id: 's1', action: 'a', undoAction: 'ua', order: -1 }];
    const result = await engine.executeCompensation(steps);
    expect(result).toBe(false);
  });
});

// INTEGRITY VALIDATOR
describe('WorkflowIntegrityValidator', () => {
  const v = new WorkflowIntegrityValidator();

  it('validates checksums', () => {
    const data = 'test';
    const hash = require('crypto').createHash('sha256').update(data).digest('hex');
    expect(() => v.validateChecksum(data, hash)).not.toThrow();
    expect(() => v.validateChecksum(data, 'wrong')).toThrow(IntegrityError);
  });

  it('validates state', () => {
    const s = workflowState();
    expect(() => v.validateStateIntegrity(s)).not.toThrow();
    expect(() => v.validateStateIntegrity({} as any)).toThrow(IntegrityError);
  });

  it('validates individual missing fields', () => {
    expect(() =>
      v.validateStateIntegrity({
        taskStates: undefined,
        decisions: [],
        resources: {},
        metrics: {},
      } as any),
    ).toThrow(IntegrityError);
    expect(() =>
      v.validateStateIntegrity({
        taskStates: {},
        decisions: undefined,
        resources: {},
        metrics: {},
      } as any),
    ).toThrow(IntegrityError);
    expect(() =>
      v.validateStateIntegrity({
        taskStates: {},
        decisions: [],
        resources: undefined,
        metrics: {},
      } as any),
    ).toThrow(IntegrityError);
    expect(() =>
      v.validateStateIntegrity({
        taskStates: {},
        decisions: [],
        resources: {},
        metrics: undefined,
      } as any),
    ).toThrow(IntegrityError);
  });

  it('validates graph', () => {
    expect(() => v.validateGraphIntegrity(['a', 'b'], [['a', 'b']])).not.toThrow();
    expect(() => v.validateGraphIntegrity(['a'], [['a', 'b']])).toThrow(IntegrityError);
  });
});

// AUDIT ENGINE
describe('WorkflowAuditEngine', () => {
  it('logs immutable entries', () => {
    const engine = new WorkflowAuditEngine();
    const entry = engine.log('exec', 'w1', 's1', 'done', { r: 1 });
    expect(entry.checksum).toBeDefined();
    expect(engine.getEntries()).toHaveLength(1);
  });
});

// HOOKS AND METRICS
describe('WorkflowOrchestration Coverage', () => {
  it('covers replay engine methods', async () => {
    const engine = new WorkflowReplayEngine();
    await engine.replayFromCheckpoint('s1', { state: 's' });
    expect(engine.getHistory()).toHaveLength(1);
  });

  it('covers compensation engine edge cases', async () => {
    const engine = new CompensationEngine();
    const result = await engine.executeCompensation([
      { id: 's1', action: 'a', undoAction: 'ua', order: 1 },
    ]);
    expect(result).toBe(true);
    expect(engine.getHistory()).toHaveLength(1);
  });

  it('covers snapshot diff edge cases', () => {
    const diff = new WorkflowSnapshotDiff();
    const result = diff.diff({ a: 1 }, { b: 2 });
    expect(result.added).toContain('b');
    expect(result.removed).toContain('a');
  });

  it('covers replay mismatch validator', () => {
    const validator = new ReplayValidator();
    expect(() => validator.validateDeterminism([])).not.toThrow();
    expect(() => validator.validateDeterminism([replayResult()])).not.toThrow();
  });

  it('covers integrity graph validation', () => {
    const v = new WorkflowIntegrityValidator();
    expect(() => v.validateGraphIntegrity(['a'], [])).not.toThrow();
  });

  it('covers recovery certification score branches', async () => {
    const cert = await new RecoveryCertificationEngine().certifyRecovery('wf1');
    expect(cert.recoveryCorrectness).toBe(true);
    expect(cert.checkpointRestoration).toBe(true);
    expect(cert.rollbackIntegrity).toBe(true);
    expect(cert.failureRecovery).toBe(true);
    expect(cert.retryCorrectness).toBe(true);
  });
});
