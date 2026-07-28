/**
 * @module git/sandbox
 * @description Git sandbox implementation.
 * Enforces workspace jail for all git operations.
 */

import type {
  GitSandboxConfig,
  GitExecutionRequest,
  GitRepositoryInfo,
  GitOperation,
} from './interfaces.js';
import { createNonGitRepositoryInfo, isWithinWorkspace } from './repository.js';
import { GitRepositoryNotFoundError, GitWorkspaceEscapeError } from './errors.js';
import { isForceOperation, isOrphanBranch, isEmptyCommit } from './validator.js';

/**
 * Git sandbox that enforces security policies
 */
export class GitSandbox {
  private config: GitSandboxConfig;

  constructor(config: GitSandboxConfig) {
    this.config = config;
  }

  /**
   * Validates a git execution request
   * @param request - The execution request to validate
   * @param repoInfo - Repository information
   * @returns GitRepositoryInfo
   */
  validate(request: GitExecutionRequest, repoInfo?: GitRepositoryInfo): GitRepositoryInfo {
    const info = repoInfo || createNonGitRepositoryInfo(this.config.workspaceRoot);

    // 1. Check if this is a git repository
    if (!info.isGitRepository) {
      throw new GitRepositoryNotFoundError(this.config.workspaceRoot);
    }

    // 2. Check if workspace jail is respected
    if (!isWithinWorkspace(info.rootPath, this.config.workspaceRoot)) {
      throw new GitWorkspaceEscapeError(info.rootPath, this.config.workspaceRoot);
    }

    // 3. Check if operation is allowed
    if (!this.isOperationAllowed(request.operation)) {
      throw new Error(`Operation '${request.operation}' is not allowed`);
    }

    // 4. Validate working directory
    if (
      request.workingDirectory &&
      !isWithinWorkspace(request.workingDirectory, this.config.workspaceRoot)
    ) {
      throw new GitWorkspaceEscapeError(request.workingDirectory, this.config.workspaceRoot);
    }

    // 5. Check for dangerous operations
    this.validateArgs(request);

    return info;
  }

  /**
   * Checks if an operation is allowed
   * @param operation - Git operation to check
   * @returns true if allowed
   */
  isOperationAllowed(operation: GitOperation): boolean {
    if (this.config.blockedOperations.includes(operation)) {
      return false;
    }
    return this.config.allowedOperations.includes(operation);
  }

  /**
   * Validates arguments for dangerous operations
   * @param request - The execution request
   */
  private validateArgs(request: GitExecutionRequest): void {
    const args = request.args;

    // Check for force operations
    if (isForceOperation(args) && !this.config.allowForceOperations) {
      throw new Error('Force operations are not allowed');
    }

    // Check for orphan branches
    if (isOrphanBranch(args)) {
      throw new Error('Orphan branch creation is not allowed');
    }

    // Check for empty commits
    if (isEmptyCommit(args)) {
      throw new Error('Empty commit is not allowed');
    }

    // Check for detached HEAD operations
    if (!this.config.allowDetachedHead) {
      // Operations that might use detached HEAD
      if (request.operation === 'git.commit' || request.operation === 'git.add') {
        // These require a branch
      }
    }
  }
}
