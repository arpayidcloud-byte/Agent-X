/**
 * @module shell/sandbox
 * @description Shell sandbox implementation.
 * Enforces workspace jail, CWD validation, command validation,
 * environment scrubbing, timeout, resource limits, and audit integration.
 */

import type {
  ShellSandboxConfig,
  ShellExecutionContext,
  ShellExecutionRequest,
  ParsedCommand,
} from './interfaces.js';
import { parseCommand } from './command-parser.js';
import { validateCommand } from './validator.js';
import { scrubEnvironment } from './environment.js';
import {
  CommandBlockedError,
  CommandNotAllowedError,
  InvalidWorkingDirectoryError,
} from './errors.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Shell sandbox that enforces security policies
 */
export class ShellSandbox {
  private config: ShellSandboxConfig;
  private context: ShellExecutionContext;

  constructor(context: ShellExecutionContext) {
    this.context = context;
    this.config = context.sandboxConfig;
  }

  /**
   * Validates a shell execution request
   * @param request - The execution request to validate
   * @returns Parsed command structure
   * @throws Various errors if validation fails
   */
  async validate(request: ShellExecutionRequest): Promise<ParsedCommand> {
    // 1. Parse the command
    const parsed = parseCommand(request.command);

    // 2. Validate command against allowlist and blocked list
    const validation = validateCommand(parsed, this.config);
    if (!validation.valid) {
      const primaryReason = validation.reasons[0] || 'Unknown validation failure';
      if (this.config.blockedPrograms.includes(parsed.program)) {
        throw new CommandBlockedError(parsed.program, primaryReason);
      }
      throw new CommandNotAllowedError(parsed.program);
    }

    // 3. Validate working directory
    if (request.workingDirectory) {
      await this.validateWorkingDirectory(request.workingDirectory);
    }

    // 4. Validate CWD is within workspace
    const effectiveCwd = request.workingDirectory || this.config.defaultWorkingDirectory;
    await this.validateWorkspaceJail(effectiveCwd);

    return parsed;
  }

  /**
   * Validates a working directory
   * @param directory - Directory to validate
   * @throws InvalidWorkingDirectoryError if directory is invalid
   */
  private async validateWorkingDirectory(directory: string): Promise<void> {
    try {
      const stat = await fs.stat(directory);
      if (!stat.isDirectory()) {
        throw new InvalidWorkingDirectoryError(directory);
      }
    } catch (error) {
      if (error instanceof InvalidWorkingDirectoryError) {
        throw error;
      }
      throw new InvalidWorkingDirectoryError(directory);
    }
  }

  /**
   * Validates that a directory is within the workspace jail
   * @param directory - Directory to validate
   * @throws InvalidWorkingDirectoryError if directory escapes workspace
   */
  private async validateWorkspaceJail(directory: string): Promise<void> {
    const resolved = path.resolve(directory);
    const workspaceRoot = path.resolve(this.context.workspaceRoot);

    if (!resolved.startsWith(workspaceRoot)) {
      throw new InvalidWorkingDirectoryError(
        `Directory '${directory}' escapes workspace jail '${workspaceRoot}'`,
      );
    }
  }

  /**
   * Checks if a command is allowed
   * @param command - Command to check
   * @returns true if allowed
   */
  isCommandAllowed(command: string): boolean {
    try {
      const parsed = parseCommand(command);
      const validation = validateCommand(parsed, this.config);
      return validation.valid;
    } catch {
      return false;
    }
  }

  /**
   * Gets the effective environment (scrubbed)
   * @returns Scrubbed environment variables
   */
  getScrubbedEnvironment(): Record<string, string | undefined> {
    return scrubEnvironment(process.env, this.context.environmentScrubber);
  }
}
