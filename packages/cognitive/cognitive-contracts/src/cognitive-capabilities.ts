/**
 * @module cognitive-contracts/cognitive-capabilities
 * @description Capability mapping for cognitive engines.
 */

export interface CognitiveCapabilities {
  reasoning: boolean;
  reflection: boolean;
  planning: boolean;
  decision: boolean;
}

export class CognitiveCapabilityResolver {
  hasCapability(caps: CognitiveCapabilities, feature: keyof CognitiveCapabilities): boolean {
    return caps[feature] === true;
  }
}
