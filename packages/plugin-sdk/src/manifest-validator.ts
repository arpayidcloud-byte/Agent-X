import type { PluginManifest } from './interfaces.js';
import { ManifestValidationError } from './errors.js';

const RESERVED_ROLES = ['coding', 'review', 'test', 'security'];

export function validateManifest(manifest: PluginManifest): void {
  if (!manifest.id || typeof manifest.id !== 'string') {
    throw new ManifestValidationError('Plugin id is required and must be a string');
  }
  if (!manifest.version || typeof manifest.version !== 'string') {
    throw new ManifestValidationError(`Plugin '${manifest.id}': version is required`, manifest.id);
  }
  if (!['agent', 'tool', 'provider'].includes(manifest.kind)) {
    throw new ManifestValidationError(
      `Plugin '${manifest.id}': kind must be 'agent', 'tool', or 'provider'`,
      manifest.id,
    );
  }
  if (!manifest.entryPoint || typeof manifest.entryPoint !== 'string') {
    throw new ManifestValidationError(
      `Plugin '${manifest.id}': entryPoint is required`,
      manifest.id,
    );
  }

  if (manifest.kind === 'agent') {
    if (!manifest.declaredAgentRole) {
      throw new ManifestValidationError(
        `Plugin '${manifest.id}': declaredAgentRole is required for agent plugins`,
        manifest.id,
      );
    }
    if (RESERVED_ROLES.includes(manifest.declaredAgentRole)) {
      throw new ManifestValidationError(
        `Plugin '${manifest.id}': role '${manifest.declaredAgentRole}' is reserved (v0.1 roster)`,
        manifest.id,
      );
    }
  }

  if (manifest.kind === 'tool') {
    if (!manifest.declaredToolCategories || manifest.declaredToolCategories.length === 0) {
      throw new ManifestValidationError(
        `Plugin '${manifest.id}': declaredToolCategories is required for tool plugins`,
        manifest.id,
      );
    }
  }
}
