/**
 * @module production-quality/event-validator
 * @description Validates emitted event metadata structure.
 */

import type { ValidationResult } from './interfaces.js';

export interface EventEnvelope {
  traceId: string;
  timestamp: Date;
  sessionId: string;
  workflowId: string;
  correlationId: string;
  source: string;
  version: string;
  payload: unknown;
}

export class EventValidator {
  validate(events: EventEnvelope[]): ValidationResult {
    const failures: string[] = [];

    for (let i = 0; i < events.length; i++) {
      const e = events[i] as EventEnvelope;
      if (!e.traceId) failures.push(`Event ${i} missing traceId`);
      if (!e.timestamp) failures.push(`Event ${i} missing timestamp`);
      if (!e.sessionId) failures.push(`Event ${i} missing sessionId`);
      if (!e.workflowId) failures.push(`Event ${i} missing workflowId`);
      if (!e.correlationId) failures.push(`Event ${i} missing correlationId`);
      if (!e.source) failures.push(`Event ${i} missing source`);
      if (!e.version) failures.push(`Event ${i} missing version`);
    }

    return {
      passed: failures.length === 0,
      score: failures.length === 0 ? 100 : Math.max(0, 100 - failures.length * 5),
      failures,
    };
  }
}
