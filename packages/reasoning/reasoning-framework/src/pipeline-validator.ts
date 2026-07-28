/**
 * @module reasoning-framework/pipeline-validator
 * @description Validates pipeline stage inputs.
 */

import type { ReasoningSession, PipelineStageName } from './interfaces.js';
import { ValidationError } from './errors.js';

export class PipelineValidator {
  validateStage(session: ReasoningSession, stage: PipelineStageName): void {
    if (!session.id || !session.traceId) {
      throw new ValidationError(`Invalid session context at stage ${stage}`, 'pipeline-validator');
    }
  }
}
