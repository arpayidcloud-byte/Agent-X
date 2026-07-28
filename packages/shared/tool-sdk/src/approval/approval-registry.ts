/**
 * @module approval/approval-registry
 * @description Approval registry for managing approval configurations.
 * Maps tool categories to approval requirements.
 */

import type { ToolCategory } from '../interfaces/index.js';
import type { ApprovalRegistryEntry } from './interfaces.js';

/**
 * Default approval registry entries
 */
const DEFAULT_REGISTRY: ApprovalRegistryEntry[] = [
  // Read-only operations - Safe
  {
    category: 'fs.read',
    riskScore: 10,
    riskLevel: 'Safe',
    requiresApproval: false,
    description: 'File read operation',
  },
  {
    category: 'git.read',
    riskScore: 10,
    riskLevel: 'Safe',
    requiresApproval: false,
    description: 'Git read operation',
  },

  // Potentially destructive operations
  {
    category: 'fs.write',
    riskScore: 60,
    riskLevel: 'PotentiallyDestructive',
    requiresApproval: true,
    description: 'File write operation',
  },
  {
    category: 'shell.build',
    riskScore: 50,
    riskLevel: 'PotentiallyDestructive',
    requiresApproval: false,
    description: 'Build command',
  },
  {
    category: 'git.write',
    riskScore: 70,
    riskLevel: 'PotentiallyDestructive',
    requiresApproval: true,
    description: 'Git write operation',
  },

  // Destructive operations
  {
    category: 'shell.exec',
    riskScore: 90,
    riskLevel: 'Destructive',
    requiresApproval: true,
    description: 'Shell execution',
  },
];

/**
 * Approval registry
 */
export class ApprovalRegistry {
  private entries: Map<string, ApprovalRegistryEntry> = new Map();

  constructor() {
    // Register default entries
    for (const entry of DEFAULT_REGISTRY) {
      this.entries.set(entry.category, entry);
    }
  }

  /**
   * Gets the approval entry for a category
   * @param category - Tool category
   * @returns ApprovalRegistryEntry or undefined
   */
  getEntry(category: ToolCategory): ApprovalRegistryEntry | undefined {
    return this.entries.get(category);
  }

  /**
   * Registers a new approval entry
   * @param entry - The entry to register
   */
  registerEntry(entry: ApprovalRegistryEntry): void {
    this.entries.set(entry.category, entry);
  }

  /**
   * Gets the risk score for a category
   * @param category - Tool category
   * @returns Risk score or 0 if not found
   */
  getRiskScore(category: ToolCategory): number {
    return this.entries.get(category)?.riskScore ?? 0;
  }

  /**
   * Checks if a category requires approval
   * @param category - Tool category
   * @returns true if approval is required
   */
  requiresApproval(category: ToolCategory): boolean {
    const entry = this.entries.get(category);
    return entry?.requiresApproval ?? false;
  }
}
