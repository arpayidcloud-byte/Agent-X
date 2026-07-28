/**
 * @module workflow-engine/errors-coverage.test
 * @description Additional test coverage for errors module.
 */

import { describe, it, expect } from 'vitest';
import {
  WorkflowError,
  WorkflowCompilationError,
  DeadlockDetectedError,
  WorkflowExecutionError,
  WorkflowTimeoutError,
  SnapshotError,
  ResumeError,
  WorkflowValidationError,
  CycleDetectedError,
  NodeNotFoundError,
} from '../src/index.js';

describe('Workflow Errors', () => {
  describe('WorkflowError', () => {
    it('creates base WorkflowError with message and code', () => {
      const error = new WorkflowError('Test error message', 'TEST_ERROR');

      expect(error.message).toBe('Test error message');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('WorkflowError');
    });

    it('preserves stack trace', () => {
      const error = new WorkflowError('Stack test', 'STACK_TEST');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('errors-coverage.test.ts');
    });
  });

  describe('WorkflowCompilationError', () => {
    it('creates WorkflowCompilationError with correct code', () => {
      const error = new WorkflowCompilationError('Compilation failed');

      expect(error.message).toBe('Compilation failed');
      expect(error.code).toBe('WORKFLOW_COMPILATION_ERROR');
      expect(error.name).toBe('WorkflowCompilationError');
    });

    it('extends WorkflowError', () => {
      const error = new WorkflowCompilationError('Test');

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('DeadlockDetectedError', () => {
    it('creates DeadlockDetectedError with default message', () => {
      const error = new DeadlockDetectedError();

      expect(error.message).toBe('Deadlock detected in workflow execution');
      expect(error.code).toBe('DEADLOCK_DETECTED');
      expect(error.name).toBe('DeadlockDetectedError');
    });

    it('creates DeadlockDetectedError with custom message', () => {
      const error = new DeadlockDetectedError('Custom deadlock message');

      expect(error.message).toBe('Custom deadlock message');
      expect(error.code).toBe('DEADLOCK_DETECTED');
    });

    it('extends WorkflowError', () => {
      const error = new DeadlockDetectedError();

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('WorkflowExecutionError', () => {
    it('creates WorkflowExecutionError with nodeId and reason', () => {
      const error = new WorkflowExecutionError('node-1', 'Invalid input');

      expect(error.message).toBe('Execution failed at node node-1: Invalid input');
      expect(error.code).toBe('WORKFLOW_EXECUTION_ERROR');
      expect(error.name).toBe('WorkflowExecutionError');
    });

    it('includes nodeId and reason in message', () => {
      const error = new WorkflowExecutionError('task-42', 'Timeout exceeded');

      expect(error.message).toContain('task-42');
      expect(error.message).toContain('Timeout exceeded');
    });

    it('extends WorkflowError', () => {
      const error = new WorkflowExecutionError('n1', 'reason');

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('WorkflowTimeoutError', () => {
    it('creates WorkflowTimeoutError with workflowId and timeoutMs', () => {
      const error = new WorkflowTimeoutError('wf-123', 30000);

      expect(error.message).toBe('Workflow wf-123 timed out after 30000ms');
      expect(error.code).toBe('WORKFLOW_TIMEOUT');
      expect(error.name).toBe('WorkflowTimeoutError');
    });

    it('includes timeout value in message', () => {
      const error = new WorkflowTimeoutError('wf-456', 60000);

      expect(error.message).toContain('60000ms');
    });

    it('extends WorkflowError', () => {
      const error = new WorkflowTimeoutError('wf-1', 1000);

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('SnapshotError', () => {
    it('creates SnapshotError with message', () => {
      const error = new SnapshotError('Failed to create snapshot');

      expect(error.message).toBe('Failed to create snapshot');
      expect(error.code).toBe('SNAPSHOT_ERROR');
      expect(error.name).toBe('SnapshotError');
    });

    it('handles various error messages', () => {
      const error1 = new SnapshotError('Snapshot corrupted');
      const error2 = new SnapshotError('Unable to restore snapshot');

      expect(error1.message).toBe('Snapshot corrupted');
      expect(error2.message).toBe('Unable to restore snapshot');
      expect(error1.code).toBe('SNAPSHOT_ERROR');
      expect(error2.code).toBe('SNAPSHOT_ERROR');
    });

    it('extends WorkflowError', () => {
      const error = new SnapshotError('Test');

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('ResumeError', () => {
    it('creates ResumeError with message', () => {
      const error = new ResumeError('Failed to resume workflow');

      expect(error.message).toBe('Failed to resume workflow');
      expect(error.code).toBe('RESUME_ERROR');
      expect(error.name).toBe('ResumeError');
    });

    it('handles various resume error messages', () => {
      const error1 = new ResumeError('Checkpoint not found');
      const error2 = new ResumeError('Invalid snapshot state');

      expect(error1.message).toBe('Checkpoint not found');
      expect(error2.message).toBe('Invalid snapshot state');
      expect(error1.code).toBe('RESUME_ERROR');
      expect(error2.code).toBe('RESUME_ERROR');
    });

    it('extends WorkflowError', () => {
      const error = new ResumeError('Test');

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('WorkflowValidationError', () => {
    it('creates WorkflowValidationError with correct code', () => {
      const error = new WorkflowValidationError('Validation failed');

      expect(error.message).toBe('Validation failed');
      expect(error.code).toBe('WORKFLOW_VALIDATION_ERROR');
      expect(error.name).toBe('WorkflowValidationError');
    });

    it('extends WorkflowError', () => {
      const error = new WorkflowValidationError('Test');

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('CycleDetectedError', () => {
    it('creates CycleDetectedError with default message', () => {
      const error = new CycleDetectedError();

      expect(error.message).toBe('Cycle detected in workflow graph');
      expect(error.code).toBe('CYCLE_DETECTED');
    });

    it('creates CycleDetectedError with custom message', () => {
      const error = new CycleDetectedError('Custom cycle message');

      expect(error.message).toBe('Custom cycle message');
    });

    it('extends WorkflowError', () => {
      const error = new CycleDetectedError();

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('NodeNotFoundError', () => {
    it('creates NodeNotFoundError with nodeId', () => {
      const error = new NodeNotFoundError('missing-node');

      expect(error.message).toBe('Node not found: missing-node');
      expect(error.code).toBe('NODE_NOT_FOUND');
      expect(error.name).toBe('NodeNotFoundError');
    });

    it('includes nodeId in message', () => {
      const error = new NodeNotFoundError('node-42');

      expect(error.message).toContain('node-42');
    });

    it('extends WorkflowError', () => {
      const error = new NodeNotFoundError('n1');

      expect(error).toBeInstanceOf(WorkflowError);
    });
  });

  describe('Error inheritance chain', () => {
    it('all custom errors extend WorkflowError', () => {
      const errors = [
        new WorkflowCompilationError('Test'),
        new WorkflowValidationError('Test'),
        new CycleDetectedError(),
        new DeadlockDetectedError(),
        new NodeNotFoundError('n1'),
        new WorkflowExecutionError('n1', 'reason'),
        new WorkflowTimeoutError('wf-1', 1000),
        new SnapshotError('Test'),
        new ResumeError('Test'),
      ];

      for (const error of errors) {
        expect(error).toBeInstanceOf(WorkflowError);
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('all errors have proper name property', () => {
      const errorInstances = [
        { error: new WorkflowCompilationError('Test'), name: 'WorkflowCompilationError' },
        { error: new WorkflowValidationError('Test'), name: 'WorkflowValidationError' },
        { error: new CycleDetectedError(), name: 'CycleDetectedError' },
        { error: new DeadlockDetectedError(), name: 'DeadlockDetectedError' },
        { error: new NodeNotFoundError('n1'), name: 'NodeNotFoundError' },
        { error: new WorkflowExecutionError('n1', 'reason'), name: 'WorkflowExecutionError' },
        { error: new WorkflowTimeoutError('wf-1', 1000), name: 'WorkflowTimeoutError' },
        { error: new SnapshotError('Test'), name: 'SnapshotError' },
        { error: new ResumeError('Test'), name: 'ResumeError' },
      ];

      for (const { error, name } of errorInstances) {
        expect(error.name).toBe(name);
      }
    });
  });
});
