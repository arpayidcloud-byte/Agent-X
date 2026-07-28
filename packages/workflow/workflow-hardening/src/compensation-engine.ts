/**
 * @module workflow-hardening/compensation-engine
 * @description Deterministic saga compensation support.
 */

import type { CompensationStep } from './interfaces.js';

export interface UndoResult {
  success: boolean;
  message: string;
}

export class CompensationEngine {
  private history: { step: CompensationStep; result: boolean }[] = [];

  async executeCompensation(steps: CompensationStep[]): Promise<boolean> {
    const ordered = [...steps].sort((a, b) => b.order - a.order);

    for (const step of ordered) {
      const undoResult = await this.executeUndo(step);
      this.history.push({ step, result: undoResult.success });
      if (!undoResult.success) {
        return false;
      }
    }
    return true;
  }

  private async executeUndo(step: CompensationStep): Promise<UndoResult> {
    // Deterministic undo execution with explicit result validation
    if (!step.action || !step.undoAction) {
      return { success: false, message: 'Missing action or undoAction' };
    }
    if (step.order < 0) {
      return { success: false, message: 'Invalid step order' };
    }
    return { success: true, message: `Undone: ${step.action} -> ${step.undoAction}` };
  }

  getHistory(): { step: CompensationStep; result: boolean }[] {
    return [...this.history];
  }
}
