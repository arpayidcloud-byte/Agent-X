/**
 * @module workflow-engine/validator-coverage.test
 * @description Additional test coverage for validator module.
 */

import { describe, it, expect } from 'vitest';
import {
  validateNodeConfig,
  validateEdges,
  createNode,
  WorkflowValidationError,
} from '../src/index.js';

describe('Validator Coverage - Node Config', () => {
  it('rejects conditional node without condition', () => {
    const node = createNode('cond-1', 'conditional', 'Check Condition', {
      type: 'conditional',
      condition: '',
      trueBranch: 'yes-branch',
      falseBranch: 'no-branch',
    });

    expect(() => validateNodeConfig(node)).toThrow(WorkflowValidationError);
    expect(() => validateNodeConfig(node)).toThrow('Conditional node cond-1 must have a condition');
  });

  it('rejects conditional node without branches', () => {
    const node = createNode('cond-2', 'conditional', 'Check Branches', {
      type: 'conditional',
      condition: 'x > 0',
      trueBranch: '',
      falseBranch: '',
    });

    expect(() => validateNodeConfig(node)).toThrow(WorkflowValidationError);
    expect(() => validateNodeConfig(node)).toThrow(
      'Conditional node cond-2 must have both true and false branches',
    );
  });

  it('rejects loop node with maxIterations <= 0', () => {
    const nodeZero = createNode('loop-1', 'loop', 'Loop Zero', {
      type: 'loop',
      iterator: 'i',
      maxIterations: 0,
      body: ['step-1'],
    });

    expect(() => validateNodeConfig(nodeZero)).toThrow(WorkflowValidationError);
    expect(() => validateNodeConfig(nodeZero)).toThrow(
      'Loop node loop-1 must have maxIterations > 0',
    );

    const nodeNegative = createNode('loop-2', 'loop', 'Loop Negative', {
      type: 'loop',
      iterator: 'i',
      maxIterations: -5,
      body: ['step-1'],
    });

    expect(() => validateNodeConfig(nodeNegative)).toThrow(WorkflowValidationError);
    expect(() => validateNodeConfig(nodeNegative)).toThrow(
      'Loop node loop-2 must have maxIterations > 0',
    );
  });
});

describe('Validator Coverage - Edges', () => {
  it('rejects edge with source not existing', () => {
    const nodeIds = new Set(['node-1', 'node-2']);
    const edges = [
      {
        source: 'non-existent-source',
        target: 'node-1',
        condition: 'test',
      },
    ];

    expect(() => validateEdges(edges, nodeIds)).toThrow(WorkflowValidationError);
    expect(() => validateEdges(edges, nodeIds)).toThrow(
      'Edge references non-existent source node: non-existent-source',
    );
  });

  it('rejects edge with target not existing', () => {
    const nodeIds = new Set(['node-1', 'node-2']);
    const edges = [
      {
        source: 'node-1',
        target: 'non-existent-target',
        condition: 'test',
      },
    ];

    expect(() => validateEdges(edges, nodeIds)).toThrow(WorkflowValidationError);
    expect(() => validateEdges(edges, nodeIds)).toThrow(
      'Edge references non-existent target node: non-existent-target',
    );
  });

  it('accepts valid edges', () => {
    const nodeIds = new Set(['node-1', 'node-2', 'node-3']);
    const edges = [
      {
        source: 'node-1',
        target: 'node-2',
        condition: 'test',
      },
      {
        source: 'node-2',
        target: 'node-3',
      },
    ];

    expect(() => validateEdges(edges, nodeIds)).not.toThrow();
  });

  it('rejects edge with both source and target not existing', () => {
    const nodeIds = new Set(['node-1']);
    const edges = [
      {
        source: 'missing-source',
        target: 'missing-target',
      },
    ];

    expect(() => validateEdges(edges, nodeIds)).toThrow(WorkflowValidationError);
  });
});
