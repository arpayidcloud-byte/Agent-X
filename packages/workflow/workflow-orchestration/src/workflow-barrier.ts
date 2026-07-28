/**
 * @module workflow-orchestration/workflow-barrier
 * @description Synchronization barrier for parallel workflow branches.
 */

export class WorkflowBarrier {
  private expectedCount: number;
  private arrived: number = 0;

  constructor(expectedCount: number) {
    this.expectedCount = expectedCount;
  }

  arrive(): boolean {
    this.arrived++;
    return this.arrived >= this.expectedCount;
  }

  reset(): void {
    this.arrived = 0;
  }

  isComplete(): boolean {
    return this.arrived >= this.expectedCount;
  }
}
