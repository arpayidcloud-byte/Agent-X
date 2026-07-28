import type { ToolCategory, ToolClassification, RiskScore } from '../interfaces/index.js';
import { PermissionLevel } from '../interfaces/index.js';

export class ToolClassifier {
  public static classifyCategory(category: ToolCategory): ToolClassification {
    // According to ADR-0005, ALL fs.write calls are unconditionally destructive in v0.1
    if (['fs.write', 'shell.exec', 'git.write'].includes(category)) {
      return 'Destructive';
    }

    if (category === 'shell.build') {
      return 'PotentiallyDestructive';
    }

    return 'Safe';
  }

  public static getRiskScore(category: ToolCategory): RiskScore {
    const classification = this.classifyCategory(category);
    switch (classification) {
      case 'Destructive':
        return 90;
      case 'PotentiallyDestructive':
        return 50;
      case 'Safe':
        return 10;
      default:
        return 100;
    }
  }

  public static requiresApproval(classification: ToolClassification): boolean {
    return classification === 'Destructive';
  }

  public static getRequiredPermissionLevel(category: ToolCategory): PermissionLevel {
    const classification = this.classifyCategory(category);
    switch (classification) {
      case 'Destructive':
        return PermissionLevel.DESTRUCTIVE;
      case 'PotentiallyDestructive':
        return PermissionLevel.WRITE;
      case 'Safe':
        return PermissionLevel.READ_ONLY;
      default:
        return PermissionLevel.SYSTEM;
    }
  }
}
