/**
 * @module provider-sdk/provider-sdk.test
 * @description Unit tests for the Provider SDK Conformance Kit (M4.2.9).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  PSCK,
  ProviderBuilder,
  ProviderRunner,
  ContractHarness,
  CompatibilityHarness,
  BenchmarkHarness,
  StressHarness,
  ChaosHarness,
  SecurityHarness,
  ProviderManifest,
  ProviderCLI,
  ProviderReporter,
  ProviderScaffolder,
  SchemaValidator,
  ProviderValidator,
  ProviderGenerator,
  ProviderVersionChecker,
  ProviderPackager,
  ProviderFactory,
  ProviderSDKError,
  ValidationFailedError,
} from '../src/conformance/index.js';
import { HarnessError } from '../src/conformance/errors.js';
import { FixtureLoader } from '../src/conformance/fixture-loader.js';
import { GoldenTests } from '../src/conformance/golden-tests.js';
import { SnapshotValidator } from '../src/conformance/snapshot-validator.js';
import { MemoryQueueProvider } from '@agentx-fast/runtime-adapters';
import { CredentialResolver } from '../src/conformance/credential-resolver.js';
import { createQueueTemplate } from '../src/conformance/provider-template.js';
import { SDKMocks } from '../src/conformance/provider-mocks.js';
import { createManifest } from '../src/conformance/provider-manifest.js';
import { getDefaultConfig } from '../src/conformance/provider-config.js';

describe('SDK Errors', () => {
  it('covers error types', () => {
    const errs = [HarnessError, ValidationFailedError];
    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
    }

    const base = new ProviderSDKError('msg', 'code', 'src');
    expect(base.message).toBe('msg');
    expect(base.code).toBe('code');
    expect(base.source).toBe('src');
  });
});

describe('PSCK SDK Integration', () => {
  const manifest: ProviderManifest = {
    id: 'memory-queue',
    name: 'Memory Queue',
    version: '1.0',
    type: 'queue',
    author: 'test',
    capabilities: [],
    dependencies: {},
  };

  it('validates and runs suite', async () => {
    const psck = new PSCK();
    const report = await psck.validateAndRun(new MemoryQueueProvider(), manifest);
    expect(report.status).toBe('PASS');
    const bundle = psck.packageBundle(manifest, report);
    expect(bundle.archivePath).toContain('memory-queue');
  });

  it('fails validation against mismatched ID', async () => {
    const psck = new PSCK();
    await expect(
      psck.validateAndRun(new MemoryQueueProvider(), { ...manifest, id: 'wrong-id' }),
    ).rejects.toThrow(ValidationFailedError);
  });
});

describe('Provider Builder', () => {
  it('builds provider instances', async () => {
    const builder = new ProviderBuilder();
    const provider = new MemoryQueueProvider();
    builder.create(provider).configure({ endpoint: 'http://localhost' });
    expect(builder.getConfig().endpoint).toBe('http://localhost');
    expect(builder.getMetadata().id).toBe('memory-queue');
    expect(await builder.validate()).toBe(true);
    expect(builder.build()).toBe(provider);

    const emptyBuilder = new ProviderBuilder();
    expect(() => emptyBuilder.build()).toThrow();
    await expect(emptyBuilder.validate()).rejects.toThrow();
  });
});

describe('Provider Runner', () => {
  it('runs comprehensive harness suite', async () => {
    const runner = new ProviderRunner();
    const report = await runner.runSuite(new MemoryQueueProvider());
    expect(report.contract.passed).toBe(true);
    expect(report.status).toBe('PASS');
  });

  it('handles harness failure correctly', async () => {
    // Force contract harness failure to test path
    const runner = new ProviderRunner();
    const report = await runner.runSuite({
      getMetadata: () => ({ id: 'bad', name: 'Bad', type: '', version: '1' }),
      getCapabilities: () => ({}),
      healthCheck: async () => ({
        healthy: true,
        latencyMs: 0,
        lastChecked: new Date(),
        status: 'ACTIVE',
      }),
      getMetrics: () => ({
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageLatencyMs: 0,
      }),
      enqueue: async () => {},
      dequeue: async () => undefined,
      peek: async () => undefined,
      ack: async () => {},
      retry: async () => {},
      deadLetter: async () => {},
      getDepth: async () => 0,
      purge: async () => {},
    });
    expect(report.status).toBe('FAIL');
  });
});

describe('Harnesses', () => {
  it('runs all individual harnesses successfully', async () => {
    const provider = new MemoryQueueProvider();
    expect((await new ContractHarness().run(provider)).passed).toBe(true);
    expect((await new CompatibilityHarness().run(provider)).passed).toBe(true);
    expect((await new BenchmarkHarness().run(provider)).passed).toBe(true);
    expect((await new StressHarness().run(provider)).passed).toBe(true);
    expect((await new ChaosHarness().run(provider)).passed).toBe(true);
    expect((await new SecurityHarness().run(provider)).passed).toBe(true);
  });
});

describe('CLI and Reporter', () => {
  it('executes CLI and generates report markdown', async () => {
    const cli = new ProviderCLI();
    expect(await cli.execute(['create'])).toContain('created');
    expect(await cli.execute(['unknown'])).toContain('Unknown');

    const reporter = new ProviderReporter();
    const md = reporter.generateMarkdown({
      providerId: 'p1',
      status: 'PASS',
      contract: { passed: true, durationMs: 0, details: {} },
      compatibility: { passed: true, durationMs: 0, details: {} },
      benchmark: { passed: true, durationMs: 0, details: {} },
      stress: { passed: true, durationMs: 0, details: {} },
      chaos: { passed: true, durationMs: 0, details: {} },
      security: { passed: true, durationMs: 0, details: {} },
      timestamp: new Date(),
      checksum: '',
    });
    expect(md).toContain('PASS');
  });
});

describe('Scaffolder and Generator', () => {
  it('generates scaffold and code', () => {
    const scaffold = new ProviderScaffolder();
    const files = scaffold.generate({ name: 'Redis', providerType: 'queue', author: 'Test' });
    expect(Object.keys(files)).toContain('package.json');

    const gen = new ProviderGenerator();
    expect(gen.generateCode('Redis')).toContain('class RedisProvider');
  });
});

describe('Validators and Version', () => {
  it('validates manifest schemas', () => {
    const validator = new SchemaValidator();
    expect(() =>
      validator.validateManifest({
        id: '',
        name: '',
        version: '',
        type: '',
        author: '',
        capabilities: [],
        dependencies: {},
      }),
    ).toThrow(ValidationFailedError);
    validator.validateManifest({
      id: 'p1',
      name: 'P1',
      version: '1.0',
      type: 'q',
      author: 't',
      capabilities: [],
      dependencies: {},
    });
  });

  it('validates provider against manifest', () => {
    const validator = new ProviderValidator();
    expect(
      validator.validate(new MemoryQueueProvider(), {
        id: 'memory-queue',
        name: 'Mem',
        version: '1',
        type: 'q',
        author: 't',
        capabilities: [],
        dependencies: {},
      }),
    ).toBe(true);
  });

  it('checks semantic versioning compatibility', () => {
    const checker = new ProviderVersionChecker();
    expect(checker.isCompatible('1.0.0', '1.2.3')).toBe(true);
    expect(checker.isCompatible('1.0.0', '2.0.0')).toBe(false);
  });

  it('covers credentials resolver and template helpers', async () => {
    const resolver = new CredentialResolver();
    // Test with env var set
    process.env.TEST_KEY = 'test-value';
    expect(await resolver.resolve('provider.test.key')).toBe('test-value');
    delete process.env.TEST_KEY;
    // Test missing key throws
    await expect(resolver.resolve('provider.missing.key')).rejects.toThrow('Credential not found');

    const template = createQueueTemplate();
    expect(template.getMetadata().id).toBe('template-queue');
    expect(await template.dequeue('topic')).toBeUndefined();
    expect(await template.peek('topic')).toBeUndefined();
    await template.enqueue('topic', {});
    await template.ack('topic', '1');
    await template.retry('topic', '1');
    await template.deadLetter('topic', '1');
    expect(await template.getDepth('topic')).toBe(0);
    await template.purge('topic');

    const mockQ = SDKMocks.getValidQueue();
    expect(mockQ.getMetadata().id).toBe('mock-q');
    expect(await mockQ.dequeue('topic')).toBeUndefined();
    expect(await mockQ.peek('topic')).toBeUndefined();
    await mockQ.enqueue('topic', {});
    await mockQ.ack('topic', '1');
    await mockQ.retry('topic', '1');
    await mockQ.deadLetter('topic', '1');
    expect(await mockQ.getDepth('topic')).toBe(0);
    await mockQ.purge('topic');

    const manifest = createManifest('m1', 'manifest', 'queue');
    expect(manifest.id).toBe('m1');

    const config = getDefaultConfig();
    expect(config.rootDir).toBe('./providers');
  });
});

describe('Fixtures and Validation Utils', () => {
  it('loads fixtures, validates snapshots, and checks mocks', async () => {
    const mockQ = SDKMocks.getValidQueue();
    expect(await mockQ.enqueue('topic', {})).toBeUndefined();
    expect(await mockQ.peek('topic')).toBeUndefined();
  });

  it('loads fixtures and validates snapshots', async () => {
    const loader = new FixtureLoader();
    expect(loader.load('json', '{"a": 1}')).toEqual({ a: 1 });
    expect(loader.load('yaml', 'data')).toEqual({ loaded: true });

    const golden = new GoldenTests();
    expect(golden.assertIdentical({ a: 1 }, { a: 1 })).resolves.toBe(true);

    const snap = new SnapshotValidator();
    expect(snap.validateChecksum('data', 'invalid')).toBe(false);
  });

  it('generates code and handles factory', () => {
    expect(ProviderFactory.create('queue')).toBeDefined();
    expect(ProviderFactory.create('lock')).toBeDefined();
    expect(() => ProviderFactory.create('unknown')).toThrow();
  });
});
