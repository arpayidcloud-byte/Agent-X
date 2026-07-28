/**
 * @module git/git-branch
 * @description Git branch tool implementation.
 * Provides read-only git branch query within sandbox.
 */

import type {
  GitExecutionRequest,
  GitExecutionResult,
  GitExecutionContext,
  GitBranchOutput,
  GitBranchInfo,
} from './interfaces.js';
import { GitExecutor } from './executor.js';

/**
 * Git branch tool for listing branches
 */
export class GitBranchTool {
  private executor: GitExecutor;

  constructor(context: GitExecutionContext) {
    this.executor = new GitExecutor(context);
  }

  /**
   * Executes git branch command
   * @param request - The execution request
   * @returns Execution result with parsed branches
   */
  async execute(request: GitExecutionRequest): Promise<GitExecutionResult> {
    const result = await this.executor.execute({
      ...request,
      operation: 'git.branch',
    });

    if (result.allowed && result.exitCode === 0) {
      result.parsedOutput = {
        operation: 'git.branch',
        raw: result.stdout,
        data: this.parseBranches(result.stdout),
      };
    }

    return result;
  }

  /**
   * Parses git branch output
   * @param output - Raw git branch output
   * @returns Parsed GitBranchOutput
   */
  private parseBranches(output: string): GitBranchOutput {
    const branches: GitBranchInfo[] = [];
    const lines = output.split('\n').filter((line) => line.trim().length > 0);

    for (const line of lines) {
      const trimmed = line.trim();
      const current = trimmed.startsWith('* ');
      const name = current ? trimmed.substring(2) : trimmed;
      const remote = name.startsWith('remotes/');

      if (name && !name.startsWith('HEAD ->')) {
        branches.push({
          name: name.replace('remotes/origin/', ''),
          current,
          remote,
          lastCommit: undefined,
        });
      }
    }

    return { branches };
  }

  /**
   * Gets the audit emitter
   */
  getAuditEmitter() {
    return this.executor.getAuditEmitter();
  }
}
