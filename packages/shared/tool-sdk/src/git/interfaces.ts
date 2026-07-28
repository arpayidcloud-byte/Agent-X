/**
 * @module git/interfaces
 * @description Git Tool Foundation interfaces for the AgentX Tool SDK.
 * All interfaces follow dependency inversion and provider-agnostic patterns.
 */

import type { ToolCategory } from '../interfaces/index.js';

/** @description Git repository detection result */
export interface GitRepositoryInfo {
  /** Whether this is a valid git repository */
  isGitRepository: boolean;
  /** Root path of the git repository */
  rootPath: string;
  /** Whether this is a bare repository */
  isBare: boolean;
  /** Whether this is a worktree */
  isWorktree: boolean;
  /** Whether HEAD is detached */
  isDetachedHead: boolean;
  /** Current branch name */
  currentBranch?: string;
  /** Current HEAD commit hash */
  headCommitHash?: string;
}

/** @description Git sandbox configuration */
export interface GitSandboxConfig {
  /** Workspace root directory */
  workspaceRoot: string;
  /** Allowed git operations */
  allowedOperations: GitOperation[];
  /** Blocked git operations */
  blockedOperations: GitOperation[];
  /** Whether to allow force operations */
  allowForceOperations: boolean;
  /** Whether to allow detached HEAD operations */
  allowDetachedHead: boolean;
}

/** @description Git operation types */
export type GitOperation =
  | 'git.status'
  | 'git.diff'
  | 'git.log'
  | 'git.branch'
  | 'git.show'
  | 'git.revparse'
  | 'git.lsfiles'
  | 'git.add'
  | 'git.restore'
  | 'git.checkout'
  | 'git.commit'
  | 'git.reset';

/** @description Git execution request */
export interface GitExecutionRequest {
  /** Git operation to perform */
  operation: GitOperation;
  /** Arguments for the operation */
  args: string[];
  /** Working directory override */
  workingDirectory?: string;
  /** Task context for audit trail */
  taskId: string;
  /** Trace ID for correlation */
  traceId: string;
  /** Agent role performing the operation */
  agentRole: string;
}

/** @description Git execution result */
export interface GitExecutionResult {
  /** Whether the operation was allowed */
  allowed: boolean;
  /** Exit code from the process */
  exitCode: number;
  /** Standard output */
  stdout: string;
  /** Standard error */
  stderr: string;
  /** Duration in milliseconds */
  durationMs: number;
  /** Whether the operation timed out */
  timedOut: boolean;
  /** Parsed output (operation-specific) */
  parsedOutput?: GitParsedOutput;
  /** Current branch */
  branch?: string;
  /** Current commit hash */
  commitHash?: string;
}

/** @description Parsed git output (operation-specific) */
export interface GitParsedOutput {
  /** Operation that produced this output */
  operation: GitOperation;
  /** Raw output string */
  raw: string;
  /** Structured data (operation-specific) */
  data: unknown;
}

/** @description Git status output */
export interface GitStatusOutput {
  /** Current branch */
  branch: string;
  /** Ahead count */
  ahead: number;
  /** Behind count */
  behind: number;
  /** Changed files */
  changed: GitStatusFile[];
}

/** @description Git status file entry */
export interface GitStatusFile {
  /** File path relative to repository root */
  path: string;
  /** Status code (e.g., 'M', 'A', 'D', 'R') */
  statusCode: string;
  /** Index status */
  indexStatus: string;
  /** Working tree status */
  workingTreeStatus: string;
}

/** @description Git diff output */
export interface GitDiffOutput {
  /** Diff content */
  content: string;
  /** Changed files */
  files: GitDiffFile[];
}

/** @description Git diff file entry */
export interface GitDiffFile {
  /** File path */
  path: string;
  /** Diff hunks */
  hunks: GitDiffHunk[];
}

/** @description Git diff hunk */
export interface GitDiffHunk {
  /** Start line */
  startLine: number;
  /** Line count */
  lineCount: number;
  /** Diff lines */
  lines: string[];
}

/** @description Git log entry */
export interface GitLogEntry {
  /** Commit hash */
  hash: string;
  /** Author name */
  author: string;
  /** Author email */
  email: string;
  /** Commit date */
  date: string;
  /** Commit message */
  message: string;
  /** Parent hashes */
  parents: string[];
}

/** @description Git branch info */
export interface GitBranchInfo {
  /** Branch name */
  name: string;
  /** Whether it's the current branch */
  current: boolean;
  /** Whether it's a remote branch */
  remote: boolean;
  /** Last commit hash */
  lastCommit?: string;
}

/** @description Git log output */
export interface GitLogOutput {
  /** Log entries */
  entries: GitLogEntry[];
}

/** @description Git branch output */
export interface GitBranchOutput {
  /** Branches */
  branches: GitBranchInfo[];
}

/** @description Audit event for git operations */
export interface GitAuditEvent {
  /** Event type */
  eventType: 'tool.invoked' | 'tool.finished' | 'tool.failed';
  /** Tool category */
  category: ToolCategory;
  /** Git operation */
  operation: GitOperation;
  /** Repository path */
  repository: string;
  /** Current branch */
  branch?: string;
  /** Commit hash */
  commitHash?: string;
  /** Exit code */
  exitCode?: number;
  /** Duration in milliseconds */
  durationMs?: number;
  /** Whether the operation was allowed */
  allowed: boolean;
  /** Task ID */
  taskId: string;
  /** Trace ID */
  traceId: string;
  /** Agent role */
  agentRole: string;
  /** Timestamp */
  timestamp: Date;
}

/** @description Approval classification for git operations */
export interface GitApprovalClassification {
  /** Whether this operation requires approval */
  requiresApproval: boolean;
  /** Risk score (0-100) */
  riskScore: number;
  /** Classification label */
  classification: 'Safe' | 'PotentiallyDestructive' | 'Destructive';
  /** Reason for classification */
  reason: string;
}

/** @description Git execution context */
export interface GitExecutionContext {
  /** Workspace root directory */
  workspaceRoot: string;
  /** Sandbox configuration */
  sandboxConfig: GitSandboxConfig;
}

/** @description Git sandbox interface */
export interface IGitSandbox {
  /** Validate a git operation */
  validate(request: GitExecutionRequest): Promise<GitRepositoryInfo>;
  /** Check if an operation is allowed */
  isOperationAllowed(operation: GitOperation): boolean;
}

/** @description Git validator interface */
export interface IGitValidator {
  /** Validate parsed output */
  validateStatus(output: string): boolean;
  /** Validate branch name */
  validateBranchName(name: string): boolean;
  /** Validate ref */
  validateRef(ref: string): boolean;
}

/** @description Git executor interface */
export interface IGitExecutor {
  /** Execute a git operation */
  execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
}
