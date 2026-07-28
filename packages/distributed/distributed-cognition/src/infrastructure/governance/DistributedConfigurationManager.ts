import { createHash } from 'crypto';

export interface ConfigEntry {
  readonly key: string;
  readonly value: unknown;
  readonly sourceNode: string;
  readonly version: number;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class DistributedConfigurationManager {
  private configs = new Map<string, ConfigEntry>();

  set(key: string, value: unknown, sourceNode: string): ConfigEntry {
    const existing = this.configs.get(key);
    const version = existing ? existing.version + 1 : 1;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ key, value, sourceNode, version }))
      .digest('hex');
    const entry: ConfigEntry = Object.freeze({
      key,
      value: typeof value === 'object' ? (JSON.parse(JSON.stringify(value)) as unknown) : value,
      sourceNode,
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
    return this.configs.get(key)?.value;
  }

  sync(entries: ConfigEntry[]): void {
    for (const entry of entries) {
      const existing = this.configs.get(entry.key);
      if (!existing || entry.version > existing.version) {
        this.configs.set(entry.key, entry);
      }
    }
  }

  getAll(): ConfigEntry[] {
    return Array.from(this.configs.values());
  }

  delete(key: string): boolean {
    return this.configs.delete(key);
  }

  validate(key: string): boolean {
    const entry = this.configs.get(key);
    if (!entry) return false;
    const computed = createHash('sha256')
      .update(
        JSON.stringify({
          key: entry.key,
          value: entry.value,
          sourceNode: entry.sourceNode,
          version: entry.version,
        }),
      )
      .digest('hex');
    return computed === entry.checksum;
  }
}
