/**
 * @module cognitive-kernel/kernel-factory
 * @description Instantiates cognitive engines.
 */

import type { EngineContract } from './interfaces.js';

export class KernelFactory {
  create(id: string, name: string): EngineContract {
    return {
      id,
      name,
      execute: async (input: unknown) => {
        return { success: true, input };
      },
    };
  }
}
