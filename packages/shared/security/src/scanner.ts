import type { SecurityScanResult, SecurityScanner, Severity } from './interfaces.js';

interface ScanRule {
  name: string;
  pattern: RegExp;
  severity: Severity;
  description: string;
  remediation: string;
}

const DEFAULT_RULES: ScanRule[] = [
  {
    name: 'eval-usage',
    pattern: /\beval\s*\(/g,
    severity: 'critical',
    description: 'Use of eval() detected - potential code injection',
    remediation:
      'Replace eval() with a safer alternative like JSON.parse() or Function constructor',
  },
  {
    name: 'exec-usage',
    pattern: /\bexec\s*\(\s*['"`]/g,
    severity: 'high',
    description: 'Use of exec() with string literal - potential command injection',
    remediation: 'Use parameterized commands or a safe execution wrapper',
  },
  {
    name: 'hardcoded-password',
    pattern: /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    severity: 'high',
    description: 'Hardcoded password detected',
    remediation: 'Move password to environment variables or secret manager',
  },
  {
    name: 'sql-concat',
    pattern: /(?:SELECT|INSERT|UPDATE|DELETE)\s+.*\+\s*/gi,
    severity: 'high',
    description: 'SQL query concatenation detected - potential SQL injection',
    remediation: 'Use parameterized queries or ORM',
  },
  {
    name: 'console-log-production',
    pattern: /console\.(log|debug)\s*\(/g,
    severity: 'low',
    description: 'Console.log/debug in production code',
    remediation: 'Use structured logging instead',
  },
];

export class SASTScanner implements SecurityScanner {
  private rules: ScanRule[];

  constructor(customRules?: ScanRule[]) {
    this.rules = customRules ?? DEFAULT_RULES;
  }

  scanFile(filePath: string, content: string): SecurityScanResult[] {
    const results: SecurityScanResult[] = [];
    const lines = content.split('\n');

    for (const rule of this.rules) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
        if (regex.test(line)) {
          results.push({
            severity: rule.severity,
            rule: rule.name,
            file: filePath,
            line: i + 1,
            description: rule.description,
            remediation: rule.remediation,
          });
        }
      }
    }

    return results;
  }

  scanFiles(files: Array<{ path: string; content: string }>): SecurityScanResult[] {
    const results: SecurityScanResult[] = [];
    for (const file of files) {
      results.push(...this.scanFile(file.path, file.content));
    }
    return results;
  }
}
