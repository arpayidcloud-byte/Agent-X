/**
 * @module workflow-orchestration/multi-goal-manager
 * @description Manages simultaneous goal execution.
 */

export interface GoalSession {
  id: string;
  status: 'RUNNING' | 'SUSPENDED' | 'COMPLETED' | 'CANCELLED';
  priority: number;
}

export class MultiGoalManager {
  private goals = new Map<string, GoalSession>();

  register(id: string, priority: number): void {
    this.goals.set(id, { id, status: 'RUNNING', priority });
  }

  cancel(id: string): void {
    const goal = this.goals.get(id);
    if (goal) goal.status = 'CANCELLED';
  }

  suspend(id: string): void {
    const goal = this.goals.get(id);
    if (goal) goal.status = 'SUSPENDED';
  }

  resume(id: string): void {
    const goal = this.goals.get(id);
    if (goal) goal.status = 'RUNNING';
  }

  complete(id: string): void {
    const goal = this.goals.get(id);
    if (goal) goal.status = 'COMPLETED';
  }

  getRunning(): GoalSession[] {
    return Array.from(this.goals.values()).filter((g) => g.status === 'RUNNING');
  }
}
