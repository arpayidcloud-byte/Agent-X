/**
 * @module cognitive-contracts/cognitive-engine
 * @description Defines the base contract for cognitive engines.
 */

export class CognitiveEngineBase {
  constructor(
    private id: string,
    private name: string,
    private version: string,
  ) {}

  async executeSession(_session: unknown): Promise<unknown> {
    return {};
  }

  getEngineMetadata() {
    return { id: this.id, name: this.name, version: this.version };
  }
}
