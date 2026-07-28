/**
 * @module cognitive-contracts/cognitive-factory
 * @description Factory method for cognitive engine instantiation.
 */

import type { ICognitiveEngine } from './contracts.js';
import { CognitiveEngineBase } from './cognitive-engine.js';

export class CognitiveFactory {
  create(id: string, name: string, version: string): ICognitiveEngine {
    return new CognitiveEngineBase(id, name, version);
  }
}
