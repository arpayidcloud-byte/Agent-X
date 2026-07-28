import type { DistributedVersionManager } from './DistributedVersionManager.js';

export interface CompatibilityCheck {
  readonly packageName: string;
  readonly version: string;
  readonly compatible: boolean;
  readonly checkedAt: Date;
}

export class DistributedCompatibilityValidator {
  private checks: CompatibilityCheck[] = [];

  constructor(private versionManager: DistributedVersionManager) {}

  validate(packageName: string, version: string): CompatibilityCheck {
    const compatible = this.versionManager.isCompatible(packageName, version);
    const check: CompatibilityCheck = Object.freeze({
      packageName,
      version,
      compatible,
      checkedAt: new Date(),
    });
    this.checks.push(check);
    return check;
  }

  validateAll(): CompatibilityCheck[] {
    const versions = this.versionManager.getAll();
    return versions.flatMap((v) =>
      v.compatibleVersions.map((cv) => this.validate(v.packageName, cv)),
    );
  }

  getChecks(): CompatibilityCheck[] {
    return [...this.checks];
  }

  getFailures(): CompatibilityCheck[] {
    return this.checks.filter((c) => !c.compatible);
  }
}
