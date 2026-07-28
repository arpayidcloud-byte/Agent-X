/**
 * @module architecture-sdk/package-registry
 * @description Master registry of all canonical M4 packages.
 */

import type { PackageMetadata } from './interfaces.js';

export class PackageRegistry {
  private packages = new Map<string, PackageMetadata>();

  register(pkg: PackageMetadata): void {
    this.packages.set(pkg.id, pkg);
  }

  get(id: string): PackageMetadata | undefined {
    return this.packages.get(id);
  }

  getAll(): PackageMetadata[] {
    return Array.from(this.packages.values());
  }
}
