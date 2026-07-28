import { createHash } from 'crypto';

export interface PolicyRule {
  readonly ruleId: string;
  readonly name: string;
  readonly action: string;
  readonly effect: 'ALLOW' | 'DENY';
  readonly checksum: string;
}

export class RuntimePolicyEngine {
  private rules = new Map<string, PolicyRule>();

  addRule(name: string, action: string, effect: 'ALLOW' | 'DENY'): PolicyRule {
    const ruleId = `rule-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ ruleId, name, action, effect }))
      .digest('hex');
    const rule: PolicyRule = Object.freeze({ ruleId, name, action, effect, checksum });
    this.rules.set(ruleId, rule);
    return rule;
  }

  evaluate(action: string): 'ALLOW' | 'DENY' {
    for (const rule of this.rules.values()) {
      if (rule.action === action || rule.action === '*') {
        return rule.effect;
      }
    }
    return 'DENY';
  }

  get(ruleId: string): PolicyRule | undefined {
    return this.rules.get(ruleId);
  }

  delete(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  getAll(): PolicyRule[] {
    return Array.from(this.rules.values());
  }
}

export interface SecurityEvent {
  readonly eventId: string;
  readonly type: string;
  readonly source: string;
  readonly details: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class RuntimeSecurityEngine {
  private events: SecurityEvent[] = [];
  private blockedSources = new Set<string>();

  recordEvent(type: string, source: string, details: Record<string, unknown>): SecurityEvent {
    const eventId = `se-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ eventId, type, source, details }))
      .digest('hex');
    const event: SecurityEvent = Object.freeze({
      eventId,
      type,
      source,
      details: { ...details },
      timestamp: new Date(),
      checksum,
    });
    this.events.push(event);
    return event;
  }

  blockSource(source: string): void {
    this.blockedSources.add(source);
  }

  unblockSource(source: string): void {
    this.blockedSources.delete(source);
  }

  isBlocked(source: string): boolean {
    return this.blockedSources.has(source);
  }

  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  getBlockedSources(): string[] {
    return Array.from(this.blockedSources);
  }
}

export interface CompatibilityEntry {
  readonly packageName: string;
  readonly version: string;
  readonly compatibleVersions: readonly string[];
  readonly checksum: string;
}

export class RuntimeCompatibilityEngine {
  private entries = new Map<string, CompatibilityEntry>();

  register(packageName: string, version: string, compatibleVersions: string[]): CompatibilityEntry {
    const checksum = createHash('sha256')
      .update(JSON.stringify({ packageName, version, compatibleVersions }))
      .digest('hex');
    const entry: CompatibilityEntry = Object.freeze({
      packageName,
      version,
      compatibleVersions: [...compatibleVersions],
      checksum,
    });
    this.entries.set(packageName, entry);
    return entry;
  }

  isCompatible(packageName: string, version: string): boolean {
    const entry = this.entries.get(packageName);
    if (!entry) return false;
    if (entry.version === version) return true;
    return entry.compatibleVersions.includes(version);
  }

  get(packageName: string): CompatibilityEntry | undefined {
    return this.entries.get(packageName);
  }

  getAll(): CompatibilityEntry[] {
    return Array.from(this.entries.values());
  }
}

export interface ResourceQuota {
  readonly resourceId: string;
  readonly tenantId: string;
  readonly maxCpu: number;
  readonly maxMemoryMb: number;
  readonly maxStorageMb: number;
  readonly checksum: string;
}

export class ResourceManager {
  private quotas = new Map<string, ResourceQuota>();
  private usage = new Map<string, { cpu: number; memoryMb: number; storageMb: number }>();

  setQuota(
    tenantId: string,
    maxCpu: number,
    maxMemoryMb: number,
    maxStorageMb: number,
  ): ResourceQuota {
    const resourceId = `rq-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ resourceId, tenantId, maxCpu, maxMemoryMb, maxStorageMb }))
      .digest('hex');
    const quota: ResourceQuota = Object.freeze({
      resourceId,
      tenantId,
      maxCpu,
      maxMemoryMb,
      maxStorageMb,
      checksum,
    });
    this.quotas.set(resourceId, quota);
    return quota;
  }

  getQuota(resourceId: string): ResourceQuota | undefined {
    return this.quotas.get(resourceId);
  }

  recordUsage(tenantId: string, cpu: number, memoryMb: number, storageMb: number): void {
    this.usage.set(tenantId, { cpu, memoryMb, storageMb });
  }

  getUsage(tenantId: string): { cpu: number; memoryMb: number; storageMb: number } | undefined {
    const usage = this.usage.get(tenantId);
    return usage ? { ...usage } : undefined;
  }

  checkQuota(tenantId: string): { withinQuota: boolean; violations: string[] } {
    const usage = this.usage.get(tenantId);
    if (!usage) return { withinQuota: true, violations: [] };
    const violations: string[] = [];
    for (const quota of this.quotas.values()) {
      if (quota.tenantId === tenantId) {
        if (usage.cpu > quota.maxCpu) violations.push('CPU exceeded');
        if (usage.memoryMb > quota.maxMemoryMb) violations.push('Memory exceeded');
        if (usage.storageMb > quota.maxStorageMb) violations.push('Storage exceeded');
      }
    }
    return { withinQuota: violations.length === 0, violations };
  }

  getAll(): ResourceQuota[] {
    return Array.from(this.quotas.values());
  }
}
