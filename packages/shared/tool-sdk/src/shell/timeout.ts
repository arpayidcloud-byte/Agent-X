/**
 * @module shell/timeout
 * @description Timeout management for shell execution using AbortController/AbortSignal.
 * Default timeout is 60 seconds, configurable per Volume 7.
 */

import type { TimeoutConfig } from './interfaces.js';

/** Default timeout configuration */
const DEFAULT_TIMEOUT_CONFIG: TimeoutConfig = {
  timeoutMs: 60000, // 60 seconds
  killOnTimeout: true,
  gracePeriodMs: 5000, // 5 seconds grace period
};

/**
 * Creates an AbortController with timeout
 * @param config - Timeout configuration
 * @returns Object with AbortController and cleanup function
 */
export function createTimeoutController(config: Partial<TimeoutConfig> = {}): {
  controller: AbortController;
  cleanup: () => void;
} {
  const mergedConfig = { ...DEFAULT_TIMEOUT_CONFIG, ...config };
  const controller = new AbortController();

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (mergedConfig.timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort(new Error(`Operation timed out after ${mergedConfig.timeoutMs}ms`));
      }
    }, mergedConfig.timeoutMs);
  }

  const cleanup = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return { controller, cleanup };
}

/**
 * Gets the default timeout configuration
 * @returns Default TimeoutConfig
 */
export function getDefaultTimeoutConfig(): TimeoutConfig {
  return { ...DEFAULT_TIMEOUT_CONFIG };
}
