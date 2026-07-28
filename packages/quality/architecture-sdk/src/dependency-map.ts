/**
 * @module architecture-sdk/dependency-map
 * @description Dependency mapping and direction validation.
 */

import type { DependencyNode } from './interfaces.js';

export class DependencyMap {
  private nodes: DependencyNode[] = [];

  addDependency(
    source: string,
    target: string,
    type: 'required' | 'optional' | 'peer' | 'dev' = 'required',
  ): void {
    this.nodes.push({ source, target, type });
  }

  getDependencies(): DependencyNode[] {
    return [...this.nodes];
  }

  validate(): boolean {
    // Basic verification: No forbidden reverse imports (e.g. core runtime importing adapters)
    for (const node of this.nodes) {
      if (node.source === 'core-runtime' && node.target === 'runtime-adapters') {
        return false;
      }
      if (node.source === 'runtime' && node.target === 'native-providers') {
        return false;
      }
    }
    return true;
  }
}
