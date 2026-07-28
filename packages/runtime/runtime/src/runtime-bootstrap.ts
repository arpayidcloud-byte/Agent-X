/**
 * @module runtime/runtime-bootstrap
 * @description Runtime bootstrap configuration and setup.
 */

import type { RuntimeConfig, ResourceLimits } from './interfaces.js';
import { createRuntimeConfig, createResourceLimits } from './runtime-config.js';

export interface BootstrapOptions {
  config?: Partial<RuntimeConfig>;
  enableHooks?: boolean;
  enableAudit?: boolean;
  enableMetrics?: boolean;
}

export function createBootstrapConfig(options: BootstrapOptions = {}): {
  config: RuntimeConfig;
  resourceLimits: ResourceLimits;
  enableHooks: boolean;
  enableAudit: boolean;
  enableMetrics: boolean;
} {
  const config = createRuntimeConfig(options.config);
  return {
    config,
    resourceLimits: createResourceLimits(config),
    enableHooks: options.enableHooks !== false,
    enableAudit: options.enableAudit !== false,
    enableMetrics: options.enableMetrics !== false,
  };
}
