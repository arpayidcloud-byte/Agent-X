/**
 * @module cognitive-contracts/prompt-strategy
 * @description Prompt strategy contract base implementation.
 */

import type { IPromptStrategy } from './contracts.js';
import type { PromptTemplate } from './interfaces.js';

export class PromptStrategyBase implements IPromptStrategy {
  render(template: PromptTemplate, _variables: Record<string, string>): string {
    return template.template;
  }
}
