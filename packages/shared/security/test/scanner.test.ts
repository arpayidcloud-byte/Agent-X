import { describe, it, expect } from 'vitest';
import { SASTScanner } from '../src/scanner.js';

describe('SASTScanner', () => {
  it('detects eval usage', () => {
    const scanner = new SASTScanner();
    const results = scanner.scanFile('test.ts', 'eval("alert(1)")');
    expect(results).toHaveLength(1);
    expect(results[0].severity).toBe('critical');
    expect(results[0].rule).toBe('eval-usage');
  });

  it('detects hardcoded passwords', () => {
    const scanner = new SASTScanner();
    const results = scanner.scanFile('config.ts', `password = "${process.env.TEST_PASSWORD}"`);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((r) => r.rule === 'hardcoded-password')).toBe(true);
  });

  it('detects exec with string literal', () => {
    const scanner = new SASTScanner();
    const results = scanner.scanFile('run.ts', "exec('ls -la')");
    expect(results).toHaveLength(1);
    expect(results[0].severity).toBe('high');
    expect(results[0].rule).toBe('exec-usage');
  });

  it('scans multiple files', () => {
    const scanner = new SASTScanner();
    const results = scanner.scanFiles([
      { path: 'a.ts', content: 'eval("test")' },
      { path: 'b.ts', content: 'console.log("hello")' },
    ]);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('returns empty for clean code', () => {
    const scanner = new SASTScanner();
    const results = scanner.scanFile('clean.ts', 'const x = 42;');
    expect(results).toHaveLength(0);
  });

  it('supports custom rules', () => {
    const scanner = new SASTScanner([
      {
        name: 'custom-rule',
        pattern: /TODO/g,
        severity: 'low',
        description: 'Found TODO',
        remediation: 'Fix it',
      },
    ]);
    const results = scanner.scanFile('todo.ts', '// TODO: fix this');
    expect(results).toHaveLength(1);
    expect(results[0].rule).toBe('custom-rule');
  });
});
