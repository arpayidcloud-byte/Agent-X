/**
 * @module workflow-orchestration/workflow-state
 * @description State machine for workflow lifecycle.
 */

import type { WorkflowState } from './interfaces.js';
import { WorkflowStateError } from './errors.js';

const validTransitions: Record<WorkflowState, WorkflowState[]> = {
  CREATED: ['BUILDING'],
  BUILDING: ['VALIDATING', 'FAILED'],
  VALIDATING: ['READY', 'FAILED'],
  READY: ['SCHEDULING', 'CANCELLED'],
  SCHEDULING: ['DISPATCHING', 'PAUSED', 'CANCELLED'],
  DISPATCHING: ['EXECUTING', 'FAILED', 'CANCELLED'],
  EXECUTING: ['MONITORING', 'FAILED', 'CHECKPOINTING', 'PAUSED', 'CANCELLED'],
  MONITORING: ['EXECUTING', 'COMPLETED', 'REPLANNING', 'FAILED', 'PAUSED', 'CHECKPOINTING'],
  CHECKPOINTING: ['EXECUTING', 'REPLANNING', 'COMPLETED', 'FAILED'],
  REPLANNING: ['READY', 'EXECUTING', 'FAILED', 'CANCELLED'],
  COMPLETED: [],
  FAILED: ['REPLANNING', 'CANCELLED'],
  PAUSED: ['SCHEDULING', 'CANCELLED'],
  CANCELLED: [],
};

export class WorkflowStateMachine {
  private state: WorkflowState = 'CREATED';

  getState(): WorkflowState {
    return this.state;
  }

  transition(next: WorkflowState): void {
    if (!validTransitions[this.state]?.includes(next)) {
      throw new WorkflowStateError(
        `Invalid transition from ${this.state} to ${next}`,
        'workflow-state',
      );
    }
    this.state = next;
  }

  canTransition(next: WorkflowState): boolean {
    return validTransitions[this.state]?.includes(next) ?? false;
  }
}
