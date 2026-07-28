/**
 * @module reasoning-framework/reasoning-tree
 * @description Reasoning tree contracts.
 */

import type { ReasoningTree, TreeNode } from './interfaces.js';

export class ReasoningTreeManager {
  private tree: ReasoningTree = {
    nodes: [],
    edges: [],
    metadata: { depth: 0, branchingFactor: 0 },
  };

  addNode(node: TreeNode): void {
    this.tree.nodes.push(node);
  }

  getTree(): ReasoningTree {
    return { ...this.tree, nodes: [...this.tree.nodes] };
  }
}
