import { describe, expect, it } from 'vitest';
import { buildTenantOwnershipEvidenceInventory } from './tenant-ownership-evidence.js';

describe('tenant ownership evidence inventory', () => {
  it('resolves only direct organization evidence and records corroboration', () => {
    const report = buildTenantOwnershipEvidenceInventory({
      users: [
        {
          id: 'u-1',
          email: 'one@test',
          orgId: null,
          memberOrgIds: ['org-1'],
          historicalCostEntryIds: ['c-1'],
        },
      ],
      costEntries: [
        {
          id: 'c-1',
          orgId: null,
          userId: 'u-1',
          taskId: 'missing-task',
          taskOrgId: null,
          userOrgId: 'org-1',
          taskExists: false,
          userExists: true,
          corroboratingTaskIds: [],
        },
      ],
    });

    expect(report.readyForBackfill).toBe(true);
    expect(report.users[0]).toMatchObject({ classification: 'resolved', proposedOrgId: 'org-1' });
    expect(report.costEntries[0]).toMatchObject({
      classification: 'resolved',
      proposedOrgId: 'org-1',
    });
    expect(report.costEntries[0]?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'missing task',
          strength: 'missing',
          referenceId: 'missing-task',
        }),
        expect.objectContaining({ kind: 'user organization', strength: 'direct', orgId: 'org-1' }),
      ]),
    );
  });

  it('fails closed and records missing evidence per row', () => {
    const report = buildTenantOwnershipEvidenceInventory({
      users: [
        { id: 'u-1', email: 'one@test', orgId: null, memberOrgIds: [], historicalCostEntryIds: [] },
      ],
      costEntries: [
        {
          id: 'c-1',
          orgId: null,
          userId: null,
          taskId: 'missing-task',
          taskOrgId: null,
          userOrgId: null,
          taskExists: false,
          userExists: false,
          corroboratingTaskIds: [],
        },
      ],
    });

    expect(report.readyForBackfill).toBe(false);
    expect(report.blockers).toHaveLength(2);
    expect(report.users[0]?.evidence).toContainEqual(
      expect.objectContaining({ kind: 'no ownership evidence', strength: 'missing' }),
    );
    expect(report.costEntries[0]?.evidence).toContainEqual(
      expect.objectContaining({ kind: 'missing task', strength: 'missing' }),
    );
  });

  it('marks conflicting direct organization evidence ambiguous', () => {
    const report = buildTenantOwnershipEvidenceInventory({
      users: [],
      costEntries: [
        {
          id: 'c-1',
          orgId: 'org-1',
          userId: 'u-1',
          taskId: 't-1',
          taskOrgId: 'org-2',
          userOrgId: 'org-1',
          taskExists: true,
          userExists: true,
          corroboratingTaskIds: [],
        },
      ],
    });

    expect(report.readyForBackfill).toBe(false);
    expect(report.costEntries[0]).toMatchObject({
      classification: 'ambiguous',
      proposedOrgId: null,
    });
    expect(report.costEntries[0]?.evidence).toContainEqual(
      expect.objectContaining({ strength: 'conflicting' }),
    );
  });
});
