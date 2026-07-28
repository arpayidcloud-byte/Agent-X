/**
 * @module reasoning-framework/pipeline-stage
 * @description Base logic block for an individual stage.
 */

export class PipelineStageBase {
  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }
}
