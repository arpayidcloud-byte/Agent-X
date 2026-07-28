export type SecretCategory = 'provider' | 'database' | 'encryption' | 'plugin' | 'auth';

export type Classification = 'critical' | 'high' | 'medium' | 'low';

export interface SecretMetadata {
  category: SecretCategory;
  classification: Classification;
  lastRotatedAt?: Date;
  rotatedBy?: string;
}

export interface SecretEntry {
  key: string;
  value: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: SecretMetadata;
}

export interface SecretStore {
  readonly backendId: string;
  get(key: string): Promise<SecretEntry>;
  set(key: string, value: string, metadata?: SecretMetadata): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
  has(key: string): Promise<boolean>;
}

export interface CredentialResolverConfig {
  keyMapping: Record<string, string>;
  cacheTtlSeconds: number;
  enforceNoLog: boolean;
}

export interface CredentialResolver {
  resolve(logicalKey: string): Promise<string>;
  resolveMetadata(logicalKey: string): Promise<SecretMetadata | undefined>;
  invalidate(logicalKey: string): Promise<void>;
  invalidateAll(): Promise<void>;
}
