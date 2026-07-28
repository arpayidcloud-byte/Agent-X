/**
 * @module git/git-diff
 * @description Git diff tool implementation.
 * Provides read-only git diff query within sandbox.
 */

import type {
  GitExecutionRequest,
  GitExecutionResult,
  GitExecutionContext,
  GitDiffOutput,
  GitDiffFile,
} from './interfaces.js';
import { GitExecutor } from './executor.js';

/**
 * Git diff tool for comparing changes
 */
export class GitDiffTool {
  private executor: GitExecutor;

  constructor(context: GitExecutionContext) {
    this.executor = new GitExecutor(context);
  }

  /**
   * Executes git diff command
   * @param request - The execution request
   * @returns Execution result with parsed diff
   */
  async execute(request: GitExecutionRequest): Promise<GitExecutionResult> {
    const result = await this.executor.execute({
      ...request,
      operation: 'git.diff',
    });

    if (result.allowed && result.exitCode === 0) {
      result.parsedOutput = {
        operation: 'git.diff',
        raw: result.stdout,
        data: this.parseDiff(result.stdout),
      };
    }

    return result;
  }

  /**
   * Parses git diff output
   * @param output - Raw git diff output
   * @returns Parsed GitDiffOutput
   */
  private parseDiff(output: string): GitDiffOutput {
    const files: GitDiffFile[] = [];
    const lines = output.split('\n');
    let currentFile: GitDiffFile | null = null;

    for (const line of lines) {
      if (line.startsWith('diff --git')) {
        const pathMatch = line.match(/b\/(.*)$/);
        if (pathMatch && pathMatch[1]) {
          currentFile = {
            path: pathMatch[1],
            hunks: [],
          };
          files.push(currentFile);
        }
      } else if (line.startsWith('@@') && currentFile) {
        const hunkMatch = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
        if (hunkMatch) {
          currentFile.hunks.push({
            startLine: parseInt(hunkMatch[2] || '1'),
            lineCount: 0,
            lines: [],
          });
        }
      } else if (currentFile && currentFile.hunks.length > 0) {
        const currentHunk = currentFile.hunks[currentFile.hunks.length - 1];
        if (currentHunk) {
          currentHunk.lines.push(line);
          currentHunk.lineCount++;
        }
      }
    }

    return { content: output, files };
  }

  /**
   * Gets the audit emitter
   */
  getAuditEmitter() {
    return this.executor.getAuditEmitter();
  }
}
