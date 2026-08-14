export type EvidenceStrength = 'direct' | 'corroborative' | 'missing' | 'conflicting';
export type EvidenceKind =
  | 'persisted orgId'
  | 'single organization membership'
  | 'task organization'
  | 'user organization'
  | 'historical task link'
  | 'historical user link'
  | 'missing task'
  | 'missing user'
  | 'no ownership evidence';

export type OwnershipEvidence = {
  kind: EvidenceKind;
  strength: EvidenceStrength;
  orgId: string | null;
  referenceId: string | null;
  detail: string;
};

export type UserEvidenceRow = {
  id: string;
  email: string;
  orgId: string | null;
  memberOrgIds: string[];
  historicalCostEntryIds: string[];
};

export type CostEvidenceRow = {
  id: string;
  orgId: string | null;
  userId: string | null;
  taskId: string | null;
  taskOrgId: string | null;
  userOrgId: string | null;
  taskExists: boolean;
  userExists: boolean;
  corroboratingTaskIds: string[];
};

type EvidenceInventoryRow = {
  id: string;
  classification: 'resolved' | 'unresolved' | 'ambiguous';
  proposedOrgId: string | null;
  evidence: OwnershipEvidence[];
};

export type TenantOwnershipEvidenceInventory = {
  readyForBackfill: boolean;
  blockers: string[];
  users: EvidenceInventoryRow[];
  costEntries: EvidenceInventoryRow[];
};

function direct(orgId: string, kind: EvidenceKind, detail: string): OwnershipEvidence {
  return { kind, strength: 'direct', orgId, referenceId: null, detail };
}

function classifyUser(row: UserEvidenceRow): EvidenceInventoryRow {
  const evidence: OwnershipEvidence[] = [];
  if (row.orgId) evidence.push(direct(row.orgId, 'persisted orgId', 'User.orgId'));
  if (row.memberOrgIds.length === 1) {
    evidence.push(
      direct(row.memberOrgIds[0]!, 'single organization membership', 'OrganizationMember.orgId'),
    );
  } else if (row.memberOrgIds.length > 1) {
    evidence.push({
      kind: 'single organization membership',
      strength: 'conflicting',
      orgId: null,
      referenceId: null,
      detail: 'multiple organization memberships',
    });
  }
  if (row.historicalCostEntryIds.length > 0) {
    evidence.push({
      kind: 'historical user link',
      strength: 'corroborative',
      orgId: null,
      referenceId: row.historicalCostEntryIds[0] ?? null,
      detail: `${row.historicalCostEntryIds.length} historical CostEntry row(s) reference this user`,
    });
  }
  const orgIds = [
    ...new Set(
      evidence
        .filter((item) => item.strength === 'direct' && item.orgId)
        .map((item) => item.orgId as string),
    ),
  ];
  if (orgIds.length > 1)
    return { id: row.id, classification: 'ambiguous', proposedOrgId: null, evidence };
  if (orgIds.length === 1)
    return { id: row.id, classification: 'resolved', proposedOrgId: orgIds[0]!, evidence };
  if (evidence.length === 0)
    evidence.push({
      kind: 'no ownership evidence',
      strength: 'missing',
      orgId: null,
      referenceId: null,
      detail: 'no User.orgId, organization membership, or historical user link',
    });
  return { id: row.id, classification: 'unresolved', proposedOrgId: null, evidence };
}

function classifyCostEntry(row: CostEvidenceRow): EvidenceInventoryRow {
  const evidence: OwnershipEvidence[] = [];
  if (row.orgId) evidence.push(direct(row.orgId, 'persisted orgId', 'CostEntry.orgId'));
  if (row.taskId && row.taskExists && row.taskOrgId)
    evidence.push(direct(row.taskOrgId, 'task organization', 'Task.orgId'));
  else if (row.taskId && row.taskExists)
    evidence.push({
      kind: 'historical task link',
      strength: 'corroborative',
      orgId: null,
      referenceId: row.taskId,
      detail: 'linked Task exists but has no orgId',
    });
  else if (row.taskId)
    evidence.push({
      kind: 'missing task',
      strength: 'missing',
      orgId: null,
      referenceId: row.taskId,
      detail: 'CostEntry.taskId does not resolve to a Task row',
    });
  if (row.userId && row.userExists && row.userOrgId)
    evidence.push(direct(row.userOrgId, 'user organization', 'User.orgId'));
  else if (row.userId && row.userExists)
    evidence.push({
      kind: 'historical user link',
      strength: 'corroborative',
      orgId: null,
      referenceId: row.userId,
      detail: 'linked User exists but has no orgId',
    });
  else if (row.userId)
    evidence.push({
      kind: 'missing user',
      strength: 'missing',
      orgId: null,
      referenceId: row.userId,
      detail: 'CostEntry.userId does not resolve to a User row',
    });
  for (const taskId of row.corroboratingTaskIds)
    evidence.push({
      kind: 'historical task link',
      strength: 'corroborative',
      orgId: null,
      referenceId: taskId,
      detail: 'related historical record has matching task identifier but no organization owner',
    });
  const orgIds = [
    ...new Set(
      [row.orgId, row.taskOrgId, row.userOrgId].filter((orgId): orgId is string => Boolean(orgId)),
    ),
  ];
  if (orgIds.length > 1) {
    evidence.push({
      kind: 'no ownership evidence',
      strength: 'conflicting',
      orgId: null,
      referenceId: row.id,
      detail: 'direct organization evidence disagrees',
    });
    return { id: row.id, classification: 'ambiguous', proposedOrgId: null, evidence };
  }
  if (orgIds.length === 1)
    return { id: row.id, classification: 'resolved', proposedOrgId: orgIds[0]!, evidence };
  if (evidence.length === 0)
    evidence.push({
      kind: 'no ownership evidence',
      strength: 'missing',
      orgId: null,
      referenceId: null,
      detail: 'no persisted, task, user, or corroborating ownership evidence',
    });
  return { id: row.id, classification: 'unresolved', proposedOrgId: null, evidence };
}

export function buildTenantOwnershipEvidenceInventory(snapshot: {
  users: UserEvidenceRow[];
  costEntries: CostEvidenceRow[];
}): TenantOwnershipEvidenceInventory {
  const users = snapshot.users.map(classifyUser);
  const costEntries = snapshot.costEntries.map(classifyCostEntry);
  const blockers: string[] = [];
  if (users.some((row) => row.classification !== 'resolved'))
    blockers.push('unresolved or ambiguous User ownership evidence remains');
  if (costEntries.some((row) => row.classification !== 'resolved'))
    blockers.push('unresolved, ambiguous, or conflicting CostEntry ownership evidence remains');
  return { readyForBackfill: blockers.length === 0, blockers, users, costEntries };
}
