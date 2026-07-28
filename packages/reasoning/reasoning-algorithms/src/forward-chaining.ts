/**
 * @module reasoning-algorithms/forward-chaining
 * @description Forward chaining inference strategy.
 */

import type { Rule } from './interfaces.js';

export class ForwardChaining {
  execute(facts: Set<string>, rules: Rule[]): Set<string> {
    const inferred = new Set(facts);
    let updated = true;

    while (updated) {
      updated = false;
      for (const rule of rules) {
        if (!inferred.has(rule.consequent)) {
          const match = rule.antecedents.every((ant) => inferred.has(ant));
          if (match) {
            inferred.add(rule.consequent);
            updated = true;
          }
        }
      }
    }

    return inferred;
  }
}
