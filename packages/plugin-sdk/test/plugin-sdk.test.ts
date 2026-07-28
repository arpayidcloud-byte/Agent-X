import { describe, it, expect, beforeEach } from 'vitest';
import {
  PluginRegistry,
  validateManifest,
  ManifestValidationError,
  PluginNotFoundError,
  PluginRoleCollisionError,
} from '../src/index.js';
import type { PluginManifest } from '../src/index.js';

const validAgentManifest: PluginManifest = {
  id: 'docs-agent',
  version: '0.1.0',
  kind: 'agent',
  declaredAgentRole: 'docs',
  entryPoint: './plugins/docs-agent/index.js',
};

const validToolManifest: PluginManifest = {
  id: 'yaml-tool',
  version: '1.0.0',
  kind: 'tool',
  declaredToolCategories: ['fs.read', 'fs.write'],
  entryPoint: './plugins/yaml-tool/index.js',
};

const validProviderManifest: PluginManifest = {
  id: 'local-llama',
  version: '0.2.0',
  kind: 'provider',
  entryPoint: './plugins/local-llama/index.js',
};

describe('validateManifest', () => {
  it('accepts valid agent manifest', () => {
    expect(() => validateManifest(validAgentManifest)).not.toThrow();
  });

  it('accepts valid tool manifest', () => {
    expect(() => validateManifest(validToolManifest)).not.toThrow();
  });

  it('accepts valid provider manifest', () => {
    expect(() => validateManifest(validProviderManifest)).not.toThrow();
  });

  it('rejects missing id', () => {
    expect(() => validateManifest({ ...validAgentManifest, id: '' })).toThrow(
      ManifestValidationError,
    );
  });

  it('rejects missing version', () => {
    expect(() => validateManifest({ ...validAgentManifest, version: '' })).toThrow(
      ManifestValidationError,
    );
  });

  it('rejects invalid kind', () => {
    expect(() => validateManifest({ ...validAgentManifest, kind: 'invalid' as any })).toThrow(
      ManifestValidationError,
    );
  });

  it('rejects agent without declaredAgentRole', () => {
    const { declaredAgentRole, ...rest } = validAgentManifest;
    expect(() => validateManifest(rest as PluginManifest)).toThrow(ManifestValidationError);
  });

  it('rejects agent with reserved role', () => {
    expect(() => validateManifest({ ...validAgentManifest, declaredAgentRole: 'coding' })).toThrow(
      ManifestValidationError,
    );
  });

  it('rejects tool without declaredToolCategories', () => {
    const { declaredToolCategories, ...rest } = validToolManifest;
    expect(() => validateManifest(rest as PluginManifest)).toThrow(ManifestValidationError);
  });

  it('rejects missing entryPoint', () => {
    expect(() => validateManifest({ ...validAgentManifest, entryPoint: '' })).toThrow(
      ManifestValidationError,
    );
  });
});

describe('PluginRegistry', () => {
  let registry: PluginRegistry;
  beforeEach(() => {
    registry = new PluginRegistry();
  });

  it('installs a plugin with pending-review status', () => {
    const reg = registry.install(validAgentManifest);
    expect(reg.status).toBe('pending-review');
    expect(reg.manifest.id).toBe('docs-agent');
  });

  it('rejects duplicate installs', () => {
    registry.install(validAgentManifest);
    expect(() => registry.install(validAgentManifest)).toThrow('already installed');
  });

  it('approves a pending plugin', () => {
    registry.install(validAgentManifest);
    const reg = registry.approve('docs-agent', 'Looks good');
    expect(reg.status).toBe('enabled');
    expect(reg.reviewNotes).toBe('Looks good');
    expect(reg.enabledAt).toBeDefined();
  });

  it('rejects a pending plugin', () => {
    registry.install(validAgentManifest);
    const reg = registry.reject('docs-agent');
    expect(reg.status).toBe('rejected');
  });

  it('disables and re-enables a plugin', () => {
    registry.install(validAgentManifest);
    registry.approve('docs-agent');
    registry.disable('docs-agent');
    expect(registry.get('docs-agent')!.status).toBe('disabled');
    registry.enable('docs-agent');
    expect(registry.get('docs-agent')!.status).toBe('enabled');
  });

  it('uninstalls a disabled plugin', () => {
    registry.install(validAgentManifest);
    registry.approve('docs-agent');
    registry.disable('docs-agent');
    expect(registry.uninstall('docs-agent')).toBe(true);
    expect(registry.get('docs-agent')).toBeUndefined();
  });

  it('cannot uninstall a pending-review plugin', () => {
    registry.install(validAgentManifest);
    expect(() => registry.uninstall('docs-agent')).toThrow('cannot be uninstalled');
  });

  it('filters by kind', () => {
    registry.install(validAgentManifest);
    registry.install(validToolManifest);
    registry.install(validProviderManifest);
    expect(registry.getByKind('agent')).toHaveLength(1);
    expect(registry.getByKind('tool')).toHaveLength(1);
    expect(registry.getByKind('provider')).toHaveLength(1);
  });

  it('filters by status', () => {
    registry.install(validAgentManifest);
    registry.install(validToolManifest);
    registry.approve('yaml-tool');
    expect(registry.getByStatus('pending-review')).toHaveLength(1);
    expect(registry.getByStatus('enabled')).toHaveLength(1);
  });

  it('throws PluginNotFoundError for unknown plugin', () => {
    expect(() => registry.approve('nonexistent')).toThrow(PluginNotFoundError);
  });

  it('cannot approve an already enabled plugin', () => {
    registry.install(validAgentManifest);
    registry.approve('docs-agent');
    expect(() => registry.approve('docs-agent')).toThrow('not pending review');
  });

  it('returns all registrations', () => {
    registry.install(validAgentManifest);
    registry.install(validToolManifest);
    expect(registry.getAll()).toHaveLength(2);
  });
});
