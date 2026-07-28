/**
 * @module provider-release/compatibility-matrix
 * @description Generates cross-compatibility matrices.
 */

export class CompatibilityMatrix {
  private matrix: Record<string, Record<string, boolean>> = {};

  setCompatibility(provider: string, runtime: string, compatible: boolean): void {
    if (!this.matrix[provider]) {
      this.matrix[provider] = {};
    }
    (this.matrix[provider] as Record<string, boolean>)[runtime] = compatible;
  }

  isCompatible(provider: string, runtime: string): boolean {
    return (
      !!this.matrix[provider] &&
      (this.matrix[provider] as Record<string, boolean>)[runtime] === true
    );
  }

  getMatrix(): Record<string, Record<string, boolean>> {
    return { ...this.matrix };
  }
}
