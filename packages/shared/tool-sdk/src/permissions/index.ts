import type {
  IPermissionResolver,
  IPermissionEvaluator,
  PermissionPolicy,
  ToolCategory,
  ToolExecutionRequest,
  ITool,
  RiskScore,
} from '../interfaces/index.js';
import { PermissionDeniedError } from '../errors/index.js';

export class PermissionResolver implements IPermissionResolver {
  private policies = new Map<string, PermissionPolicy>();

  constructor() {
    // Default v0.1 permissions per Volume 7 Ch.2 and Vol 3 Ch.2
    this.policies.set('coding', {
      allowedCategories: [
        'fs.read',
        'fs.write',
        'shell.build',
        'shell.exec',
        'git.read',
        'git.write',
      ],
      maxRiskScore: 100,
    });
    this.policies.set('review', {
      allowedCategories: ['fs.read', 'git.read'],
      maxRiskScore: 50,
    });
    this.policies.set('test', {
      allowedCategories: ['fs.read', 'fs.write', 'shell.build', 'shell.exec'],
      maxRiskScore: 100,
    });
    this.policies.set('security', {
      allowedCategories: ['fs.read', 'git.read'],
      maxRiskScore: 50,
    });
  }

  public resolvePolicyForAgent(agentRole: string): PermissionPolicy {
    return this.policies.get(agentRole) || { allowedCategories: [], maxRiskScore: 0 };
  }

  public addPolicy(agentRole: string, policy: PermissionPolicy): void {
    this.policies.set(agentRole, policy);
  }
}

export class PermissionEvaluator implements IPermissionEvaluator {
  constructor(private readonly resolver: IPermissionResolver) {}

  public isAllowed(agentRole: string, category: ToolCategory, riskScore?: RiskScore): boolean {
    const policy = this.resolver.resolvePolicyForAgent(agentRole);

    // Check blocked categories first
    if (policy.blockedCategories?.includes(category)) {
      return false;
    }

    // Check allowed categories
    if (!policy.allowedCategories.includes(category)) {
      return false;
    }

    // Check risk score if provided and policy has a max
    if (riskScore !== undefined && policy.maxRiskScore !== undefined) {
      if (riskScore > policy.maxRiskScore) {
        return false;
      }
    }

    return true;
  }

  public evaluate(req: ToolExecutionRequest, tool: ITool): boolean {
    const allowed = this.isAllowed(req.context.agentRole, req.category, tool.metadata.riskScore);

    if (!allowed) {
      throw new PermissionDeniedError(
        req.context.agentRole,
        req.category,
        `Tool ${req.toolName} requires permissions not granted to ${req.context.agentRole}`,
      );
    }

    return true;
  }
}
