/**
 * @module shell/approval
 * @description Approval classification for shell commands.
 * Implements ADR-0005: shell.build = Risk 50 (Potentially Destructive),
 * shell.exec = Risk 90 (Destructive).
 */

import type { ApprovalClassification, ParsedCommand } from './interfaces.js';

/**
 * Classifies a shell command for approval requirements
 * @param parsed - The parsed command
 * @param category - The tool category (shell.build or shell.exec)
 * @returns Approval classification with risk score
 */
export function classifyCommand(
  _parsed: ParsedCommand,
  category: 'shell.build' | 'shell.exec',
): ApprovalClassification {
  // shell.build is Potentially Destructive (Risk 50)
  if (category === 'shell.build') {
    return {
      requiresApproval: false, // shell.build does not require approval
      riskScore: 50,
      classification: 'PotentiallyDestructive',
      reason: 'Build command - Potentially Destructive but does not require approval',
    };
  }

  // shell.exec is Destructive (Risk 90) - ADR-0005
  if (category === 'shell.exec') {
    return {
      requiresApproval: true, // shell.exec requires approval
      riskScore: 90,
      classification: 'Destructive',
      reason: 'Exec command - Destructive and requires approval (ADR-0005)',
    };
  }

  // Unknown category - fail closed
  return {
    requiresApproval: true,
    riskScore: 100,
    classification: 'Destructive',
    reason: 'Unknown category - fail closed with maximum risk',
  };
}
