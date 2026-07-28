import type { PluginManifest, PluginLoadResult } from './interfaces.js';
import type { PluginRegistry } from './plugin-registry.js';
import { validateManifest } from './manifest-validator.js';

export class PluginLoader {
  constructor(private readonly registry: PluginRegistry) {}

  load(manifest: PluginManifest): PluginLoadResult {
    validateManifest(manifest);

    if (!manifest.entryPoint) {
      return { success: false, error: 'Plugin entryPoint must not be empty' };
    }

    const registration = this.registry.get(manifest.id);
    if (!registration) {
      return { success: false, error: `Plugin '${manifest.id}' is not registered` };
    }

    if (registration.status !== 'enabled') {
      return {
        success: false,
        error: `Plugin '${manifest.id}' is not enabled (status: ${registration.status})`,
      };
    }

    return { success: true };
  }

  unload(pluginId: string): void {
    const registration = this.registry.get(pluginId);
    if (!registration) return;
    if (registration.status === 'enabled') {
      this.registry.disable(pluginId);
    }
  }
}
