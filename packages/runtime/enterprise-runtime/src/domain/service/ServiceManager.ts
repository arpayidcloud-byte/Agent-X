import { createHash } from 'crypto';
import { InvariantViolationError } from '../shared/errors.js';

export interface ServiceEntry {
  readonly serviceId: string;
  readonly name: string;
  readonly version: string;
  readonly status: 'REGISTERED' | 'ACTIVE' | 'INACTIVE' | 'ERROR';
  readonly registeredAt: Date;
  readonly checksum: string;
}

export class ServiceRegistry {
  private services = new Map<string, ServiceEntry>();

  register(name: string, version: string): ServiceEntry {
    const serviceId = `svc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ serviceId, name, version }))
      .digest('hex');
    const entry: ServiceEntry = Object.freeze({
      serviceId,
      name,
      version,
      status: 'ACTIVE',
      registeredAt: new Date(),
      checksum,
    });
    this.services.set(serviceId, entry);
    return entry;
  }

  unregister(serviceId: string): boolean {
    return this.services.delete(serviceId);
  }

  get(serviceId: string): ServiceEntry | undefined {
    return this.services.get(serviceId);
  }

  getAll(): ServiceEntry[] {
    return Array.from(this.services.values());
  }

  findByName(name: string): ServiceEntry | undefined {
    for (const entry of this.services.values()) {
      if (entry.name === name) return entry;
    }
    return undefined;
  }
}

export class ServiceDiscovery {
  constructor(private registry: ServiceRegistry) {}

  discover(name: string): ServiceEntry[] {
    return this.registry.getAll().filter((s) => s.name === name && s.status === 'ACTIVE');
  }

  discoverAll(): ServiceEntry[] {
    return this.registry.getAll().filter((s) => s.status === 'ACTIVE');
  }
}

export interface PluginEntry {
  readonly pluginId: string;
  readonly name: string;
  readonly version: string;
  readonly enabled: boolean;
  readonly loadedAt: Date;
  readonly checksum: string;
}

export class PluginManager {
  private plugins = new Map<string, PluginEntry>();

  load(name: string, version: string): PluginEntry {
    const pluginId = `plug-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ pluginId, name, version }))
      .digest('hex');
    const entry: PluginEntry = Object.freeze({
      pluginId,
      name,
      version,
      enabled: true,
      loadedAt: new Date(),
      checksum,
    });
    this.plugins.set(pluginId, entry);
    return entry;
  }

  unload(pluginId: string): boolean {
    return this.plugins.delete(pluginId);
  }

  enable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin)
      throw new InvariantViolationError(
        `Plugin not found: ${pluginId}`,
        'PLUGIN_NOT_FOUND',
        'PluginManager',
      );
    const updated: PluginEntry = Object.freeze({ ...plugin, enabled: true });
    this.plugins.set(pluginId, updated);
  }

  disable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin)
      throw new InvariantViolationError(
        `Plugin not found: ${pluginId}`,
        'PLUGIN_NOT_FOUND',
        'PluginManager',
      );
    const updated: PluginEntry = Object.freeze({ ...plugin, enabled: false });
    this.plugins.set(pluginId, updated);
  }

  get(pluginId: string): PluginEntry | undefined {
    return this.plugins.get(pluginId);
  }

  getAll(): PluginEntry[] {
    return Array.from(this.plugins.values());
  }

  getEnabled(): PluginEntry[] {
    return this.getAll().filter((p) => p.enabled);
  }
}

export class ExtensionManager {
  private extensions = new Map<string, Record<string, unknown>>();

  register(name: string, config: Record<string, unknown>): void {
    this.extensions.set(name, { ...config });
  }

  unregister(name: string): boolean {
    return this.extensions.delete(name);
  }

  get(name: string): Record<string, unknown> | undefined {
    const ext = this.extensions.get(name);
    return ext ? { ...ext } : undefined;
  }

  getAll(): Record<string, Record<string, unknown>> {
    const result: Record<string, Record<string, unknown>> = {};
    for (const [k, v] of this.extensions) result[k] = { ...v };
    return result;
  }
}
