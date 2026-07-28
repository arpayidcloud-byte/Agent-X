import { createHash } from 'crypto';

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly checksum: string;
}

export class PolicyValidator {
  validate(action: string, policies: string[]): ValidationResult {
    const errors: string[] = [];
    if (!policies.includes('allow-all')) errors.push(`No matching policy for: ${action}`);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ action, policies, errors }))
      .digest('hex');
    return Object.freeze({ valid: errors.length === 0, errors, checksum });
  }
}

export class SafetyValidator {
  validate(action: string, safetyRules: string[]): ValidationResult {
    const blocked = safetyRules.some((r) => action.includes(r));
    const checksum = createHash('sha256').update(JSON.stringify({ action, blocked })).digest('hex');
    return Object.freeze({
      valid: !blocked,
      errors: blocked ? [`Unsafe action: ${action}`] : [],
      checksum,
    });
  }
}

export class ConstraintValidator {
  validate(action: string, constraints: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];
    for (const [key, value] of Object.entries(constraints)) {
      if (typeof value === 'string' && !action.includes(key))
        errors.push(`Missing constraint: ${key}`);
    }
    const checksum = createHash('sha256')
      .update(JSON.stringify({ action, constraints, errors }))
      .digest('hex');
    return Object.freeze({ valid: errors.length === 0, errors, checksum });
  }
}

export class ResourceOptimizer {
  private allocations = new Map<string, number>();

  allocate(resource: string, amount: number): void {
    this.allocations.set(resource, amount);
  }

  release(resource: string): void {
    this.allocations.delete(resource);
  }

  getAllocations(): Map<string, number> {
    return new Map(this.allocations);
  }

  getTotal(): number {
    let total = 0;
    for (const v of this.allocations.values()) total += v;
    return total;
  }
}
