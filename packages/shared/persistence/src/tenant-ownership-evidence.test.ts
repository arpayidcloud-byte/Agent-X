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
          subscriptionOrgId: null,
          memberOrgIds: [],
          taskContextOrgId: null,
          taskMetadataOrgId: null,
          eventOrgIds: [],
          taskCreatedAt: null,
          subscriptionCreatedAt: null,
          membershipEvidence: [],
          eventEvidence: [],
          createdAt: '2026-08-01T00:00:00.000Z',
          corroboratingRecords: [
            { source: 'QualityScore', id: 'qs-1', taskId: 't-1' },
            { source: 'AgentFeedback', id: 'af-1', taskId: 't-1' },
          ],
          taskExists: true,
          userExists: true,
          subscriptionExists: false,
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

  it('uses subscription ownership as direct evidence and records corroborating history', () => {
    const report = buildTenantOwnershipEvidenceInventory({
      users: [],
      costEntries: [
        {
          id: 'c-1',
          orgId: null,
          userId: 'u-1',
          taskId: 't-1',
          taskOrgId: null,
          userOrgId: null,
          subscriptionOrgId: 'org-1',
          memberOrgIds: ['org-1'],
          taskContextOrgId: 'org-1',
          taskMetadataOrgId: null,
          eventOrgIds: ['org-1'],
          taskCreatedAt: '2026-07-31T00:00:00.000Z',
          subscriptionCreatedAt: '2026-07-31T00:00:00.000Z',
          membershipEvidence: [{ orgId: 'org-1', createdAt: '2026-07-31T00:00:00.000Z' }],
          eventEvidence: [{ orgId: 'org-1', createdAt: '2026-07-31T00:00:00.000Z' }],
          createdAt: '2026-08-01T00:00:00.000Z',
          taskExists: true,
          userExists: true,
          subscriptionExists: true,
          corroboratingTaskIds: [],
        },
      ],
    });

    expect(report.readyForBackfill).toBe(true);
    expect(report.costEntries[0]).toMatchObject({
      classification: 'resolved',
      proposedOrgId: 'org-1',
    });
    expect(report.costEntries[0]?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'subscription organization', strength: 'direct' }),
        expect.objectContaining({ kind: 'task context organization', strength: 'corroborative' }),
        expect.objectContaining({ kind: 'organization membership', strength: 'corroborative' }),
        expect.objectContaining({ kind: 'event organization', strength: 'corroborative' }),
      ]),
    );
  });

  it('fails closed when the only direct evidence is created after the cost entry', () => {
    const report = buildTenantOwnershipEvidenceInventory({
      users: [],
      costEntries: [
        {
          id: 'c-1',
          orgId: null,
          userId: null,
          taskId: 't-1',
          taskOrgId: null,
          userOrgId: null,
          subscriptionOrgId: 'org-1',
          memberOrgIds: [],
          taskContextOrgId: null,
          taskMetadataOrgId: null,
          eventOrgIds: [],
          taskCreatedAt: null,
          subscriptionCreatedAt: '2026-08-02T00:00:00.000Z',
          membershipEvidence: [],
          eventEvidence: [],
          createdAt: '2026-08-01T00:00:00.000Z',
          taskExists: false,
          userExists: false,
          subscriptionExists: true,
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
      expect.objectContaining({ kind: 'temporal inconsistency', strength: 'conflicting' }),
    );
  });

  it('keeps corroborating QualityScore and AgentFeedback row references audit-able', () => {
    const report = buildTenantOwnershipEvidenceInventory({
      users: [],
      costEntries: [
        {
          id: 'c-1',
          orgId: null,
          userId: null,
          taskId: 't-1',
          taskOrgId: null,
          userOrgId: null,
          subscriptionOrgId: null,
          memberOrgIds: [],
          taskContextOrgId: null,
          taskMetadataOrgId: null,
          eventOrgIds: [],
          taskCreatedAt: null,
          subscriptionCreatedAt: null,
          membershipEvidence: [],
          eventEvidence: [],
          createdAt: '2026-08-01T00:00:00.000Z',
          corroboratingRecords: [
            { source: 'QualityScore', id: 'qs-1', taskId: 't-1' },
            { source: 'AgentFeedback', id: 'af-1', taskId: 't-1' },
          ],
          taskExists: false,
          userExists: false,
          subscriptionExists: false,
          corroboratingTaskIds: [],
        },
      ],
    });

    expect(report.costEntries[0]?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'historical task link', referenceId: 'qs-1' }),
        expect.objectContaining({ kind: 'historical task link', referenceId: 'af-1' }),
      ]),
    );
  });

  it('lists conflicting membership organization IDs in the evidence detail', () => {
    const report = buildTenantOwnershipEvidenceInventory({
      users: [
        {
          id: 'u-1',
          email: 'one@test',
          orgId: null,
          memberOrgIds: ['org-1', 'org-2'],
          historicalCostEntryIds: [],
        },
      ],
      costEntries: [],
    });

    expect(report.users[0]?.evidence).toContainEqual(
      expect.objectContaining({
        strength: 'conflicting',
        detail: expect.stringContaining('org-1, org-2'),
      }),
    );
  });
});
