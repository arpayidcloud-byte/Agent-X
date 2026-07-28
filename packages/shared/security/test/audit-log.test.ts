import { describe, it, expect } from 'vitest';
import { HashChainedAuditLog } from '../src/audit-log.js';

describe('HashChainedAuditLog', () => {
  it('appends entries with hash chaining', () => {
    const log = new HashChainedAuditLog();
    const entry1 = log.append('user1', 'CREATE', 'task/1');
    const entry2 = log.append('user2', 'DELETE', 'task/1');

    expect(entry1.previousHash).toBe('0'.repeat(64));
    expect(entry2.previousHash).toBe(entry1.hash);
    expect(log.getSize()).toBe(2);
  });

  it('verifies integrity of unmodified log', () => {
    const log = new HashChainedAuditLog();
    log.append('user1', 'CREATE', 'task/1');
    log.append('user2', 'UPDATE', 'task/1');
    log.append('user3', 'DELETE', 'task/1');

    expect(log.verify()).toBe(true);
  });

  it('detects tampered entries', () => {
    const log = new HashChainedAuditLog();
    log.append('user1', 'CREATE', 'task/1');
    const entry2 = log.append('user2', 'UPDATE', 'task/1');
    log.append('user3', 'DELETE', 'task/1');

    // Tamper with entry2
    (entry2 as unknown as { action: string }).action = 'TAMPERED';

    expect(log.verify()).toBe(false);
  });

  it('returns limited entries', () => {
    const log = new HashChainedAuditLog();
    for (let i = 0; i < 10; i++) {
      log.append('user', 'ACTION', `resource/${i}`);
    }
    expect(log.getEntries(3)).toHaveLength(3);
    expect(log.getEntries(100)).toHaveLength(10);
  });

  it('handles empty log', () => {
    const log = new HashChainedAuditLog();
    expect(log.verify()).toBe(true);
    expect(log.getEntries(10)).toHaveLength(0);
    expect(log.getSize()).toBe(0);
  });
});
