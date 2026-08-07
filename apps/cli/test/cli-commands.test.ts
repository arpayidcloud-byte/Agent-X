import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock cloud-api to simulate no auth
let mockAuthed = false;
vi.mock('../src/lib/cloud-api.js', () => ({
  isCloudAuthed: () => mockAuthed,
  cloudFetch: vi.fn(),
  cloudSSE: vi.fn(),
  configHome: '/tmp/agentx-test',
}));

import { submit } from '../src/commands/submit.js';
import { status } from '../src/commands/status.js';

describe('CLI', () => {
  it('has a package name', async () => {
    const pkg = await import('../package.json');
    expect(pkg.default.name).toBe('@agent-xai/cli');
  });
});

describe('CLI submit', () => {
  beforeEach(() => {
    mockAuthed = false;
  });
  afterEach(() => {
    mockAuthed = true;
  });

  it('throws when no goal provided', async () => {
    await expect(submit([])).rejects.toThrow('Usage: agentx submit');
  });

  it('throws when not authenticated', async () => {
    await expect(submit(['build', 'API'])).rejects.toThrow('Not authenticated');
  });
});

describe('CLI status', () => {
  beforeEach(() => {
    mockAuthed = false;
  });
  afterEach(() => {
    mockAuthed = true;
  });

  it('throws when not authenticated', async () => {
    await expect(status([])).rejects.toThrow('Not authenticated');
  });
});
