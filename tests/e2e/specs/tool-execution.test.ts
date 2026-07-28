import { describe, it, expect } from 'vitest';
import { SASTScanner, SecretPatternDetector, HashChainedAuditLog } from '@agentx/security';

describe('Tool Execution E2E', () => {
  it('SAST scanner scans code end-to-end', async () => {
    const scanner = new SASTScanner();
    const files = [
      { path: 'app.ts', content: 'const x = eval("dangerous");' },
      { path: 'config.ts', content: 'password = "hardcoded123"' },
      { path: 'utils.ts', content: 'console.log("debug info");' },
      { path: 'clean.ts', content: 'const result = await fetch(url);' },
    ];

    const results = scanner.scanFiles(files);
    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.some((r) => r.rule === 'eval-usage' && r.file === 'app.ts')).toBe(true);
    expect(results.some((r) => r.rule === 'hardcoded-password' && r.file === 'config.ts')).toBe(
      true,
    );
    expect(results.some((r) => r.rule === 'console-log-production' && r.file === 'utils.ts')).toBe(
      true,
    );
  });

  it('secret detector scans code end-to-end', async () => {
    const detector = new SecretPatternDetector();
    const content = [
      'const AWS_KEY = "AKIAIOSFODNN7EXAMPLE";',
      'const githubToken = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij";',
      'const normalVar = "hello world";',
    ].join('\n');

    const matches = detector.detect(content);
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(matches.some((m) => m.pattern === 'AWS Access Key')).toBe(true);
    expect(matches.some((m) => m.pattern === 'GitHub Token')).toBe(true);
  });

  it('audit log records and verifies end-to-end', async () => {
    const log = new HashChainedAuditLog();
    log.append('agent-coder', 'CREATE', 'file/src.ts');
    log.append('agent-tester', 'EXECUTE', 'test/run.ts');
    log.append('agent-reviewer', 'APPROVE', 'pr/123');
    log.append('system', 'MERGE', 'pr/123');

    expect(log.verify()).toBe(true);
    expect(log.getSize()).toBe(4);

    const recent = log.getEntries(2);
    expect(recent).toHaveLength(2);
    expect(recent[0]!.actor).toBe('agent-reviewer');
    expect(recent[1]!.actor).toBe('system');
  });
});
