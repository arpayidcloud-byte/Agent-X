/**
 * @module git
 * @description Git Tool Foundation for the AgentX Tool SDK.
 *
 * This module implements secure git command execution following:
 * - Volume 7 (Tool SDK) specifications
 * - Volume 2 (Core Runtime) event patterns
 * - Volume 13 (Observability) structured logging
 * - ADR-0005 (Destructive Action Classification)
 *
 * Key features:
 * - Repository detection and validation
 * - Git sandbox enforcement
 * - All operations via child_process.spawn() ONLY
 * - Audit event emission
 * - Approval classification (Safe/PotentiallyDestructive/Destructive)
 */

// Types and interfaces
export type {
  GitRepositoryInfo,
  GitSandboxConfig,
  GitOperation,
  GitExecutionRequest,
  GitExecutionResult,
  GitParsedOutput,
  GitStatusOutput,
  GitStatusFile,
  GitDiffOutput,
  GitDiffFile,
  GitDiffHunk,
  GitLogOutput,
  GitLogEntry,
  GitBranchOutput,
  GitBranchInfo,
  GitAuditEvent,
  GitApprovalClassification,
  GitExecutionContext,
  IGitSandbox,
  IGitValidator,
  IGitExecutor,
} from './interfaces.js';

// Errors
export {
  GitError,
  GitOperationNotAllowedError,
  GitOperationBlockedError,
  GitRepositoryNotFoundError,
  GitInvalidBranchError,
  GitInvalidRefError,
  GitDetachedHeadError,
  GitForceNotAllowedError,
  GitTimeoutError,
  GitWorkspaceEscapeError,
  GitEmptyCommitError,
  GitOrphanBranchError,
} from './errors.js';

// Repository detection
export {
  createNonGitRepositoryInfo,
  parseRepositoryInfo,
  isWithinWorkspace,
} from './repository.js';

// Validation
export {
  validateStatusOutput,
  validateBranchName,
  validateRef,
  validateCommitMessage,
  detectDangerousFlags,
  isForceOperation,
  isOrphanBranch,
  isEmptyCommit,
} from './validator.js';

// Sandbox
export { GitSandbox } from './sandbox.js';

// Executor
export { GitExecutor } from './executor.js';

// Git Read Tools
export { GitStatusTool } from './git-status.js';
export { GitDiffTool } from './git-diff.js';
export { GitLogTool } from './git-log.js';
export { GitBranchTool } from './git-branch.js';

// Git Write Tools
export { GitAddTool } from './git-add.js';
export { GitCheckoutTool } from './git-checkout.js';
export { GitCommitTool } from './git-commit.js';
export { GitRestoreTool } from './git-restore.js';
export { GitResetTool } from './git-reset.js';

// Approval
export { classifyGitOperation } from './approval.js';

// Audit
export {
  GitAuditEmitter,
  createGitInvokedEvent,
  createGitFinishedEvent,
  createGitFailedEvent,
} from './audit.js';
