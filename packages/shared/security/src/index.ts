export type {
  SecurityScanResult,
  SecurityScanner,
  SecretDetector,
  SecretMatch,
  SecretPattern,
  AuditEntry,
  AuditLog,
  Severity,
} from './interfaces.js';
export { SASTScanner } from './scanner.js';
export { SecretPatternDetector } from './secret-detector.js';
export { HashChainedAuditLog } from './audit-log.js';
