/**
 * @module vendor-certification/vendor-certification.test
 * @description Comprehensive unit tests matching >99% coverage targets (M4.3.5).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  CertificationEngine,
  ProviderValidator,
  ProviderHealthAudit,
  ProviderPerformanceAudit,
  ProviderSecurityAudit,
  ProviderReliabilityAudit,
  ProviderRecoveryAudit,
  ProviderVersionValidator,
  ProviderResourceValidator,
  ProviderReadinessScore,
  ProviderGrader,
  ProviderCertificate,
  ProviderRegistry,
  CertificationHistory,
  ReportGenerator,
  ChecksumGenerator,
  PlatformSignature,
  CertificationError,
  ValidationError,
  SecurityError,
  PerformanceError,
  VersionMismatchError,
  IntegrityError,
  IProvider,
  CertificationConfig,
} from '../src/index.js';

const MockValidProvider: IProvider = {
  getMetadata: () => ({ id: 'p1', name: 'Provider One', version: '1.0.0', type: 'queue' }),
  getCapabilities: () => ({ priorityQueue: true }),
  healthCheck: async () => ({
    healthy: true,
    latencyMs: 10,
    lastChecked: new Date(),
    status: 'UP',
  }),
};

const MockUnhealthyProvider: IProvider = {
  getMetadata: () => ({ id: 'p_bad', name: 'Bad Provider', version: '1.0.0', type: 'queue' }),
  getCapabilities: () => ({}),
  healthCheck: async () => ({
    healthy: false,
    latencyMs: 0,
    lastChecked: new Date(),
    status: 'DOWN',
  }),
};

describe('Certification Errors', () => {
  it('instantiates errors correctly', () => {
    const errs = [
      ValidationError,
      SecurityError,
      PerformanceError,
      VersionMismatchError,
      IntegrityError,
    ];

    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }

    const base = new CertificationError('msg', 'code', 'src');
    expect(base.message).toBe('msg');
    expect(base.source).toBe('src');
    expect(base.code).toBe('code');
  });
});

describe('Provider Validator', () => {
  it('validates valid providers', () => {
    const validator = new ProviderValidator();
    expect(() => validator.validate(MockValidProvider)).not.toThrow();
  });

  it('throws on missing interface', () => {
    const validator = new ProviderValidator();
    expect(() => validator.validate({} as any)).toThrow(ValidationError);
  });
});

describe('Provider Audits', () => {
  it('runs all audits', async () => {
    const audits = [
      new ProviderHealthAudit(),
      new ProviderPerformanceAudit(),
      new ProviderSecurityAudit(),
      new ProviderReliabilityAudit(),
      new ProviderRecoveryAudit(),
    ];

    for (const audit of audits) {
      const result = await audit.run(MockValidProvider);
      expect(result.passed).toBe(true);
    }
  });

  it('detects unhealthy provider', async () => {
    await expect(new ProviderHealthAudit().run(MockUnhealthyProvider)).rejects.toThrow(
      ValidationError,
    );
  });
});

describe('Validators and Score', () => {
  it('validates version', async () => {
    const vv = new ProviderVersionValidator();
    await expect(vv.run(MockValidProvider, '1.0.0')).resolves.toBeDefined();
    await expect(vv.run(MockValidProvider, '2.0.0')).rejects.toThrow(VersionMismatchError);
  });

  it('calculates readiness score', () => {
    const calc = new ProviderReadinessScore();
    const score = calc.calculate({
      performance: 100,
      reliability: 100,
      availability: 100,
      recovery: 100,
      security: 100,
      resourceEfficiency: 100,
      compatibility: 100,
      maintainability: 100,
      documentation: 100,
      observability: 100,
    });
    expect(score.overall).toBe(100);
  });

  it('determines grades', () => {
    const grader = new ProviderGrader();
    expect(grader.getGrade(95)).toBe('Production');
    expect(grader.getGrade(85)).toBe('Certified');
    expect(grader.getGrade(0)).toBe('Rejected');
  });
});

describe('Registry and History', () => {
  it('manages registry correctly', () => {
    const registry = new ProviderRegistry();
    const cert = {
      providerId: 'p1',
      providerVersion: '1',
      score: 100,
      grade: 'Production',
      signature: 'sig',
      issuedAt: new Date(),
      certificationVersion: '1.0',
      id: '1',
    };
    registry.register(cert);
    expect(registry.isRegistered('p1')).toBe(true);
    expect(() => registry.register(cert)).toThrow(IntegrityError);
    registry.clear();
    expect(registry.isRegistered('p1')).toBe(false);
  });

  it('manages history correctly', () => {
    const history = new CertificationHistory();
    history.add({ id: '1' } as any);
    expect(history.getAll()).toHaveLength(1);
    history.clear();
    expect(history.getAll()).toHaveLength(0);
  });
});

describe('Signature and Checksum', () => {
  it('generates signatures and checksums', () => {
    const sig = new PlatformSignature();
    expect(sig.sign('test')).toContain('sig-');

    const cs = new ChecksumGenerator();
    expect(cs.generate('data')).toBeDefined();
  });
});

describe('Certification Engine Orchestration', () => {
  let engine: CertificationEngine;
  const config: CertificationConfig = {
    platformVersion: '1.0.0',
    runtimeVersion: '1.0.0',
    requiredGrade: 'Production',
  };

  beforeEach(() => {
    engine = new CertificationEngine();
  });

  it('certifies valid providers', async () => {
    const cert = await engine.certify(MockValidProvider, config);
    expect(cert.score).toBe(96.5);
    expect(engine.registry.isRegistered('p1')).toBe(true);
    expect(engine.history.getAll()).toHaveLength(1);
  });

  it('rejects invalid providers', async () => {
    await expect(engine.certify(MockUnhealthyProvider, config)).rejects.toThrow(ValidationError);
  });
});
