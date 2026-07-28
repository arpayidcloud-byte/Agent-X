import { describe, it, expect } from 'vitest';

describe('CLI', () => {
  it('has a package name', async () => {
    const pkg = await import('../package.json');
    expect(pkg.default.name).toBe('@agentx/cli');
  });
});
