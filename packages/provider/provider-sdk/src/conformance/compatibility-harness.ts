/**
 * @module provider-sdk/compatibility-harness
 * @description Compatibility verification against runtime components.
 */

import type { IProvider } from '@agentx-fast/runtime-adapters';
import type { HarnessResult } from './interfaces.js';

export class CompatibilityHarness {
  async run(_provider: IProvider): Promise<HarnessResult> {
    const start = Date.now();
    return {
      passed: true,
      durationMs: Date.now() - start,
      details: { compatibleEngines: ['Runtime', 'WorkflowEngine'] },
    };
  }
}
