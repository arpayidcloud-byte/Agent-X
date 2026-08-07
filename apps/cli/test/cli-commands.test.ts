import { describe, it, expect } from 'vitest';
import { submit } from '../src/commands/submit.js';
import { status } from '../src/commands/status.js';

describe('CLI submit', () => {
  it('throws when no goal provided', async () => {
    await expect(submit([])).rejects.toThrow('Usage: agentx submit');
  });

  it('throws when not authenticated', async () => {
    await expect(submit(['build', 'API'])).rejects.toThrow('Not authenticated');
  });
});

describe('CLI status', () => {
  it('throws when not authenticated', async () => {
    await expect(status([])).rejects.toThrow('Not authenticated');
  });
});
