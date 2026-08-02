import { describe, it, expect, beforeEach } from 'vitest';
import { AgentConfigStore } from '../agent-config.js';

describe('AgentConfigStore', () => {
  let store: AgentConfigStore;

  beforeEach(() => {
    store = new AgentConfigStore();
  });

  it('seeds the four specialist agents', () => {
    const agents = store.list();
    expect(agents).toHaveLength(4);
    const roles = agents.map((a) => a.role).sort();
    expect(roles).toEqual(['architect', 'coder', 'reviewer', 'tester']);
  });

  it('updates enabled flag', () => {
    const updated = store.update('agent-coder', { enabled: false });
    expect(updated?.enabled).toBe(false);
    expect(store.get('agent-coder')?.enabled).toBe(false);
  });

  it('rejects unknown ids with null', () => {
    expect(store.update('agent-nope', { enabled: false })).toBeNull();
  });

  it('validates model against the allowed list', () => {
    expect(() => store.update('agent-coder', { model: 'bogus:model' })).toThrow(
      /Invalid field: model/,
    );
    const ok = store.update('agent-coder', { model: 'openai:gpt-4o-mini' });
    expect(ok?.model).toBe('openai:gpt-4o-mini');
  });

  it('validates complexity values', () => {
    expect(() => store.update('agent-coder', { complexity: 'ultra' })).toThrow(
      /Invalid field: complexity/,
    );
    const ok = store.update('agent-coder', { complexity: 'simple' });
    expect(ok?.complexity).toBe('simple');
  });

  it('validates enabled type', () => {
    expect(() => store.update('agent-coder', { enabled: 'yes' })).toThrow(/Invalid field: enabled/);
  });
});
