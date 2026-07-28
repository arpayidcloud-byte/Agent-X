/**
 * @module shell/errors
 * @description Error types for Shell Execution Foundation.
 */

import { ToolError } from '../errors/index.js';

/** Base error for all shell execution errors */
export class ShellError extends ToolError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

/** Thrown when a command is not in the allowlist */
export class CommandNotAllowedError extends ShellError {
  constructor(command: string) {
    super(`Command '${command}' is not in the allowlist`, 'COMMAND_NOT_ALLOWED');
  }
}

/** Thrown when a command is in the blocked list */
export class CommandBlockedError extends ShellError {
  constructor(command: string, reason: string) {
    super(`Command '${command}' is blocked: ${reason}`, 'COMMAND_BLOCKED');
  }
}

/** Thrown when a command contains injection attempts */
export class CommandInjectionError extends ShellError {
  constructor(command: string, pattern: string) {
    super(`Command injection detected: '${pattern}' in '${command}'`, 'COMMAND_INJECTION');
  }
}

/** Thrown when a command times out */
export class ShellTimeoutError extends ShellError {
  constructor(command: string, timeoutMs: number) {
    super(`Command '${command}' timed out after ${timeoutMs}ms`, 'SHELL_TIMEOUT');
  }
}

/** Thrown when resource limits are exceeded */
export class ResourceLimitExceededError extends ShellError {
  constructor(resource: string, limit: number) {
    super(`Resource limit exceeded: ${resource} limit is ${limit}`, 'RESOURCE_LIMIT_EXCEEDED');
  }
}

/** Thrown when working directory is invalid */
export class InvalidWorkingDirectoryError extends ShellError {
  constructor(directory: string) {
    super(`Invalid working directory: '${directory}'`, 'INVALID_WORKING_DIRECTORY');
  }
}

/** Thrown when environment scrubbing fails */
export class EnvironmentScrubError extends ShellError {
  constructor(key: string) {
    super(`Failed to scrub environment variable: '${key}'`, 'ENVIRONMENT_SCRUB_ERROR');
  }
}

/** Thrown when command parsing fails */
export class CommandParseError extends ShellError {
  constructor(command: string, reason: string) {
    super(`Failed to parse command '${command}': ${reason}`, 'COMMAND_PARSE_ERROR');
  }
}

/** Thrown when approval is required but not granted */
export class ApprovalRequiredError extends ShellError {
  constructor(command: string, classification: string) {
    super(`Command '${command}' requires approval: ${classification}`, 'APPROVAL_REQUIRED');
  }
}
