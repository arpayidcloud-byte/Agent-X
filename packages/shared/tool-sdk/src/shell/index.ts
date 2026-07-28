/**
 * @module shell
 * @description Shell Execution Foundation for the AgentX Tool SDK.
 *
 * This module implements secure shell command execution following:
 * - Volume 7 (Tool SDK) specifications
 * - Volume 2 (Core Runtime) event patterns
 * - Volume 13 (Observability) structured logging
 * - ADR-0005 (Destructive Action Classification)
 * - Threat Model T-002 (Command Injection Mitigation)
 *
 * Key features:
 * - Command allowlist/blocklist from agentx.config.yaml
 * - Injection pattern detection
 * - Environment scrubbing for secrets
 * - Timeout management via AbortController
 * - Resource limits (CPU, memory, output, execution time)
 * - Audit event emission
 * - Approval classification (shell.build vs shell.exec)
 */

// Interfaces and types
export type {
  ParsedCommand,
  ShellSandboxConfig,
  ShellExecutionRequest,
  ShellExecutionResult,
  ShellAuditEvent,
  TimeoutConfig,
  ResourceLimitsConfig,
  EnvironmentScrubberConfig,
  ApprovalClassification,
  ShellExecutionContext,
  IShellAuditEmitter,
  IShellSandbox,
  ICommandValidator,
  ValidationResult,
  IShellExecutor,
} from './interfaces.js';

// Errors
export {
  ShellError,
  CommandNotAllowedError,
  CommandBlockedError,
  CommandInjectionError,
  ShellTimeoutError,
  ResourceLimitExceededError,
  InvalidWorkingDirectoryError,
  EnvironmentScrubError,
  CommandParseError,
  ApprovalRequiredError,
} from './errors.js';

// Core components
export { ShellSandbox } from './sandbox.js';
export { ShellExecutor } from './executor.js';
export { ShellBuildTool } from './shell-build.js';
export { ShellExecTool } from './shell-exec.js';

// Utilities
export {
  parseCommand,
  detectDangerousPatterns,
  detectInjectionPatterns,
} from './command-parser.js';
export { validateCommand } from './validator.js';
export {
  loadShellConfig,
  isProgramAllowed,
  isProgramBlocked,
  isFlagDangerous,
} from './allowlist.js';
export { scrubEnvironment, createDefaultScrubberConfig } from './environment.js';
export { createTimeoutController, getDefaultTimeoutConfig } from './timeout.js';
export {
  createResourceLimits,
  validateOutputSize,
  validateExecutionTime,
} from './resource-limits.js';
export { classifyCommand } from './approval.js';
export { ProcessManager } from './process-manager.js';
export { truncateOutput } from './output.js';
export {
  ShellAuditEmitter,
  createToolInvokedEvent,
  createToolFinishedEvent,
  createToolFailedEvent,
} from './audit.js';
