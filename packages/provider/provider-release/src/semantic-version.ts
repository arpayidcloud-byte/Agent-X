/**
 * @module provider-release/semantic-version
 * @description Validates version bounds and semver conventions.
 */

export class SemanticVersion {
  parse(v: string) {
    const parts = v.split('.');
    const major = parseInt(parts[0] as string, 10);
    const minor = parseInt(parts[1] as string, 10);
    const patch = parseInt(parts[2] as string, 10);
    return { major, minor, patch };
  }

  isCompatible(v1: string, v2: string): boolean {
    const p1 = this.parse(v1);
    const p2 = this.parse(v2);
    return p1.major === p2.major;
  }
}
