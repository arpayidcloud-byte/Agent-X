import type { SecretDetector, SecretMatch, SecretPattern } from './interfaces.js';

const DEFAULT_PATTERNS: SecretPattern[] = [
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g, severity: 'critical' },
  {
    name: 'AWS Secret Key',
    pattern: /(?:aws_secret_access_key|secret_key)\s*[=:]\s*['"`]?[A-Za-z0-9/+=]{40}/gi,
    severity: 'critical',
  },
  { name: 'GitHub Token', pattern: /ghp_[A-Za-z0-9]{36}/g, severity: 'critical' },
  { name: 'GitHub OAuth', pattern: /gho_[A-Za-z0-9]{36}/g, severity: 'high' },
  {
    name: 'Slack Token',
    pattern: /xox[bpoas]-[0-9]{10,13}-[0-9a-zA-Z-]{24,}/g,
    severity: 'critical',
  },
  {
    name: 'Slack Webhook',
    pattern: /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]{8}\/B[A-Z0-9]{8}\/[A-Za-z0-9]{24}/g,
    severity: 'high',
  },
  {
    name: 'Generic API Key',
    pattern: /(?:api[_-]?key|apikey)\s*[=:]\s*['"`]?[A-Za-z0-9\-_]{20,}/gi,
    severity: 'medium',
  },
  {
    name: 'Private Key Block',
    pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g,
    severity: 'critical',
  },
  {
    name: 'JWT Token',
    pattern: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+/g,
    severity: 'medium',
  },
  { name: 'Bearer Token', pattern: /Bearer\s+[A-Za-z0-9\-_.~+/]+=*/g, severity: 'high' },
  {
    name: 'Connection String',
    pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s'"]+/gi,
    severity: 'critical',
  },
];

export class SecretPatternDetector implements SecretDetector {
  private patterns: SecretPattern[];

  constructor(patterns?: SecretPattern[]) {
    this.patterns = patterns ?? DEFAULT_PATTERNS;
  }

  detect(content: string): SecretMatch[] {
    const matches: SecretMatch[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      for (const pattern of this.patterns) {
        const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
        let match = regex.exec(line);
        while (match !== null) {
          matches.push({
            pattern: pattern.name,
            line: lines.indexOf(line) + 1,
            column: match.index + 1,
            severity: pattern.severity,
          });
          match = regex.exec(line);
        }
      }
    }

    return matches;
  }

  getPatterns(): SecretPattern[] {
    return [...this.patterns];
  }

  addPattern(pattern: SecretPattern): void {
    this.patterns.push(pattern);
  }
}
