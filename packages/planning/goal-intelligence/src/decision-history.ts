/**
 * @module goal-intelligence/decision-history
 * @description Immutable decision history.
 */

import type { DecisionChoice } from './interfaces.js';
import { createHash } from 'crypto';

export class DecisionHistory {
  private decisions: { choice: DecisionChoice; timestamp: Date; checksum: string }[] = [];

  add(choice: DecisionChoice): void {
    const checksum = createHash('sha256').update(JSON.stringify(choice)).digest('hex');
    this.decisions.push(Object.freeze({ choice, timestamp: new Date(), checksum }));
  }

  getAll(): { choice: DecisionChoice; timestamp: Date; checksum: string }[] {
    return [...this.decisions];
  }
}
