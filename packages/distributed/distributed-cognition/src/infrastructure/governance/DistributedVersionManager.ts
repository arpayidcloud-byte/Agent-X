export interface VersionInfo {
  readonly packageName: string;
  readonly version: string;
  readonly compatibleVersions: readonly string[];
  readonly deprecatedVersions: readonly string[];
}

export class DistributedVersionManager {
  private versions = new Map<string, VersionInfo>();

  register(info: VersionInfo): void {
    this.versions.set(info.packageName, Object.freeze({ ...info }));
  }

  isCompatible(packageName: string, version: string): boolean {
    const info = this.versions.get(packageName);
    if (!info) return false;
    if (info.deprecatedVersions.includes(version)) return false;
    if (info.version === version) return true;
    return info.compatibleVersions.includes(version);
  }

  getVersion(packageName: string): VersionInfo | undefined {
    return this.versions.get(packageName);
  }

  getAll(): VersionInfo[] {
    return Array.from(this.versions.values());
  }

  deprecate(packageName: string, version: string): void {
    const info = this.versions.get(packageName);
    if (!info) return;
    const updated = { ...info, deprecatedVersions: [...info.deprecatedVersions, version] };
    this.versions.set(packageName, Object.freeze(updated));
  }
}
