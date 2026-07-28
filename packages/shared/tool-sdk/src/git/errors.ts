/**
 * @module git/errors
 * @description Error types for Git Tool Foundation.
 */

import { ToolError } from '../errors/index.js';

/** Base error for all git execution errors */
export class GitError extends ToolError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

/** Thrown when a git operation is not allowed */
export class GitOperationNotAllowedError extends GitError {
  constructor(operation: string) {
    super(`Git operation '${operation}' is not allowed`, 'GIT_OPERATION_NOT_ALLOWED');
  }
}

/** Thrown when a git operation is blocked */
export class GitOperationBlockedError extends GitError {
  constructor(operation: string, reason: string) {
    super(`Git operation '${operation}' is blocked: ${reason}`, 'GIT_OPERATION_BLOCKED');
  }
}

/** Thrown when a repository is not valid */
export class GitRepositoryNotFoundError extends GitError {
  constructor(path: string) {
    super(`No git repository found at '${path}'`, 'GIT_REPOSITORY_NOT_FOUND');
  }
}

/** Thrown when a branch is invalid */
export class GitInvalidBranchError extends GitError {
  constructor(branch: string) {
    super(`Invalid branch name: '${branch}'`, 'GIT_INVALID_BRANCH');
  }
}

/** Thrown when a ref is invalid */
export class GitInvalidRefError extends GitError {
  constructor(ref: string) {
    super(`Invalid ref: '${ref}'`, 'GIT_INVALID_REF');
  }
}

/** Thrown when HEAD is detached and operation requires a branch */
export class GitDetachedHeadError extends GitError {
  constructor() {
    super('Operation requires a branch but HEAD is detached', 'GIT_DETACHED_HEAD');
  }
}

/** Thrown when force operations are disabled */
export class GitForceNotAllowedError extends GitError {
  constructor(operation: string) {
    super(`Force operations are not allowed: '${operation}'`, 'GIT_FORCE_NOT_ALLOWED');
  }
}

/** Thrown when git execution times out */
export class GitTimeoutError extends GitError {
  constructor(operation: string, timeoutMs: number) {
    super(`Git operation '${operation}' timed out after ${timeoutMs}ms`, 'GIT_TIMEOUT');
  }
}

/** Thrown when working directory escapes workspace */
export class GitWorkspaceEscapeError extends GitError {
  constructor(path: string, workspace: string) {
    super(`Path '${path}' escapes workspace '${workspace}'`, 'GIT_WORKSPACE_ESCAPE');
  }
}

/** Thrown when empty commit is attempted */
export class GitEmptyCommitError extends GitError {
  constructor() {
    super('Empty commit is not allowed', 'GIT_EMPTY_COMMIT');
  }
}

/** Thrown when orphan branch is attempted */
export class GitOrphanBranchError extends GitError {
  constructor(branch: string) {
    super(`Orphan branch '${branch}' is not allowed`, 'GIT_ORPHAN_BRANCH');
  }
}
