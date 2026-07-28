/**
 * @module runtime/runtime-config
 * @description Runtime configuration management.
 */

import type { RuntimeConfig, ResourceLimits } from './interfaces.js';

const DEFAULT_CONFIG: RuntimeConfig = {
  tokenBudget: 500000,
  costBudget: 100.0,
  maxParallelAgents: 10,
  maxWorkflows: 50,
  maxTools: 100,
  maxMemory: 1024 * 1024 * 100,
  maxContextTokens: 100000,
  defaultTimeoutMs: 60000,
  checkpointIntervalMs: 30000,
};

/**
 * Creates runtime configuration with defaults
 * @param overrides - Partial configuration to override defaults
 * @returns Merged RuntimeConfig
 */
export function createRuntimeConfig(overrides: Partial<RuntimeConfig> = {}): RuntimeConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

/**
 * Creates resource limits from runtime config
 * @param config - Runtime configuration
 * @returns ResourceLimits
 */
export function createResourceLimits(config: RuntimeConfig): ResourceLimits {
  return {
    tokenBudget: config.tokenBudget,
    costBudget: config.costBudget,
    providerQuota: config.maxParallelAgents * 2,
    parallelLimit: config.maxParallelAgents,
    agentLimit: config.maxParallelAgents * 2,
    workflowLimit: config.maxWorkflows,
    toolLimit: config.maxTools,
    memoryLimit: config.maxMemory,
    contextLimit: config.maxContextTokens,
  };
}
