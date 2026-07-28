/**
 * @module shell/validator
 * @description Command validation for shell execution.
 * Implements allowlist checking, blocked command detection,
 * dangerous flag detection, and injection pattern detection.
 */

import type { ParsedCommand, ValidationResult, ShellSandboxConfig } from './interfaces.js';
import { isProgramAllowed, isProgramBlocked, isFlagDangerous } from './allowlist.js';
import { detectInjectionPatterns } from './command-parser.js';

/**
 * Validates a parsed command against sandbox rules
 * @param parsed - The parsed command to validate
 * @param config - The shell sandbox configuration
 * @returns ValidationResult with validity and reasons
 */
export function validateCommand(
  parsed: ParsedCommand,
  config: ShellSandboxConfig,
): ValidationResult {
  const reasons: string[] = [];

  // 1. Check if program is blocked (highest priority)
  if (isProgramBlocked(parsed.program, config)) {
    reasons.push(`Program '${parsed.program}' is in the blocked list`);
  }

  // 2. Check if program is allowed
  if (!isProgramAllowed(parsed.program, config)) {
    reasons.push(`Program '${parsed.program}' is not in the allowlist`);
  }

  // 3. Check for dangerous flags
  for (const flag of parsed.flags) {
    if (isFlagDangerous(flag, config)) {
      reasons.push(`Dangerous flag detected: '${flag}'`);
    }
  }

  // 4. Check for injection patterns
  const injectionPatterns = detectInjectionPatterns(parsed.rawCommand);
  if (injectionPatterns.length > 0) {
    reasons.push(`Injection patterns detected: ${injectionPatterns.join(', ')}`);
  }

  // 5. Check for pipe operators (shell.build should not have pipes)
  if (parsed.hasPipe) {
    reasons.push('Pipe operators are not allowed in shell commands');
  }

  // 6. Check for redirection operators (potential file manipulation)
  if (parsed.hasRedirection) {
    reasons.push('Redirection operators require explicit approval');
  }

  // 7. Check for subshell expansion (potential injection)
  if (parsed.hasSubshell) {
    reasons.push('Subshell expansion is not allowed');
  }

  // 8. Validate argument paths (prevent path traversal and out-of-workspace access)
  const argPathReasons = validateArgumentPaths(parsed.args, config);
  reasons.push(...argPathReasons);

  return {
    valid: reasons.length === 0,
    reasons,
  };
}

/**
 * Validates that command arguments don't contain path traversal or out-of-workspace paths
 * @param args - Command arguments to validate
 * @param config - Shell sandbox configuration
 * @returns Array of validation failure reasons (empty if valid)
 */
export function validateArgumentPaths(args: string[], config: ShellSandboxConfig): string[] {
  const reasons: string[] = [];
  const workspaceRoot = config.defaultWorkingDirectory || process.cwd();

  for (const arg of args) {
    // Skip flags and options
    if (arg.startsWith('-')) continue;

    // Check for null bytes (potential injection)
    if (arg.includes('\0')) {
      reasons.push(`Null byte detected in argument: '${arg.substring(0, 50)}'`);
      continue;
    }

    // Check for path traversal
    if (arg.includes('..')) {
      reasons.push(`Path traversal detected in argument: '${arg}'`);
      continue;
    }

    // Check for absolute paths outside workspace
    if (arg.startsWith('/') && !arg.startsWith(workspaceRoot)) {
      reasons.push(`Absolute path outside workspace: '${arg}'`);
      continue;
    }

    // Check for encoded path traversal
    if (arg.includes('%2e%2e') || arg.includes('%2E%2E')) {
      reasons.push(`Encoded path traversal detected in argument: '${arg}'`);
      continue;
    }

    // Check for home directory expansion
    if (arg.startsWith('~') && arg.length > 1) {
      reasons.push(`Home directory expansion not allowed: '${arg}'`);
      continue;
    }
  }

  return reasons;
}
