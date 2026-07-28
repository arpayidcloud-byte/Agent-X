/**
 * @module cognitive-learning/feedback-collector
 * @description Collects feedback from various system sources.
 */

import type { Feedback } from './interfaces.js';

export class FeedbackCollector {
  private collected: Feedback[] = [];

  collect(feedback: Feedback): void {
    this.collected.push(feedback);
  }

  getAll(): Feedback[] {
    return [...this.collected];
  }

  count(): number {
    return this.collected.length;
  }
}
