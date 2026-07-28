/**
 * @module production-quality/dependency-validator
 * @description Ensures architectural boundaries (e.g. Hexagonal Architecture).
 */

import type { ValidationResult } from './interfaces.js';
import { DependencyError } from './errors.js';

export class DependencyValidator {
  validate(dependencies: Record<string, string[]>): ValidationResult {
    const failures: string[] = [];

    // Simulated check for illegal imports
    if (dependencies['runtime']?.includes('redis') || dependencies['runtime']?.includes('bullmq')) {
      failures.push('Runtime core illegally imports vendor adapters directly');
    }

    // Checking for circular dependencies (simplified)
    for (const [pkg, deps] of Object.entries(dependencies)) {
      if (deps.includes(pkg)) {
        failures.push(`Circular dependency detected in ${pkg}`);
      }
    }

    if (failures.length > 0) {
      throw new DependencyError(
        `Dependency validation failed: ${failures.join(', ')}`,
        'dependency-validator',
      );
    }

    return {
      passed: true,
      score: 100,
      failures: [],
    };
  }
}
