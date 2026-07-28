import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { submit } from '../src/commands/submit.js';
import { status } from '../src/commands/status.js';
import { approve } from '../src/commands/approve.js';
import { config } from '../src/commands/config.js';
import { plugin } from '../src/commands/plugin.js';
import { getRuntime, resetRuntime } from '../src/lib/runtime.js';

describe('CLI submit', () => {
  beforeEach(resetRuntime);
  afterEach(resetRuntime);

  it('creates a task with goal', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await submit(['build', 'a', 'REST', 'API']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('Task created'))).toBe(true);
    expect(logs.some((l) => l.includes('build a REST API'))).toBe(true);

    const { taskRepo } = getRuntime();
    const tasks = await taskRepo.getAll();
    expect(tasks).toHaveLength(1);
    const task = tasks[0];
    expect(task.goal).toBe('build a REST API');
    // Task may be in any state from CREATED to COMPLETED/FAILED depending on agent execution
    expect(task.assignedAgentRole).toBe('coder');
  });

  it('throws when no goal provided', async () => {
    await expect(submit([])).rejects.toThrow('Usage: agentx submit');
  });
});

describe('CLI status', () => {
  beforeEach(resetRuntime);
  afterEach(resetRuntime);

  it('shows no tasks when empty', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await status([]);
    console.log = origLog;

    expect(logs.some((l) => l.includes('No tasks found'))).toBe(true);
  });

  it('shows task after submit', async () => {
    await submit(['test', 'goal']);
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await status([]);
    console.log = origLog;

    expect(logs.some((l) => l.includes('Tasks:'))).toBe(true);
    expect(logs.some((l) => l.includes('test goal'))).toBe(true);
  });
});

describe('CLI approve/reject', () => {
  beforeEach(resetRuntime);
  afterEach(resetRuntime);

  it('throws when task not in WAITING_APPROVAL', async () => {
    await submit(['test']);
    const { taskRepo } = getRuntime();
    const tasks = await taskRepo.getAll();
    const taskId = tasks[0].id;
    await expect(approve([taskId])).rejects.toThrow('not waiting for approval');
  });
});

describe('CLI config', () => {
  beforeEach(resetRuntime);
  afterEach(resetRuntime);

  it('gets and sets config values', async () => {
    await config(['set', 'provider', 'anthropic']);
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await config(['get', 'provider']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('anthropic'))).toBe(true);
  });

  it('shows all config when no key', async () => {
    await config(['set', 'a', '1']);
    await config(['set', 'b', '2']);
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await config(['get']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('Configuration:'))).toBe(true);
  });
});

describe('CLI plugin', () => {
  beforeEach(resetRuntime);
  afterEach(resetRuntime);

  it('lists empty plugins', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await plugin(['list']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('No plugins'))).toBe(true);
  });

  it('installs a plugin', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await plugin(['install', 'my-plugin']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('Plugin installed: my-plugin'))).toBe(true);
    expect(logs.some((l) => l.includes('pending-review'))).toBe(true);
  });
});
