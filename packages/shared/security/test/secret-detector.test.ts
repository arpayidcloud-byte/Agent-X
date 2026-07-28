import { describe, it, expect } from 'vitest';
import { SecretPatternDetector } from '../src/secret-detector.js';

describe('SecretPatternDetector', () => {
  it('detects AWS access keys', () => {
    const detector = new SecretPatternDetector();
    const matches = detector.detect(`const key = "AKIAIOSFODNN7EXAMPLE"`);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].pattern).toBe('AWS Access Key');
    expect(matches[0].severity).toBe('critical');
  });

  it('detects GitHub tokens', () => {
    const detector = new SecretPatternDetector();
    const matches = detector.detect(`token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.some((m) => m.pattern === 'GitHub Token')).toBe(true);
  });

  it('detects private key blocks', () => {
    const detector = new SecretPatternDetector();
    const matches = detector.detect('-----BEGIN RSA PRIVATE KEY-----');
    expect(matches).toHaveLength(1);
    expect(matches[0].severity).toBe('critical');
  });

  it('detects connection strings', () => {
    const detector = new SecretPatternDetector();
    const matches = detector.detect('DATABASE_URL=postgres://user:pass@localhost/db');
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.some((m) => m.pattern === 'Connection String')).toBe(true);
  });

  it('returns empty for clean content', () => {
    const detector = new SecretPatternDetector();
    const matches = detector.detect('const greeting = "hello world";');
    expect(matches).toHaveLength(0);
  });

  it('reports correct line numbers', () => {
    const detector = new SecretPatternDetector();
    const matches = detector.detect(`line 1\nconst key = "AKIAIOSFODNN7EXAMPLE"\nline 3`);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].line).toBe(2);
  });

  it('allows adding custom patterns', () => {
    const detector = new SecretPatternDetector();
    detector.addPattern({ name: 'Custom', pattern: /CUSTOM_SECRET/g, severity: 'high' });
    const matches = detector.detect('CUSTOM_SECRET_123');
    expect(matches).toHaveLength(1);
    expect(matches[0].pattern).toBe('Custom');
  });
});
