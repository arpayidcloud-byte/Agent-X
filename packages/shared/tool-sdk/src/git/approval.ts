/**
 * @module git/approval
 * @description Approval classification for git operations.
 * Implements risk-based classification per Volume 7 and ADR-0005.
 */

import type { GitOperation, GitApprovalClassification } from './interfaces.js';

/** Risk scores for git operations */
const GIT_RISK_SCORES: Record<GitOperation, number> = {
  'git.status': 10,
  'git.diff': 10,
  'git.log': 10,
  'git.branch': 10,
  'git.show': 10,
  'git.revparse': 10,
  'git.lsfiles': 10,
  'git.add': 40,
  'git.restore': 60,
  'git.checkout': 70,
  'git.commit': 80,
  'git.reset': 95,
};

/** Classification labels */
const GIT_CLASSIFICATIONS: Record<GitOperation, 'Safe' | 'PotentiallyDestructive' | 'Destructive'> =
  {
    'git.status': 'Safe',
    'git.diff': 'Safe',
    'git.log': 'Safe',
    'git.branch': 'Safe',
    'git.show': 'Safe',
    'git.revparse': 'Safe',
    'git.lsfiles': 'Safe',
    'git.add': 'PotentiallyDestructive',
    'git.restore': 'PotentiallyDestructive',
    'git.checkout': 'PotentiallyDestructive',
    'git.commit': 'PotentiallyDestructive',
    'git.reset': 'Destructive',
  };

/** Classification reasons */
const GIT_REASONS: Record<GitOperation, string> = {
  'git.status': 'Read-only status query',
  'git.diff': 'Read-only diff query',
  'git.log': 'Read-only log query',
  'git.branch': 'Read-only branch listing',
  'git.show': 'Read-only commit display',
  'git.revparse': 'Read-only ref resolution',
  'git.lsfiles': 'Read-only file listing',
  'git.add': 'Stages changes for commit',
  'git.restore': 'Restores file contents',
  'git.checkout': 'Switches branches or files',
  'git.commit': 'Creates a new commit',
  'git.reset': 'Resets history (potentially destructive)',
};

/**
 * Classifies a git operation for approval requirements
 * @param operation - The git operation
 * @returns Approval classification with risk score
 */
export function classifyGitOperation(operation: GitOperation): GitApprovalClassification {
  const riskScore = GIT_RISK_SCORES[operation] || 50;
  const classification = GIT_CLASSIFICATIONS[operation] || 'PotentiallyDestructive';
  const reason = GIT_REASONS[operation] || 'Unknown operation';

  return {
    requiresApproval:
      classification === 'Destructive' || classification === 'PotentiallyDestructive',
    riskScore,
    classification,
    reason,
  };
}
