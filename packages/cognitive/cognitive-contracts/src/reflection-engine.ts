/**
 * @module cognitive-contracts/reflection-engine
 * @description Reflection engine contract implementation base.
 */

import type { IReflectionEngine } from './contracts.js';
import type { ReflectionResult } from './interfaces.js';

export class ReflectionEngineBase implements IReflectionEngine {
  async reflect(_thought: string, _criteria: string[]): Promise<ReflectionResult> {
    return {
      isCorrect: false,
      critique: '',
      improvements: [],
    };
  }
}
