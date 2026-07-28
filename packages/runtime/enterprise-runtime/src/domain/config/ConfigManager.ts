import { createHash } from 'crypto';

export interface ConfigEntry {
  readonly key: string;
  readonly value: unknown;
  readonly source: string;
  readonly version: number;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class ConfigurationManager {
  private configs = new Map<string, ConfigEntry>();

  set(key: string, value: unknown, source: string): ConfigEntry {
    const existing = this.configs.get(key);
    const version = existing ? existing.version + 1 : 1;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ key, value, source, version }))
      .digest('hex');
    const entry: ConfigEntry = Object.freeze({
      key,
      value: typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value,
      source,
      version,
      timestamp: new Date(),
      checksum,
    });
    this.configs.set(key, entry);
    return entry;
  }

  get(key: string): ConfigEntry | undefined {
    return this.configs.get(key);
  }

  getValue(key: string): unknown {
    const entry = this.configs.get(key);
    if (!entry) return undefined;
    return typeof entry.value === 'object' ? JSON.parse(JSON.stringify(entry.value)) : entry.value;
  }

  delete(key: string): boolean {
    return this.configs.delete(key);
  }

  getAll(): ConfigEntry[] {
    return Array.from(this.configs.values());
  }

  sync(entries: ConfigEntry[]): void {
    for (const entry of entries) {
      const existing = this.configs.get(entry.key);
      if (!existing || entry.version > existing.version) {
        this.configs.set(entry.key, entry);
      }
    }
  }
}

export interface SecretEntry {
  readonly key: string;
  readonly encryptedValue: string;
  readonly version: number;
  readonly rotatedAt: Date;
  readonly checksum: string;
}

export class SecretManager {
  private secrets = new Map<string, SecretEntry>();

  set(key: string, encryptedValue: string): SecretEntry {
    const existing = this.secrets.get(key);
    const version = existing ? existing.version + 1 : 1;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ key, encryptedValue, version }))
      .digest('hex');
    const entry: SecretEntry = Object.freeze({
      key,
      encryptedValue,
      version,
      rotatedAt: new Date(),
      checksum,
    });
    this.secrets.set(key, entry);
    return entry;
  }

  get(key: string): SecretEntry | undefined {
    return this.secrets.get(key);
  }

  rotate(key: string, newEncryptedValue: string): SecretEntry {
    return this.set(key, newEncryptedValue);
  }

  delete(key: string): boolean {
    return this.secrets.delete(key);
  }

  getAll(): SecretEntry[] {
    return Array.from(this.secrets.values());
  }
}

export interface FeatureFlag {
  readonly flagId: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly rolloutPercentage: number;
  readonly checksum: string;
}

export class FeatureFlagManager {
  private flags = new Map<string, FeatureFlag>();

  set(name: string, enabled: boolean, rolloutPercentage: number = 100): FeatureFlag {
    const flagId = `ff-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ flagId, name, enabled, rolloutPercentage }))
      .digest('hex');
    const flag: FeatureFlag = Object.freeze({ flagId, name, enabled, rolloutPercentage, checksum });
    this.flags.set(flagId, flag);
    return flag;
  }

  isEnabled(flagId: string): boolean {
    const flag = this.flags.get(flagId);
    return flag ? flag.enabled : false;
  }

  get(flagId: string): FeatureFlag | undefined {
    return this.flags.get(flagId);
  }

  delete(flagId: string): boolean {
    return this.flags.delete(flagId);
  }

  getAll(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }
}
