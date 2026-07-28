/**
 * @module cognitive-contracts/cognitive-hooks
 * @description Hook contract definitions.
 */

import type { ThinkingSession } from './interfaces.js';

export interface CognitiveHooks {
  beforeThinking?: (session: ThinkingSession) => Promise<void>;
  afterThinking?: (session: ThinkingSession, result: unknown) => Promise<void>;
  beforeReasoning?: (traceId: string) => Promise<void>;
  afterReasoning?: (traceId: string, result: unknown) => Promise<void>;
  beforeReflection?: (thought: string) => Promise<void>;
  afterReflection?: (thought: string, result: unknown) => Promise<void>;
  beforeDecision?: (options: string[]) => Promise<void>;
  afterDecision?: (options: string[], result: unknown) => Promise<void>;
  onFailure?: (session: ThinkingSession, error: Error) => Promise<void>;
  onRecovery?: (session: ThinkingSession) => Promise<void>;
}
