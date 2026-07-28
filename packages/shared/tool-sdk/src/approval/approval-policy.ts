/**
 * @module approval/approval-policy
 * @description Approval policy configuration and risk classification.
 * Implements risk-based approval policies per Volume 7 and ADR-0005.
 */

import type { ApprovalPolicyConfig, RiskLevel } from './interfaces.js';

/** Default approval policy configuration */
const DEFAULT_POLICY_CONFIG: ApprovalPolicyConfig = {
  autoApproveThreshold: 39,
  manualApprovalThreshold: 40,
  doubleConfirmationThreshold: 90,
  defaultTtlMs: 15 * 60 * 1000, // 15 minutes
  requireDoubleConfirmation: true,
};

/**
 * Creates an approval policy with defaults
 * @param config - Partial configuration to override defaults
 * @returns Merged ApprovalPolicyConfig
 */
export function createApprovalPolicy(
  config: Partial<ApprovalPolicyConfig> = {},
): ApprovalPolicyConfig {
  return { ...DEFAULT_POLICY_CONFIG, ...config };
}

/**
 * Determines if a risk score requires auto-approval
 * @param riskScore - Risk score (0-100)
 * @param policy - Policy configuration
 * @returns true if auto-approval is sufficient
 */
export function requiresAutoApproval(riskScore: number, policy: ApprovalPolicyConfig): boolean {
  return riskScore <= policy.autoApproveThreshold;
}

/**
 * Determines if a risk score requires manual approval
 * @param riskScore - Risk score (0-100)
 * @param policy - Policy configuration
 * @returns true if manual approval is required
 */
export function requiresManualApproval(riskScore: number, policy: ApprovalPolicyConfig): boolean {
  return riskScore >= policy.manualApprovalThreshold;
}

/**
 * Determines if a risk score requires double confirmation
 * @param riskScore - Risk score (0-100)
 * @param policy - Policy configuration
 * @returns true if double confirmation is required
 */
export function requiresDoubleConfirmation(
  riskScore: number,
  policy: ApprovalPolicyConfig,
): boolean {
  return riskScore >= policy.doubleConfirmationThreshold && policy.requireDoubleConfirmation;
}

/**
 * Classifies a risk score into a risk level
 * @param riskScore - Risk score (0-100)
 * @returns Risk level classification
 */
export function classifyRiskLevel(riskScore: number): RiskLevel {
  if (riskScore < 40) return 'Safe';
  if (riskScore < 90) return 'PotentiallyDestructive';
  return 'Destructive';
}

/**
 * Determines if an approval is required for a risk score
 * @param riskScore - Risk score (0-100)
 * @param policy - Policy configuration
 * @returns true if approval is required
 */
export function isApprovalRequired(riskScore: number, policy: ApprovalPolicyConfig): boolean {
  return riskScore >= policy.manualApprovalThreshold;
}
