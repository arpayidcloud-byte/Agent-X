/**
 * @module git/git-restore
 * @description Git restore tool implementation.
 * Restores file contents within sandbox.
 */

import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
import { GitExecutor } from './executor.js';

/**
 * Git restore tool for restoring file contents
 */
export class GitRestoreTool {
  private executor: GitExecutor;

  constructor(context: GitExecutionContext) {
    this.executor = new GitExecutor(context);
  }

  /**
   * Executes git restore command
   * @param request - The execution request
   * @returns Execution result
   */
  async execute(request: GitExecutionRequest): Promise<GitExecutionResult> {
    return this.executor.execute({
      ...request,
      operation: 'git.restore',
    });
  }

  /**
   * Gets the audit emitter
   */
  getAuditEmitter() {
    return this.executor.getAuditEmitter();
  }
}
