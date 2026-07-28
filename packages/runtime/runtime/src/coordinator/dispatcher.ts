/**
 * @module coordinator/dispatcher
 * @description Execution Dispatcher for delegating tasks to engines via interfaces.
 */

import type { ExecutionPhase, ExecutionTicket } from './interfaces.js';
import { CoordinatorExecutionError } from './errors.js';

export interface IEngine {
  execute(input: unknown): Promise<unknown>;
}

export class ExecutionDispatcher {
  private engines: Map<ExecutionPhase, IEngine> = new Map();

  registerEngine(phase: ExecutionPhase, engine: IEngine): void {
    this.engines.set(phase, engine);
  }

  async dispatch(ticket: ExecutionTicket): Promise<unknown> {
    const engine = this.engines.get(ticket.phase);
    if (!engine) {
      throw new CoordinatorExecutionError(
        `No engine registered for phase ${ticket.phase}`,
        'dispatcher',
      );
    }
    return engine.execute(ticket);
  }
}
