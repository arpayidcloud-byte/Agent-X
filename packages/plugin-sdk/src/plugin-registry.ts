import type { PluginManifest, PluginRegistration, PluginStatus } from './interfaces.js';
import { PluginNotFoundError } from './errors.js';
import { validateManifest } from './manifest-validator.js';

export class PluginRegistry {
  private plugins = new Map<string, PluginRegistration>();

  install(manifest: PluginManifest): PluginRegistration {
    validateManifest(manifest);

    if (this.plugins.has(manifest.id)) {
      throw new Error(`Plugin '${manifest.id}' is already installed`);
    }

    const registration: PluginRegistration = {
      manifest,
      status: 'pending-review',
      installedAt: new Date(),
    };

    this.plugins.set(manifest.id, registration);
    return registration;
  }

  approve(pluginId: string, reviewNotes?: string): PluginRegistration {
    const reg = this.getOrThrow(pluginId);
    if (reg.status !== 'pending-review') {
      throw new Error(`Plugin '${pluginId}' is not pending review (current: ${reg.status})`);
    }
    const updated: PluginRegistration = {
      ...reg,
      status: 'enabled',
      enabledAt: new Date(),
      reviewNotes,
    };
    this.plugins.set(pluginId, updated);
    return updated;
  }

  reject(pluginId: string): PluginRegistration {
    const reg = this.getOrThrow(pluginId);
    if (reg.status !== 'pending-review') {
      throw new Error(`Plugin '${pluginId}' is not pending review (current: ${reg.status})`);
    }
    const updated: PluginRegistration = { ...reg, status: 'rejected' };
    this.plugins.set(pluginId, updated);
    return updated;
  }

  disable(pluginId: string): PluginRegistration {
    const reg = this.getOrThrow(pluginId);
    if (reg.status !== 'enabled') {
      throw new Error(`Plugin '${pluginId}' is not enabled (current: ${reg.status})`);
    }
    const updated: PluginRegistration = { ...reg, status: 'disabled' };
    this.plugins.set(pluginId, updated);
    return updated;
  }

  enable(pluginId: string): PluginRegistration {
    const reg = this.getOrThrow(pluginId);
    if (reg.status !== 'disabled') {
      throw new Error(`Plugin '${pluginId}' is not disabled (current: ${reg.status})`);
    }
    const updated: PluginRegistration = { ...reg, status: 'enabled', enabledAt: new Date() };
    this.plugins.set(pluginId, updated);
    return updated;
  }

  uninstall(pluginId: string): boolean {
    const reg = this.getOrThrow(pluginId);
    if (reg.status !== 'enabled' && reg.status !== 'disabled') {
      throw new Error(`Plugin '${pluginId}' cannot be uninstalled from status '${reg.status}'`);
    }
    return this.plugins.delete(pluginId);
  }

  get(pluginId: string): PluginRegistration | undefined {
    return this.plugins.get(pluginId);
  }

  getByKind(kind: string): PluginRegistration[] {
    return Array.from(this.plugins.values()).filter((p) => p.manifest.kind === kind);
  }

  getByStatus(status: PluginStatus): PluginRegistration[] {
    return Array.from(this.plugins.values()).filter((p) => p.status === status);
  }

  getAll(): PluginRegistration[] {
    return Array.from(this.plugins.values());
  }

  private getOrThrow(pluginId: string): PluginRegistration {
    const reg = this.plugins.get(pluginId);
    if (!reg) throw new PluginNotFoundError(pluginId);
    return reg;
  }
}
