/**
 * @module git/git-log
 * @description Git log tool implementation.
 * Provides read-only git log query within sandbox.
 */

import type {
  GitExecutionRequest,
  GitExecutionResult,
  GitExecutionContext,
  GitLogOutput,
  GitLogEntry,
} from './interfaces.js';
import { GitExecutor } from './executor.js';

/**
 * Git log tool for viewing commit history
 */
export class GitLogTool {
  private executor: GitExecutor;

  constructor(context: GitExecutionContext) {
    this.executor = new GitExecutor(context);
  }

  /**
   * Executes git log command
   * @param request - The execution request
   * @returns Execution result with parsed log
   */
  async execute(request: GitExecutionRequest): Promise<GitExecutionResult> {
    const result = await this.executor.execute({
      ...request,
      operation: 'git.log',
    });

    if (result.allowed && result.exitCode === 0) {
      result.parsedOutput = {
        operation: 'git.log',
        raw: result.stdout,
        data: this.parseLog(result.stdout),
      };
    }

    return result;
  }

  /**
   * Parses git log output
   * @param output - Raw git log output
   * @returns Parsed GitLogOutput
   */
  private parseLog(output: string): GitLogOutput {
    const entries: GitLogEntry[] = [];
    const lines = output.split('\n').filter((line) => line.trim().length > 0);

    for (const line of lines) {
      const parts = line.split('|');
      if (parts.length >= 5) {
        entries.push({
          hash: parts[0] || '',
          author: parts[1] || '',
          email: parts[2] || '',
          date: parts[3] || '',
          message: parts.slice(4).join('|'),
          parents: [],
        });
      }
    }

    return { entries };
  }

  /**
   * Gets the audit emitter
   */
  getAuditEmitter() {
    return this.executor.getAuditEmitter();
  }
}
