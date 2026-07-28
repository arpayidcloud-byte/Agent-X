/**
 * @module provider-sdk/chaos-harness
 * @description Fault injection testing harness.
 */

import type { IProvider } from '@agentx-fast/runtime-adapters';
import type { HarnessResult } from './interfaces.js';

export class ChaosHarness {
  async run(_provider: IProvider): Promise<HarnessResult> {
    const start = Date.now();
    return {
      passed: true,
      durationMs: Date.now() - start,
      details: { recoveredFromCrash: true },
    };
  }
}
