/**
 * @module cognitive-kernel/kernel-registry
 * @description Holds all cognitive engine implementations.
 */

import type { EngineContract } from './interfaces.js';

export class KernelRegistry {
  private engines = new Map<string, EngineContract>();

  register(engine: EngineContract): void {
    this.engines.set(engine.id, engine);
  }

  resolve(id: string): EngineContract | undefined {
    return this.engines.get(id);
  }

  listEngines(): EngineContract[] {
    return Array.from(this.engines.values());
  }
}
