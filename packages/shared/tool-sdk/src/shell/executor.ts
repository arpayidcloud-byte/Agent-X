/**
 * @module shell/executor
 * @description Shell executor that uses child_process.spawn() ONLY.
 * Never uses exec() or execSync() per Volume 7 requirements.
 * Implements complete execution pipeline with sandbox, timeout, resource limits, and audit.
 */

import type {
  ShellExecutionRequest,
  ShellExecutionResult,
  ShellExecutionContext,
  ToolCategory,
} from './interfaces.js';
import { ShellSandbox } from './sandbox.js';
import { ProcessManager } from './process-manager.js';
import { createTimeoutController } from './timeout.js';
import {
  createResourceLimits,
  validateOutputSize,
  validateExecutionTime,
} from './resource-limits.js';
import {
  ShellAuditEmitter,
  createToolInvokedEvent,
  createToolFinishedEvent,
  createToolFailedEvent,
} from './audit.js';
import { ShellTimeoutError, ResourceLimitExceededError } from './errors.js';

/**
 * Shell executor with full security pipeline
 */
export class ShellExecutor {
  private sandbox: ShellSandbox;
  private auditEmitter: ShellAuditEmitter;
  private context: ShellExecutionContext;

  constructor(context: ShellExecutionContext) {
    this.context = context;
    this.sandbox = new ShellSandbox(context);
    this.auditEmitter = new ShellAuditEmitter();
  }

  /**
   * Executes a shell command with full security pipeline
   * @param request - The execution request
   * @returns Shell execution result
   */
  async execute(request: ShellExecutionRequest): Promise<ShellExecutionResult> {
    const startTime = Date.now();
    let wasAllowed = false;

    try {
      // 1. Validate command through sandbox
      const parsed = await this.sandbox.validate(request);
      wasAllowed = true;

      // 2. Classify for approval
      const category: ToolCategory = request.command.includes('build')
        ? 'shell.build'
        : 'shell.exec';

      // 3. Emit tool.invoked event
      this.auditEmitter.emit(
        createToolInvokedEvent(
          request.command,
          category,
          request.taskId,
          request.traceId,
          request.agentRole,
        ),
      );

      // 4. Create timeout controller
      const timeoutMs = request.timeoutMs || this.context.timeoutConfig.timeoutMs;
      const { controller, cleanup } = createTimeoutController({ timeoutMs });

      // 5. Get scrubbed environment
      const env: Record<string, string> = this.sandbox.getScrubbedEnvironment() as Record<
        string,
        string
      >;

      // 6. Determine working directory
      const cwd = request.workingDirectory || this.context.sandboxConfig.defaultWorkingDirectory;

      // 7. Create process manager with resource limits
      const resourceLimits = createResourceLimits(this.context.resourceLimits);
      const processManager = new ProcessManager(resourceLimits);

      // 8. Execute with timeout
      const output = await Promise.race([
        processManager.spawn(parsed.program, [...parsed.args, ...parsed.flags], {
          cwd,
          env,
          signal: controller.signal,
        }),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            processManager.kill('SIGTERM');
            reject(new ShellTimeoutError(request.command, timeoutMs));
          });
        }),
      ]);

      // 9. Cleanup timeout
      cleanup();

      // 10. Validate output
      validateOutputSize(
        Buffer.byteLength(output.stdout) + Buffer.byteLength(output.stderr),
        resourceLimits,
      );
      validateExecutionTime(output.durationMs, resourceLimits);

      // 11. Determine if timed out
      const timedOut = controller.signal.aborted;

      // 12. Emit tool.finished event
      this.auditEmitter.emit(
        createToolFinishedEvent(
          request.command,
          category,
          output.exitCode,
          output.durationMs,
          output.stdout.length,
          output.stderr.length,
          request.taskId,
          request.traceId,
          request.agentRole,
          timedOut,
        ),
      );

      return {
        exitCode: output.exitCode,
        signal: output.signal,
        stdout: output.stdout,
        stderr: output.stderr,
        durationMs: output.durationMs,
        allowed: wasAllowed,
        timedOut,
        resourceLimitsExceeded: false,
        parsedCommand: parsed,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const category: ToolCategory = request.command.includes('build')
        ? 'shell.build'
        : 'shell.exec';

      // Emit tool.failed event
      this.auditEmitter.emit(
        createToolFailedEvent(
          request.command,
          category,
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
        allowed: wasAllowed,
        timedOut: error instanceof ShellTimeoutError,
        resourceLimitsExceeded: error instanceof ResourceLimitExceededError,
        parsedCommand: {
          program: '',
          args: [],
          flags: [],
          envOverrides: {},
          hasPipe: false,
          hasRedirection: false,
          hasSubshell: false,
          rawCommand: request.command,
        },
      };
    }
  }

  /**
   * Gets the audit emitter for event access
   * @returns ShellAuditEmitter instance
   */
  getAuditEmitter(): ShellAuditEmitter {
    return this.auditEmitter;
  }
}
