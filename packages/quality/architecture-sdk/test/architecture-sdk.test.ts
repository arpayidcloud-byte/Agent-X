/**
 * @module architecture-sdk/architecture-sdk.test
 * @description Comprehensive test suite for Architecture Freeze and SDK components.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ArchitectureFreeze,
  DependencyMap,
  PackageRegistry,
  ExtensionPoints,
  PluginSDK,
  ProviderSDK,
  WorkflowSDK,
  AgentSDK,
  RuntimeSDK,
  EventSDK,
  ConfigurationSDK,
  VersionPolicyManager,
  MigrationEngine,
  CompatibilityMatrixManager,
  DocumentationGenerator,
  DiagramGenerator,
  DeveloperValidator,
  ArchitectureReportBuilder,
  ArchitectureError,
  ValidationError,
  DependencyViolationError,
  FrozenStateError,
  PackageMetadata,
  DependencyNode,
  ArchitectureMetadata,
  ArchitectureReport,
} from '../src/index.js';

describe('Architecture Errors', () => {
  it('instantiates all error types correctly', () => {
    const errs = [ValidationError, DependencyViolationError, FrozenStateError];
    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }
    const base = new ArchitectureError('msg', 'CODE', 'src');
    expect(base.message).toBe('msg');
  });
});

describe('Architecture Freeze', () => {
  it('freezes metadata and verifies checksums', () => {
    const freeze = new ArchitectureFreeze();
    const meta: ArchitectureMetadata = {
      checksum: '',
      frozenAt: new Date(),
      version: '1.0',
      packages: [
        { id: 'p1', name: 'p', version: '1', description: '', status: 'active', checksum: '' },
      ],
      dependencies: [],
    };

    expect(freeze.verify(meta)).toBe(false);

    const report = freeze.freeze(meta);
    expect(report.status).toBe('VALID');
    expect(report.checksum).toBeDefined();

    expect(freeze.verify(meta)).toBe(true);
  });
});

describe('Dependency Map', () => {
  it('adds and validates dependencies successfully', () => {
    const map = new DependencyMap();
    map.addDependency('p1', 'p2', 'required');
    expect(map.getDependencies()).toHaveLength(1);
    expect(map.validate()).toBe(true);

    // Invalid inverse architecture dependency
    map.addDependency('core-runtime', 'runtime-adapters');
    expect(map.validate()).toBe(false);

    const map2 = new DependencyMap();
    map2.addDependency('runtime', 'native-providers');
    expect(map2.validate()).toBe(false);
  });
});

describe('Package Registry', () => {
  it('registers and retrieves packages', () => {
    const registry = new PackageRegistry();
    const pkg: PackageMetadata = {
      id: 'p1',
      name: 'N1',
      version: 'v1',
      description: 'desc',
      status: 'frozen',
      checksum: 'c',
    };
    registry.register(pkg);
    expect(registry.get('p1')).toEqual(pkg);
    expect(registry.getAll()).toHaveLength(1);
  });
});

describe('SDK Rules and Specifications', () => {
  it('returns valid extension points', () => {
    const ep = new ExtensionPoints();
    expect(ep.listExtensionPoints().length).toBeGreaterThan(0);
  });

  it('validates plugin manifests', () => {
    const sdk = new PluginSDK();
    expect(
      sdk.validate({
        id: '1',
        name: '',
        version: '1',
        lifecycle: 'start',
        capabilities: [],
        permissions: [],
        checksum: '',
      }),
    ).toBe(true);
    expect(
      sdk.validate({
        id: '',
        name: '',
        version: '1',
        lifecycle: 'start',
        capabilities: [],
        permissions: [],
        checksum: '',
      }),
    ).toBe(false);
  });

  it('validates provider manifests', () => {
    const sdk = new ProviderSDK();
    expect(
      sdk.validate({ id: '1', name: '', version: '', type: '', interfaces: ['i1'], checksum: '' }),
    ).toBe(true);
    expect(
      sdk.validate({ id: '', name: '', version: '', type: '', interfaces: ['i1'], checksum: '' }),
    ).toBe(false);
  });

  it('returns workflow SDK constraints', () => {
    expect(new WorkflowSDK().getConstraints().length).toBeGreaterThan(0);
  });

  it('returns agent SDK constraints', () => {
    expect(new AgentSDK().getConstraints().length).toBeGreaterThan(0);
  });

  it('returns runtime SDK lifecycle', () => {
    expect(new RuntimeSDK().getLifecycle().length).toBeGreaterThan(0);
  });

  it('returns event SDK specs', () => {
    expect(new EventSDK().getSpecs().length).toBeGreaterThan(0);
  });

  it('returns configuration SDK rules', () => {
    expect(new ConfigurationSDK().getRules().length).toBeGreaterThan(0);
  });
});

describe('Version Policy and Migration', () => {
  it('returns active version policies', () => {
    const policy = new VersionPolicyManager();
    expect(policy.getPolicy().major).toContain('Breaking API changes');
  });

  it('adds and retrieves migrations', () => {
    const engine = new MigrationEngine();
    engine.addMigration({
      from: '1',
      to: '2',
      breakingChanges: [],
      deprecations: [],
      replacements: {},
    });
    expect(engine.getMigrations()).toHaveLength(1);
  });
});

describe('Compatibility Matrix', () => {
  it('sets and gets compatibility grids', () => {
    const matrix = new CompatibilityMatrixManager();
    matrix.setCompatibility('p1', 'p2', true);
    const result = matrix.getMatrix();
    expect(result.packages).toContain('p1');
    expect(result.matrix['p1']['p2']).toBe(true);
  });
});

describe('Documentation and Diagram Generators', () => {
  it('generates text strings', () => {
    expect(new DocumentationGenerator().generateHandbook()).toContain('Handbook');
    expect(new DiagramGenerator().generateUML()).toContain('@startuml');
  });
});

describe('Developer Validator', () => {
  it('validates frozen vs active states', () => {
    const validator = new DeveloperValidator();
    const pkg: PackageMetadata = {
      id: 'p1',
      name: '',
      version: '',
      description: '',
      status: 'active',
      checksum: '',
    };
    expect(() => validator.validate(pkg, { p1: true })).toThrow(ValidationError);
    expect(() => validator.validate({ ...pkg, status: 'frozen' }, { p1: true })).not.toThrow();
  });
});

describe('Architecture Report Builder', () => {
  it('builds an immutable valid report', () => {
    const builder = new ArchitectureReportBuilder();
    const rep: ArchitectureReport = {
      id: '1',
      frozenAt: new Date(),
      checksum: '',
      status: 'BROKEN',
      metadata: {
        packages: [],
        dependencies: [],
        checksum: '',
        frozenAt: new Date(),
        version: '1',
      },
    };
    const final = builder.build(rep);
    expect(final.status).toBe('VALID');
    expect(final.checksum).toBeDefined();
  });
});
