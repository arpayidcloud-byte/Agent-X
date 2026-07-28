/**
 * @module shell/interfaces
 * @description Shell Execution Foundation interfaces for the AgentX Tool SDK.
 * All interfaces are immutable and follow the dependency inversion principle.
 */

import type { ToolCategory } from '../interfaces/index.js';
export { ToolCategory } from '../interfaces/index.js';

/** @description Represents a parsed shell command structure */
export interface ParsedCommand {
  /** The executable program name (e.g., 'npm', 'pnpm', 'node') */
  program: string;
  /** Positional arguments */
  args: string[];
  /** Flags/options (--flag, -f) */
  flags: string[];
  /** Working directory if specified via -C or --directory */
  workingDirectory?: string;
  /** Environment variable overrides */
  envOverrides: Record<string, string>;
  /** Whether the command contains pipe operators */
  hasPipe: boolean;
  /** Whether the command contains redirection operators */
  hasRedirection: boolean;
  /** Whether the command contains subshell expansion */
  hasSubshell: boolean;
  /** Raw command string */
  rawCommand: string;
}

/** @description Shell sandbox configuration */
export interface ShellSandboxConfig {
  /** Allowed programs */
  allowedPrograms: string[];
  /** Blocked programs */
  blockedPrograms: string[];
  /** Dangerous flags to reject */
  dangerousFlags: string[];
  /** Default timeout in milliseconds */
  defaultTimeoutMs: number;
  /** Default maximum output size in bytes */
  defaultMaxOutputBytes: number;
  /** Default working directory */
  defaultWorkingDirectory: string;
  /** Whether to scrub environment variables */
  scrubEnvironment: boolean;
}

/** @description Shell execution request */
export interface ShellExecutionRequest {
  /** Raw command string to execute */
  command: string;
  /** Working directory (optional override) */
  workingDirectory?: string;
  /** Timeout override in milliseconds */
  timeoutMs?: number;
  /** Maximum output size override in bytes */
  maxOutputBytes?: number;
  /** Task context for audit trail */
  taskId: string;
  /** Trace ID for correlation */
  traceId: string;
  /** Agent role performing the execution */
  agentRole: string;
}

/** @description Shell execution result */
export interface ShellExecutionResult {
  /** Exit code from the process */
  exitCode: number;
  /** Signal that terminated the process (if any) */
  signal?: string;
  /** Standard output as string */
  stdout: string;
  /** Standard error as string */
  stderr: string;
  /** Execution duration in milliseconds */
  durationMs: number;
  /** Whether the command was allowed */
  allowed: boolean;
  /** Whether the command timed out */
  timedOut: boolean;
  /** Whether resource limits were exceeded */
  resourceLimitsExceeded: boolean;
  /** Parsed command structure */
  parsedCommand: ParsedCommand;
}

/** @description Audit event for shell execution */
export interface ShellAuditEvent {
  /** Event type: 'tool.invoked' | 'tool.finished' | 'tool.failed' */
  eventType: 'tool.invoked' | 'tool.finished' | 'tool.failed';
  /** Tool category */
  category: ToolCategory;
  /** Raw command executed */
  command: string;
  /** Exit code (null if not yet completed) */
  exitCode?: number;
  /** Execution duration in milliseconds */
  durationMs?: number;
  /** Length of stdout output */
  stdoutLength?: number;
  /** Length of stderr output */
  stderrLength?: number;
  /** Whether the command was allowed */
  allowed: boolean;
  /** Whether the command timed out */
  timedOut?: boolean;
  /** Task ID for correlation */
  taskId: string;
  /** Trace ID for correlation */
  traceId: string;
  /** Agent role */
  agentRole: string;
  /** Timestamp */
  timestamp: Date;
}

/** @description Timeout configuration */
export interface TimeoutConfig {
  /** Timeout in milliseconds */
  timeoutMs: number;
  /** Whether to kill on timeout */
  killOnTimeout: boolean;
  /** Grace period before force kill in milliseconds */
  gracePeriodMs: number;
}

/** @description Resource limits configuration */
export interface ResourceLimitsConfig {
  /** Maximum CPU time in milliseconds */
  maxCpuTimeMs: number;
  /** Maximum memory usage in bytes */
  maxMemoryBytes: number;
  /** Maximum output size in bytes */
  maxOutputBytes: number;
  /** Maximum execution time in milliseconds */
  maxExecutionTimeMs: number;
}

/** @description Environment scrubber configuration */
export interface EnvironmentScrubberConfig {
  /** Patterns to scrub (prefixes, exact names) */
  scrubPatterns: string[];
  /** Additional keys to scrub */
  additionalKeys: string[];
}

/** @description Approval classification for shell commands */
export interface ApprovalClassification {
  /** Whether this command requires approval */
  requiresApproval: boolean;
  /** Risk score (0-100) */
  riskScore: number;
  /** Classification label */
  classification: 'Safe' | 'PotentiallyDestructive' | 'Destructive';
  /** Reason for classification */
  reason: string;
}

/** @description Shell execution context */
export interface ShellExecutionContext {
  /** Workspace root directory */
  workspaceRoot: string;
  /** Sandbox configuration */
  sandboxConfig: ShellSandboxConfig;
  /** Timeout configuration */
  timeoutConfig: TimeoutConfig;
  /** Resource limits */
  resourceLimits: ResourceLimitsConfig;
  /** Environment scrubber config */
  environmentScrubber: EnvironmentScrubberConfig;
}

/** @description Audit emitter interface */
export interface IShellAuditEmitter {
  /** Emit an audit event */
  emit(event: ShellAuditEvent): void;
  /** Get all emitted events */
  getEvents(): ShellAuditEvent[];
}

/** @description Shell sandbox interface */
export interface IShellSandbox {
  /** Validate a command against sandbox rules */
  validate(request: ShellExecutionRequest): Promise<ParsedCommand>;
  /** Check if a command is allowed */
  isCommandAllowed(command: string): boolean;
}

/** @description Command validator interface */
export interface ICommandValidator {
  /** Validate a parsed command */
  validate(parsed: ParsedCommand): ValidationResult;
}

/** @description Validation result */
export interface ValidationResult {
  /** Whether the command is valid */
  valid: boolean;
  /** Reasons for rejection */
  reasons: string[];
}

/** @description Shell executor interface */
export interface IShellExecutor {
  /** Execute a shell command */
  execute(request: ShellExecutionRequest): Promise<ShellExecutionResult>;
}
