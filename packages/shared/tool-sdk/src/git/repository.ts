/**
 * @module git/repository
 * @description Git repository detection and validation.
 * Detects git repositories, worktrees, detached HEAD, and bare repositories.
 */

import type { GitRepositoryInfo } from './interfaces.js';

/**
 * Creates a default repository info for non-git directories
 * @param path - The directory path
 * @returns GitRepositoryInfo with isGitRepository=false
 */
export function createNonGitRepositoryInfo(path: string): GitRepositoryInfo {
  return {
    isGitRepository: false,
    rootPath: path,
    isBare: false,
    isWorktree: false,
    isDetachedHead: false,
    currentBranch: undefined,
    headCommitHash: undefined,
  };
}

/**
 * Parses git repository info from git output
 * @param rootPath - Root path of the repository
 * @param gitDir - Git directory path
 * @param headContent - Content of HEAD file
 * @returns Parsed GitRepositoryInfo
 */
export function parseRepositoryInfo(
  rootPath: string,
  gitDir: string,
  headContent?: string,
): GitRepositoryInfo {
  const isBare = gitDir.endsWith('/.git') === false && gitDir !== '.git';
  const isWorktree =
    gitDir.includes('.git/worktrees/') || (headContent?.includes('gitdir: ') ?? false);

  let currentBranch: string | undefined;
  let isDetachedHead = true;
  let headCommitHash: string | undefined;

  if (headContent) {
    const trimmed = headContent.trim();
    if (trimmed.startsWith('ref: refs/heads/')) {
      currentBranch = trimmed.replace('ref: refs/heads/', '');
      isDetachedHead = false;
    } else if (trimmed.length === 40) {
      // Detached HEAD - 40 char commit hash
      headCommitHash = trimmed;
    }
  }

  return {
    isGitRepository: true,
    rootPath,
    isBare,
    isWorktree,
    isDetachedHead,
    currentBranch,
    headCommitHash,
  };
}

/**
 * Validates that a path is within the workspace
 * @param targetPath - Path to validate
 * @param workspaceRoot - Workspace root directory
 * @returns true if path is within workspace
 */
export function isWithinWorkspace(targetPath: string, workspaceRoot: string): boolean {
  const normalizedTarget = targetPath.replace(/\\/g, '/');
  const normalizedRoot = workspaceRoot.replace(/\\/g, '/').replace(/\/$/, '');
  return normalizedTarget.startsWith(normalizedRoot + '/') || normalizedTarget === normalizedRoot;
}
