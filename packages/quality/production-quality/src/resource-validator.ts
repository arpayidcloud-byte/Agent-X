/**
 * @module production-quality/resource-validator
 * @description Validates CPU, memory, and token ceilings.
 */

import type { ValidationResult } from './interfaces.js';
import { ResourceValidationError } from './errors.js';

export interface ResourceUsage {
  cpuUsagePercent: number;
  memoryUsageMb: number;
  tokens: number;
  cost: number;
}

export interface ResourceCeilings {
  maxCpu: number;
  maxMemory: number;
  maxTokens: number;
  maxCost: number;
}

export class ResourceValidator {
  validate(usage: ResourceUsage, ceilings: ResourceCeilings): ValidationResult {
    const failures: string[] = [];

    if (usage.cpuUsagePercent > ceilings.maxCpu) {
      failures.push(`CPU usage ${usage.cpuUsagePercent}% exceeds ceiling ${ceilings.maxCpu}%`);
    }
    if (usage.memoryUsageMb > ceilings.maxMemory) {
      failures.push(
        `Memory usage ${usage.memoryUsageMb}MB exceeds ceiling ${ceilings.maxMemory}MB`,
      );
    }
    if (usage.tokens > ceilings.maxTokens) {
      failures.push(`Tokens usage ${usage.tokens} exceeds ceiling ${ceilings.maxTokens}`);
    }
    if (usage.cost > ceilings.maxCost) {
      failures.push(`Cost usage ${usage.cost} exceeds ceiling ${ceilings.maxCost}`);
    }

    if (failures.length > 0) {
      throw new ResourceValidationError(
        `Resource validation failed: ${failures.join(', ')}`,
        'resource-validator',
      );
    }

    return {
      passed: true,
      score: 100,
      failures: [],
    };
  }
}
