/**
 * @module cognitive-kernel/kernel-dispatcher
 * @description Dispatches tasks to appropriate engine handlers.
 */

import type { EngineContract } from './interfaces.js';
import { DispatcherError } from './errors.js';

export class KernelDispatcher {
  async dispatch(engine: EngineContract, input: unknown): Promise<unknown> {
    try {
      return await engine.execute(input);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new DispatcherError(`Failed to dispatch task: ${message}`, 'dispatcher');
    }
  }
}
