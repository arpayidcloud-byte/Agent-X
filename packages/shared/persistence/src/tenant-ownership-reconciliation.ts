export type OwnershipClassification = 'resolved' | 'unresolved' | 'ambiguous';

export type UserOwnershipRow = {
  id: string;
  email: string;
  orgId: string | null;
  memberOrgIds: string[];
};

export type CostOwnershipRow = {
  id: string;
  orgId: string | null;
  userId: string | null;
  taskId: string | null;
  taskOrgId: string | null;
  userOrgId: string | null;
};

export type TenantOwnershipSnapshot = {
  users: UserOwnershipRow[];
  costEntries: CostOwnershipRow[];
};

type ReconciliationRow = {
  id: string;
  classification: OwnershipClassification;
  proposedOrgId: string | null;
  evidence: string | null;
};

export type TenantOwnershipReconciliation = {
  readyForBackfill: boolean;
  blockers: string[];
  users: ReconciliationRow[];
  costEntries: ReconciliationRow[];
};

function classifyUser(row: UserOwnershipRow): ReconciliationRow {
  if (row.orgId)
    return {
      id: row.id,
      classification: 'resolved',
      proposedOrgId: row.orgId,
      evidence: 'persisted orgId',
    };
  if (row.memberOrgIds.length === 1) {
    return {
      id: row.id,
      classification: 'resolved',
      proposedOrgId: row.memberOrgIds[0] ?? null,
      evidence: 'single organization membership',
    };
  }
  if (row.memberOrgIds.length > 1) {
    return {
      id: row.id,
      classification: 'ambiguous',
      proposedOrgId: null,
      evidence: 'multiple organization memberships',
    };
  }
  return { id: row.id, classification: 'unresolved', proposedOrgId: null, evidence: null };
}

function classifyCostEntry(row: CostOwnershipRow): ReconciliationRow {
  const evidence = [row.orgId, row.taskOrgId, row.userOrgId].filter((orgId): orgId is string =>
    Boolean(orgId),
  );
  if (new Set(evidence).size > 1) {
    return {
      id: row.id,
      classification: 'ambiguous',
      proposedOrgId: null,
      evidence: 'conflicting organization evidence',
    };
  }
  if (row.orgId)
    return {
      id: row.id,
      classification: 'resolved',
      proposedOrgId: row.orgId,
      evidence: 'persisted orgId',
    };
  if (row.taskOrgId)
    return {
      id: row.id,
      classification: 'resolved',
      proposedOrgId: row.taskOrgId,
      evidence: 'task organization',
    };
  if (row.userOrgId)
    return {
      id: row.id,
      classification: 'resolved',
      proposedOrgId: row.userOrgId,
      evidence: 'user organization',
    };
  return { id: row.id, classification: 'unresolved', proposedOrgId: null, evidence: null };
}

export function buildTenantOwnershipReconciliation(
  snapshot: TenantOwnershipSnapshot,
): TenantOwnershipReconciliation {
  const users = snapshot.users.map(classifyUser);
  const costEntries = snapshot.costEntries.map(classifyCostEntry);
  const blockers: string[] = [];
  if (users.some((row) => row.classification !== 'resolved')) {
    blockers.push('unresolved or ambiguous User ownership remains');
  }
  if (costEntries.some((row) => row.classification !== 'resolved')) {
    blockers.push('unresolved, ambiguous, or conflicting CostEntry ownership remains');
  }
  return { readyForBackfill: blockers.length === 0, blockers, users, costEntries };
}

export function assertNoConflictingEvidence(row: CostOwnershipRow): void {
  if (row.orgId && row.taskOrgId && row.orgId !== row.taskOrgId) {
    throw new Error(`conflicting CostEntry evidence: ${row.id}`);
  }
  if (row.taskOrgId && row.userOrgId && row.taskOrgId !== row.userOrgId) {
    throw new Error(`conflicting CostEntry evidence: ${row.id}`);
  }
}
for (const row of [] as CostOwnershipRow[]) assertNoConflictingEvidence(row);
