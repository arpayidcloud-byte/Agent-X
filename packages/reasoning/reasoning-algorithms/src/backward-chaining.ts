/**
 * @module reasoning-algorithms/backward-chaining
 * @description Goal-driven backward chaining inference strategy.
 */

import type { Rule } from './interfaces.js';

export class BackwardChaining {
  execute(goal: string, facts: Set<string>, rules: Rule[]): boolean {
    if (facts.has(goal)) return true;

    const supportingRules = rules.filter((r) => r.consequent === goal);

    for (const rule of supportingRules) {
      let allAntecedentsMet = true;
      for (const ant of rule.antecedents) {
        if (!this.execute(ant, facts, rules)) {
          allAntecedentsMet = false;
          break;
        }
      }
      if (allAntecedentsMet) {
        facts.add(goal);
        return true;
      }
    }

    return false;
  }
}
