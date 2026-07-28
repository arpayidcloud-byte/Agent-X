/**
 * @module git/git-checkout
 * @description Git checkout tool implementation.
 * Switches branches or restores files within sandbox.
 */

import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
import { GitExecutor } from './executor.js';

/**
 * Git checkout tool for switching branches
 */
export class GitCheckoutTool {
  private executor: GitExecutor;

  constructor(context: GitExecutionContext) {
    this.executor = new GitExecutor(context);
  }

  /**
   * Executes git checkout command
   * @param request - The execution request
   * @returns Execution result
   */
  async execute(request: GitExecutionRequest): Promise<GitExecutionResult> {
    return this.executor.execute({
      ...request,
      operation: 'git.checkout',
    });
  }

  /**
   * Gets the audit emitter
   */
  getAuditEmitter() {
    return this.executor.getAuditEmitter();
  }
}
