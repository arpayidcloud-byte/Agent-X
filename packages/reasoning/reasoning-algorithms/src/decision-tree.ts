/**
 * @module reasoning-algorithms/decision-tree
 * @description Immutable decision tree traversal and validation.
 */

import type { DecisionTree } from './interfaces.js';
import { IntegrityError } from './errors.js';

export class DecisionTreeEngine {
  traverse(tree: DecisionTree, inputs: Record<string, unknown>): string[] {
    const path: string[] = [];
    let currentNodeId = tree.rootNodeId;

    while (currentNodeId) {
      const node = tree.nodes.get(currentNodeId);
      if (!node) {
        throw new IntegrityError(`Missing node ID: ${currentNodeId}`, 'decision-tree');
      }

      path.push(node.id);

      if (node.type === 'leaf') {
        return path;
      }

      const branch = node.branches.find((b) => inputs[b.condition]);
      if (!branch) {
        throw new IntegrityError(`No matching branch for node: ${node.id}`, 'decision-tree');
      }

      currentNodeId = branch.targetNodeId;
    }

    return path;
  }
}
