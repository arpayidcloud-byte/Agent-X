/**
 * @module cognitive-contracts/cognitive-registry
 * @description Manages registered cognitive engines.
 */

import type { ICognitiveEngine } from './contracts.js';

export class CognitiveRegistry {
  private engines = new Map<string, ICognitiveEngine>();

  register(engine: ICognitiveEngine): void {
    const meta = engine.getEngineMetadata();
    this.engines.set(meta.id, engine);
  }

  resolve(id: string): ICognitiveEngine | undefined {
    return this.engines.get(id);
  }

  list(): ICognitiveEngine[] {
    return Array.from(this.engines.values());
  }
}
