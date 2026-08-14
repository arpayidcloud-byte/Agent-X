import { describe, expect, it } from 'vitest';
import {
  buildTenantOwnershipReconciliation,
  type TenantOwnershipSnapshot,
} from './tenant-ownership-reconciliation.js';

const snapshot: TenantOwnershipSnapshot = {
  users: [
    { id: 'u-admin', email: 'admin@example.test', orgId: 'org-1', memberOrgIds: ['org-1'] },
    { id: 'u-member', email: 'member@example.test', orgId: null, memberOrgIds: ['org-1'] },
    { id: 'u-unknown', email: 'unknown@example.test', orgId: null, memberOrgIds: [] },
    {
      id: 'u-ambiguous',
      email: 'ambiguous@example.test',
      orgId: null,
      memberOrgIds: ['org-1', 'org-2'],
    },
  ],
  costEntries: [
    {
      id: 'c-persisted',
      orgId: 'org-1',
      userId: null,
      taskId: null,
      taskOrgId: null,
      userOrgId: null,
    },
    { id: 'c-task', orgId: null, userId: null, taskId: 't-1', taskOrgId: 'org-1', userOrgId: null },
    {
      id: 'c-user',
      orgId: null,
      userId: 'u-member',
      taskId: null,
      taskOrgId: null,
      userOrgId: 'org-1',
    },
    {
      id: 'c-unknown',
      orgId: null,
      userId: null,
      taskId: 'missing',
      taskOrgId: null,
      userOrgId: null,
    },
  ],
};

describe('tenant ownership reconciliation', () => {
  it('classifies direct and single-source evidence without mutating data', () => {
    const report = buildTenantOwnershipReconciliation(snapshot);

    expect(report.users).toMatchObject([
      {
        id: 'u-admin',
        classification: 'resolved',
        proposedOrgId: 'org-1',
        evidence: 'persisted orgId',
      },
      {
        id: 'u-member',
        classification: 'resolved',
        proposedOrgId: 'org-1',
        evidence: 'single organization membership',
      },
      { id: 'u-unknown', classification: 'unresolved', proposedOrgId: null },
      { id: 'u-ambiguous', classification: 'ambiguous', proposedOrgId: null },
    ]);
    expect(report.costEntries).toMatchObject([
      {
        id: 'c-persisted',
        classification: 'resolved',
        proposedOrgId: 'org-1',
        evidence: 'persisted orgId',
      },
      {
        id: 'c-task',
        classification: 'resolved',
        proposedOrgId: 'org-1',
        evidence: 'task organization',
      },
      {
        id: 'c-user',
        classification: 'resolved',
        proposedOrgId: 'org-1',
        evidence: 'user organization',
      },
      { id: 'c-unknown', classification: 'unresolved', proposedOrgId: null },
    ]);
  });

  it('fails closed when unresolved, ambiguous, or conflicting rows remain', () => {
    const report = buildTenantOwnershipReconciliation({
      ...snapshot,
      costEntries: [
        ...snapshot.costEntries,
        {
          id: 'c-conflict',
          orgId: 'org-1',
          userId: 'u-member',
          taskId: 't-2',
          taskOrgId: 'org-2',
          userOrgId: 'org-1',
        },
      ],
    });

    expect(report.readyForBackfill).toBe(false);
    expect(report.costEntries).toContainEqual({
      id: 'c-conflict',
      classification: 'ambiguous',
      proposedOrgId: null,
      evidence: 'conflicting organization evidence',
    });
    expect(report.blockers).toEqual([
      'unresolved or ambiguous User ownership remains',
      'unresolved, ambiguous, or conflicting CostEntry ownership remains',
    ]);
  });
});
