/**
 * @module shell/environment
 * @description Environment variable scrubber for shell execution.
 * Removes secrets and sensitive data from process environment.
 * Implements Threat Model T-002 mitigation.
 */

import type { EnvironmentScrubberConfig } from './interfaces.js';

/** Default sensitive patterns to scrub */
const DEFAULT_SCRUB_PATTERNS = [
  'AGENTX_SECRET_',
  'OPENAI_API_KEY',
  'GOOGLE_API_KEY',
  'ANTHROPIC_API_KEY',
  'GITHUB_TOKEN',
  'TOKEN',
  'PASSWORD',
  'SECRET',
  'KEY',
  'CREDENTIAL',
];

/**
 * Creates a scrubbed copy of the environment
 * @param original - Original process environment
 * @param config - Scrubber configuration
 * @returns Scrubbed environment object
 */
export function scrubEnvironment(
  original: Record<string, string | undefined>,
  config: EnvironmentScrubberConfig,
): Record<string, string | undefined> {
  const scrubbed: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(original)) {
    if (!shouldScrub(key, config)) {
      scrubbed[key] = value;
    }
  }

  return scrubbed;
}

/**
 * Checks if a key should be scrubbed
 * @param key - Environment variable key
 * @param config - Scrubber configuration
 * @returns true if the key should be removed
 */
function shouldScrub(key: string, config: EnvironmentScrubberConfig): boolean {
  const upperKey = key.toUpperCase();

  // Check against scrub patterns
  for (const pattern of config.scrubPatterns) {
    if (upperKey.includes(pattern.toUpperCase())) {
      return true;
    }
  }

  // Check against additional keys
  for (const additionalKey of config.additionalKeys) {
    if (upperKey === additionalKey.toUpperCase()) {
      return true;
    }
  }

  return false;
}

/**
 * Creates a default scrubber configuration
 * @returns Default EnvironmentScrubberConfig
 */
export function createDefaultScrubberConfig(): EnvironmentScrubberConfig {
  return {
    scrubPatterns: DEFAULT_SCRUB_PATTERNS,
    additionalKeys: [],
  };
}
