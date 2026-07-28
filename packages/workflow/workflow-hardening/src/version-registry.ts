/**
 * @module workflow-hardening/version-registry
 * @description Workflow version management.
 */

import type { WorkflowVersion } from './interfaces.js';
import { VersionRollbackError } from './errors.js';
import { createHash } from 'crypto';

export class WorkflowVersionRegistry {
  private versions = new Map<string, WorkflowVersion>();
  private frozen = new Set<string>();

  register(id: string, version: string, type: WorkflowVersion['type'] = 'minor'): WorkflowVersion {
    const wfVersion: WorkflowVersion = {
      id,
      version,
      type,
      checksum: createHash('sha256').update(`${id}:${version}`).digest('hex'),
      frozenAt: new Date(),
    };
    this.versions.set(`${id}:${version}`, wfVersion);
    return wfVersion;
  }

  freeze(id: string, version: string): void {
    this.frozen.add(`${id}:${version}`);
  }

  get(id: string, version: string): WorkflowVersion | undefined {
    return this.versions.get(`${id}:${version}`);
  }

  rollback(id: string, version: string): boolean {
    if (this.frozen.has(`${id}:${version}`)) {
      throw new VersionRollbackError(
        `Cannot rollback frozen version ${id}:${version}`,
        'version-registry',
      );
    }
    this.versions.delete(`${id}:${version}`);
    return true;
  }

  history(): WorkflowVersion[] {
    return Array.from(this.versions.values());
  }
}
