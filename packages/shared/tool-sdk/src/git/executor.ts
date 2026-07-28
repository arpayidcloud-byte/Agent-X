/**
 * @module git/executor
 * @description Git executor that uses child_process.spawn() ONLY.
 * Never uses exec() or execSync() per Volume 7 requirements.
 */

import { spawn } from 'child_process';
import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
import type { ToolCategory } from '../interfaces/index.js';
import { GitSandbox } from './sandbox.js';
import { createTimeoutController } from '../shell/timeout.js';
import {
  ShellAuditEmitter,
  createToolInvokedEvent,
  createToolFinishedEvent,
  createToolFailedEvent,
} from '../shell/audit.js';
import { GitTimeoutError } from './errors.js';

/**
 * Git executor with full security pipeline
 */
export class GitExecutor {
  private sandbox: GitSandbox;
  private auditEmitter: ShellAuditEmitter;
  private context: GitExecutionContext;

  constructor(context: GitExecutionContext) {
    this.context = context;
    this.sandbox = new GitSandbox(context.sandboxConfig);
    this.auditEmitter = new ShellAuditEmitter();
  }

  /**
   * Determines the audit category for a git operation
   * @param operation - The git operation name
   * @returns ToolCategory ('git.read' or 'git.write')
   */
  private getGitCategory(operation: string): ToolCategory {
    const writeOperations = ['git.add', 'git.commit', 'git.reset', 'git.checkout', 'git.restore'];
    return writeOperations.includes(operation)
      ? ('git.write' as ToolCategory)
      : ('git.read' as ToolCategory);
  }

  /**
   * Executes a git operation with full security pipeline
   * @param request - The execution request
   * @returns Git execution result
   */
  async execute(request: GitExecutionRequest): Promise<GitExecutionResult> {
    const startTime = Date.now();

    try {
      // 1. Validate command through sandbox
      const repoInfo = this.sandbox.validate(request);

      // 2. Emit tool.invoked event
      this.auditEmitter.emit(
        createToolInvokedEvent(
          `${request.operation} ${request.args.join(' ')}`,
          this.getGitCategory(request.operation),
          request.taskId,
          request.traceId,
          request.agentRole,
        ),
      );

      // 3. Create timeout controller
      const { controller, cleanup } = createTimeoutController({ timeoutMs: 30000 });

      // 4. Determine working directory
      const cwd = request.workingDirectory || this.context.workspaceRoot;

      // 5. Build git command
      const gitArgs = this.buildGitArgs(request);

      // 6. Execute git command
      const output = await this.executeGitCommand('git', gitArgs, cwd, controller.signal);

      // 7. Cleanup timeout
      cleanup();

      // 8. Emit tool.finished event
      this.auditEmitter.emit(
        createToolFinishedEvent(
          `${request.operation} ${request.args.join(' ')}`,
          this.getGitCategory(request.operation),
          output.exitCode,
          output.durationMs,
          output.stdout.length,
          output.stderr.length,
          request.taskId,
          request.traceId,
          request.agentRole,
        ),
      );

      return {
        exitCode: output.exitCode,
        stdout: output.stdout,
        stderr: output.stderr,
        durationMs: output.durationMs,
        allowed: true,
        timedOut: false,
        branch: repoInfo.currentBranch,
        commitHash: repoInfo.headCommitHash,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;

      // Emit tool.failed event
      this.auditEmitter.emit(
        createToolFailedEvent(
          `${request.operation} ${request.args.join(' ')}`,
          this.getGitCategory(request.operation),
          request.taskId,
          request.traceId,
          request.agentRole,
          error instanceof Error ? error.message : String(error),
        ),
      );

      return {
        exitCode: 1,
        stdout: '',
        stderr: error instanceof Error ? error.message : String(error),
        durationMs,
        allowed: false,
        timedOut: error instanceof GitTimeoutError,
      };
    }
  }

  /**
   * Builds git command arguments
   * @param request - The execution request
   * @returns Array of git arguments
   */
  private buildGitArgs(request: GitExecutionRequest): string[] {
    const args: string[] = [];

    // Map operation to git command
    switch (request.operation) {
      case 'git.status':
        args.push('status', '--porcelain');
        break;
      case 'git.diff':
        args.push('diff');
        args.push(...request.args);
        break;
      case 'git.log':
        args.push('log', '--pretty=format:%H|%an|%ae|%ad|%s', '-n', '20');
        break;
      case 'git.branch':
        args.push('branch', '-a');
        break;
      case 'git.show':
        args.push('show');
        args.push(...request.args);
        break;
      case 'git.revparse':
        args.push('rev-parse');
        args.push(...request.args);
        break;
      case 'git.lsfiles':
        args.push('ls-files');
        args.push(...request.args);
        break;
      case 'git.add':
        args.push('add');
        args.push(...request.args);
        break;
      case 'git.restore':
        args.push('restore');
        args.push(...request.args);
        break;
      case 'git.checkout':
        args.push('checkout');
        args.push(...request.args);
        break;
      case 'git.commit':
        args.push('commit', '-m');
        args.push(...request.args);
        break;
      case 'git.reset':
        args.push('reset');
        args.push(...request.args);
        break;
      default:
        throw new Error(`Unknown git operation: ${String(request.operation)}`);
    }

    return args;
  }

  /**
   * Executes a git command using child_process.spawn()
   * @param command - The command to execute
   * @param args - Command arguments
   * @param cwd - Working directory
   * @param signal - AbortSignal for timeout
   * @returns Output from the command
   */
  private async executeGitCommand(
    command: string,
    args: string[],
    cwd: string,
    signal?: AbortSignal,
  ): Promise<{ stdout: string; stderr: string; exitCode: number; durationMs: number }> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';

      const proc = spawn(command, args, {
        cwd,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
      });

      proc.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        const durationMs = Date.now() - startTime;
        resolve({
          stdout,
          stderr,
          exitCode: code ?? 1,
          durationMs,
        });
      });

      proc.on('error', (error) => {
        const durationMs = Date.now() - startTime;
        resolve({
          stdout,
          stderr: stderr + '\n' + error.message,
          exitCode: 1,
          durationMs,
        });
      });

      if (signal) {
        signal.addEventListener('abort', () => {
          proc.kill('SIGTERM');
          reject(new GitTimeoutError('git', 30000));
        });
      }
    });
  }

  /**
   * Gets the audit emitter
   * @returns ShellAuditEmitter instance
   */
  getAuditEmitter(): ShellAuditEmitter {
    return this.auditEmitter;
  }
}
