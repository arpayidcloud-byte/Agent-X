/**
 * @module git/git-commit
 * @description Git commit tool implementation.
 * Creates new commits within sandbox.
 */

import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
import { GitExecutor } from './executor.js';
import { validateCommitMessage } from './validator.js';

/**
 * Git commit tool for creating commits
 */
export class GitCommitTool {
  private executor: GitExecutor;

  constructor(context: GitExecutionContext) {
    this.executor = new GitExecutor(context);
  }

  /**
   * Executes git commit command
   * @param request - The execution request
   * @returns Execution result
   */
  async execute(request: GitExecutionRequest): Promise<GitExecutionResult> {
    // Validate commit message if provided
    if (request.args.length > 0 && request.args[0]) {
      if (!validateCommitMessage(request.args[0])) {
        return {
          exitCode: 1,
          stdout: '',
          stderr: 'Invalid commit message: first line must be <= 72 characters',
          durationMs: 0,
          allowed: true,
          timedOut: false,
        };
      }
    }

    return this.executor.execute({
      ...request,
      operation: 'git.commit',
    });
  }

  /**
   * Gets the audit emitter
   */
  getAuditEmitter() {
    return this.executor.getAuditEmitter();
  }
}
