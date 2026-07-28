/**
 * @module workflow-engine/graph
 * @description Graph models and utilities for workflow execution.
 */

import type {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowEdge,
  NodeConfig,
  RetryPolicy,
} from './interfaces.js';

/** @description Node types in a workflow graph */
type NodeType =
  'task' | 'approval' | 'conditional' | 'loop' | 'parallel' | 'tool' | 'agent' | 'retry';

/**
 * Creates a new workflow definition
 */
export function createWorkflow(
  id: string,
  name: string,
  createdBy: string,
  nodes: WorkflowNode[] = [],
  edges: WorkflowEdge[] = [],
): WorkflowDefinition {
  const now = new Date();
  return {
    id,
    name,
    version: 1,
    nodes,
    edges,
    variables: {},
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy,
      traceId: `trace-${Date.now()}`,
    },
  };
}

/**
 * Creates a new workflow node
 */
export function createNode(
  id: string,
  type: NodeType,
  name: string,
  config: NodeConfig,
  options?: { timeout?: number; retryPolicy?: RetryPolicy },
): WorkflowNode {
  return {
    id,
    type,
    name,
    config,
    timeout: options?.timeout,
    retryPolicy: options?.retryPolicy,
  };
}

/**
 * Creates a new workflow edge
 */
export function createEdge(source: string, target: string, condition?: string): WorkflowEdge {
  return { source, target, condition };
}

/**
 * Topological sort for DAG execution
 */
export function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    adjacency.get(edge.source)?.push(edge.target);
  }

  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree.entries() as IterableIterator<[string, number]>) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  const sorted: WorkflowNode[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  while (queue.length > 0) {
    const current: string = queue.shift() as string;
    const node = nodeMap.get(current);
    if (node) sorted.push(node);

    for (const neighbor of adjacency.get(current) || []) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (sorted.length !== nodes.length) {
    throw new Error('Cycle detected in graph');
  }

  return sorted;
}

/**
 * Detects cycles in the graph
 */
export function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
  }

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    for (const neighbor of adjacency.get(nodeId) || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

/**
 * Gets all predecessors of a node
 */
export function getPredecessors(nodeId: string, edges: WorkflowEdge[]): string[] {
  return edges.filter((e) => e.target === nodeId).map((e) => e.source);
}

/**
 * Gets all successors of a node
 */
export function getSuccessors(nodeId: string, edges: WorkflowEdge[]): string[] {
  return edges.filter((e) => e.source === nodeId).map((e) => e.target);
}

/**
 * Checks if a node is ready (all predecessors completed)
 */
export function isNodeReady(
  nodeId: string,
  edges: WorkflowEdge[],
  completedNodes: Set<string>,
): boolean {
  const predecessors = getPredecessors(nodeId, edges);
  return predecessors.every((p) => completedNodes.has(p));
}

/**
 * Finds all ready nodes
 */
export function findReadyNodes(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  completedNodes: Set<string>,
  activeNodes: Set<string>,
): WorkflowNode[] {
  return nodes.filter(
    (n) =>
      !completedNodes.has(n.id) &&
      !activeNodes.has(n.id) &&
      isNodeReady(n.id, edges, completedNodes),
  );
}
