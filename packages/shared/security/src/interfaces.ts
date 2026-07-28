export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface SecurityScanResult {
  severity: Severity;
  rule: string;
  file: string;
  line: number;
  description: string;
  remediation: string;
}

export interface SecretPattern {
  name: string;
  pattern: RegExp;
  severity: Severity;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  resource: string;
  previousHash: string;
  hash: string;
}

export interface SecurityScanner {
  scanFile(filePath: string, content: string): SecurityScanResult[];
  scanFiles(files: Array<{ path: string; content: string }>): SecurityScanResult[];
}

export interface SecretDetector {
  detect(content: string): SecretMatch[];
}

export interface SecretMatch {
  pattern: string;
  line: number;
  column: number;
  severity: Severity;
}

export interface AuditLog {
  append(actor: string, action: string, resource: string): AuditEntry;
  verify(): boolean;
  getEntries(limit: number): AuditEntry[];
}
