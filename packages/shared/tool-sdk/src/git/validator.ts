/**
 * @module git/validator
 * @description Git command validation.
 * Validates branch names, refs, status output, and command rules.
 */

/** @description Validates git status output format */
export function validateStatusOutput(output: string): boolean {
  if (!output || output.trim().length === 0) {
    return false;
  }
  // Status output should contain branch info or file status indicators
  const validIndicators = [
    'On branch',
    'Changes to be committed',
    'Changes not staged',
    'Untracked files',
    'nothing to commit',
  ];
  return validIndicators.some((indicator) => output.includes(indicator));
}

/** @description Validates branch name format */
export function validateBranchName(name: string): boolean {
  if (!name || name.length === 0) {
    return false;
  }

  // Git branch name rules
  const invalidPatterns = [
    /^\./, // cannot start with .
    /\.\./, // cannot contain ..
    /[\s~^:?*\\]/, // cannot contain these characters
    /\/$/, // cannot end with /
    /\/\//, // cannot contain multiple consecutive slashes
    /\.lock$/, // cannot end with .lock
    /\{/, // cannot contain {
    /}/, // cannot contain }
    /@/, // cannot contain @
    /\[/, // cannot contain [
    /\]/, // cannot contain ]
  ];

  return !invalidPatterns.some((pattern) => pattern.test(name));
}

/** @description Validates git ref format */
export function validateRef(ref: string): boolean {
  if (!ref || ref.length === 0) {
    return false;
  }

  // Valid refs: branch names, commit hashes, tags
  // Invalid refs: refs with invalid characters
  const invalidChars = [' ', '\t', '\n', '\r', '~', '^', ':', '?', '*', '[', '\\'];
  return !invalidChars.some((char) => ref.includes(char));
}

/** @description Validates commit message */
export function validateCommitMessage(message: string): boolean {
  if (!message || message.trim().length === 0) {
    return false;
  }
  // First line should be <= 72 characters
  const firstLine = message.split('\n')[0] || '';
  return firstLine.length <= 72;
}

/** @description Detects dangerous git flags */
export function detectDangerousFlags(args: string[]): string[] {
  const dangerous: string[] = [];

  for (const arg of args) {
    if (arg === '--force' || arg === '-f') {
      dangerous.push(arg);
    } else if (arg === '--hard') {
      dangerous.push(arg);
    } else if (arg === '--orphan') {
      dangerous.push(arg);
    } else if (arg === '--allow-empty') {
      dangerous.push(arg);
    }
  }

  return dangerous;
}

/** @description Detects force operations */
export function isForceOperation(args: string[]): boolean {
  return args.includes('--force') || args.includes('-f') || args.includes('--hard');
}

/** @description Detects orphan branch operations */
export function isOrphanBranch(args: string[]): boolean {
  const idx = args.indexOf('--orphan');
  return idx !== -1 && idx < args.length - 1;
}

/** @description Detects empty commit operations */
export function isEmptyCommit(args: string[]): boolean {
  return args.includes('--allow-empty') || args.includes('--allow-empty-message');
}
