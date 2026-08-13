import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('authenticated browser stream transport', () => {
  it('uses fetch bearer auth instead of unauthenticated EventSource or token query strings', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/lib/stream.ts'), 'utf8');
    expect(source).toContain('headers: { Authorization: `Bearer ${token}` }');
    expect(source).not.toContain('new EventSource');
    expect(source).not.toContain('token=');
  });
});
