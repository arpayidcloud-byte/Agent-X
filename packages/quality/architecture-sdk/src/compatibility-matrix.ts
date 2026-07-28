/**
 * @module architecture-sdk/compatibility-matrix
 * @description Renders canonical package compatibility matrix.
 */

import type { CompatibilityMatrix } from './interfaces.js';

export class CompatibilityMatrixManager {
  private matrix: Record<string, Record<string, boolean>> = {};

  setCompatibility(source: string, target: string, compatible: boolean): void {
    if (!this.matrix[source]) {
      this.matrix[source] = {};
    }
    (this.matrix[source] as Record<string, boolean>)[target] = compatible;
  }

  getMatrix(): CompatibilityMatrix {
    return {
      packages: Object.keys(this.matrix),
      matrix: { ...this.matrix },
    };
  }
}
