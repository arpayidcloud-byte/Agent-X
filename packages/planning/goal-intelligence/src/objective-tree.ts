/**
 * @module goal-intelligence/objective-tree
 * @description Immutable objective hierarchy.
 */

import type { ObjectiveNode } from './interfaces.js';

export class ObjectiveTree {
  private nodes = new Map<string, ObjectiveNode>();

  addNode(node: ObjectiveNode): void {
    this.nodes.set(node.id, node);
  }

  getNode(id: string): ObjectiveNode | undefined {
    return this.nodes.get(id);
  }

  getChildren(id: string): ObjectiveNode[] {
    const node = this.nodes.get(id);
    if (!node) return [];
    return node.children.map((cid) => this.nodes.get(cid)).filter((n): n is ObjectiveNode => !!n);
  }

  getAll(): ObjectiveNode[] {
    return Array.from(this.nodes.values());
  }
}
