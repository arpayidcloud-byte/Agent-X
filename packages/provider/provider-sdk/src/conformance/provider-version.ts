/**
 * @module provider-sdk/provider-version
 * @description PSCK compliant semantic version checker.
 */

export class ProviderVersionChecker {
  isCompatible(v1: string, v2: string): boolean {
    const [maj1] = v1.split('.').map(Number);
    const [maj2] = v2.split('.').map(Number);
    return maj1 === maj2;
  }
}
